import { Readable, PassThrough } from "stream";
import { writeFile } from "fs/promises";
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

const [stream1, stream2] = Readable.toWeb(
  renderToPipeableStream(<App />, bundlerConfig).pipe(new PassThrough())
).tee();

class ClientComponentError extends Error {}

const chunk = createFromReadableStream(stream1);
// @ts-expect-error
globalThis.__webpack_require__ = async () => {
  throw new ClientComponentError("Client Component");
};

const Container = () => {
  return use(chunk);
};

renderHTML().then(async (html) => {
  await writeFile("./index.html", html);
});

async function renderHTML() {
  let result = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="app">`;

  const htmlStream = ReactDOM.renderToPipeableStream(<Container />, {
    onError(error) {
      if (error instanceof ClientComponentError) {
        // 握りつぶす
        return;
      }
      console.error(error);
    },
  }).pipe(new PassThrough());
  for await (const chunk of htmlStream) {
    result += chunk;
  }

  result += `</div>
    <script id="ssr-data" type="text/plain" data-data="`;

  const decoder = new TextDecoder("utf-8");
  for await (const chunk of stream2) {
    result += escapeHTML(decoder.decode(chunk));
  }

  result += `"></script>
    <script type="module" src="src/client.tsx"></script>
  </body>
</html>`;
  return result;
}

const escapeHTMLTable: Partial<Record<string, string>> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&#x27;",
  '"': "&quot;",
};

function escapeHTML(str: string) {
  return str.replace(/[<>&'"]/g, (char) => escapeHTMLTable[char] ?? "");
}
