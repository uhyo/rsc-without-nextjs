import { Readable, PassThrough } from "stream";
import ReactDOM from "react-dom/server";
// @ts-expect-error
import rsdws from "react-server-dom-webpack/server";
const { renderToPipeableStream } = rsdws;
// @ts-expect-error
import rsdwc from "react-server-dom-webpack/client";
const { createFromReadableStream } = rsdwc;

import { App } from "./app/server/App.js";
import { bundlerConfig } from "./app/server/Client.js";
// @ts-expect-error
import { use } from "react";

const stream = Readable.toWeb(
  renderToPipeableStream(<App />, bundlerConfig).pipe(new PassThrough())
);

const chunk = createFromReadableStream(stream);
// @ts-expect-error
globalThis.__webpack_require__ = () => new Promise(() => {});

const Container = () => {
  return use(chunk);
};

const controls = ReactDOM.renderToPipeableStream(<Container />, {
  onShellReady() {
    // @ts-expect-error
    controls.abort("");
  },
});
controls.pipe(process.stdout);
