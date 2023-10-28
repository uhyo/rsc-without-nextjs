import { ReadableStream, TransformStream } from "stream/web";

export class MergedStream<T> extends ReadableStream<T> {
  constructor(streams: readonly ReadableStream<T>[], firstStream: number) {
    const readers = streams.map((stream) => stream.getReader());
    const readings: (Promise<[T, number]> | undefined)[] = [];
    const ends: (() => void)[] = [];
    const endedP = Promise.all(
      streams.map((stream) => {
        return new Promise<void>((resolve) => {
          ends.push(resolve);
        });
      }),
    );
    let firstSent = false;

    super({
      start(controller) {
        endedP.then(() => {
          controller.close();
        });
      },
      pull(controller) {
        return Promise.race(
          readers.map((reader, index): Promise<[T, number]> => {
            if (!firstSent && index !== firstStream) {
              return new Promise<never>(() => {});
            }
            const reading = readings[index];
            if (reading !== undefined) {
              return reading;
            }
            return (readings[index] = reader.read().then(({ value, done }) => {
              if (done) {
                reader.releaseLock();
                ends[index]();
                return new Promise<never>(() => {});
              }
              return [value, index];
            }));
          }),
        ).then(([value, index]) => {
          controller.enqueue(value);
          readings[index] = undefined;
          if (index === firstStream) {
            firstSent = true;
          }
        });
      },
      async cancel(reason) {
        await Promise.all(
          readers.map((reader) => {
            return reader.cancel(reason);
          }),
        );
      },
    });
  }
}

export class LinesStream extends TransformStream<Uint8Array, string> {
  constructor() {
    let partialLine = "";
    const decoder = new TextDecoder();
    super({
      transform(chunk, controller) {
        const lines = decoder.decode(chunk).split("\n");
        const lastLine = lines.pop();
        if (lastLine === undefined) {
          return;
        }
        if (lines[0] === undefined) {
          partialLine += lastLine;
          return;
        }
        lines[0] = partialLine + lines[0];
        for (const line of lines) {
          controller.enqueue(line);
        }
        partialLine = lastLine;
      },
      flush(controller) {
        if (partialLine !== "") {
          controller.enqueue(partialLine);
        }
      },
    });
  }
}

export class RscScriptStream extends TransformStream<string, string> {
  constructor() {
    super({
      transform(chunk, controller) {
        controller.enqueue(
          `<script>globalThis.rscData.push(${JSON.stringify(
            chunk,
          )});</script>\n`,
        );
      },
      flush(controller) {
        controller.enqueue(`<script>globalThis.rscData.end?.();</script>\n`);
      },
    });
  }
}
