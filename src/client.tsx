// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-webpack/client";
import { use } from "react";
import { hydrateRoot } from "react-dom/client";
import { allClientComponents } from "./app/client/clientComponents.js";

declare global {
  // injected by server
  let rscData: string[];
}

const app = document.getElementById("app");

if (app === null) {
  throw new Error("Root element does not exist");
}

const { readable: ssrDataStream, writable } = new TransformStream<
  Uint8Array,
  Uint8Array
>();

(() => {
  const encoder = new TextEncoder();
  const writer = writable.getWriter();

  const initialSsrData = rscData;
  rscData = {
    push(chunk: string) {
      writer.write(encoder.encode(chunk + "\n"));
    },
    end() {
      writer.close();
    },
  } as unknown as string[];

  writer.write(encoder.encode(initialSsrData.join("\n") + "\n"));
})();

const chunk = createFromReadableStream(ssrDataStream);
// @ts-expect-error
globalThis.__webpack_require__ = async () => {
  return allClientComponents;
};

const Container: React.FC = () => {
  return use(chunk);
};

hydrateRoot(app, <Container />);
