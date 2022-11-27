import type {} from "react/canary";
import { Readable, PassThrough } from "stream";
import { writeFile } from "fs/promises";
// @ts-expect-error
import rsdws from "react-server-dom-webpack/server";
const { renderToPipeableStream } = rsdws;

import { App } from "./app/server/App.js";
import { bundlerConfig } from "./app/server/Client.js";

const stream = Readable.toWeb(
  renderToPipeableStream(<App />, bundlerConfig).pipe(new PassThrough())
);

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
    <div id="app"></div>
    <script id="ssr-data" type="text/plain" data-data="`;

  const decoder = new TextDecoder("utf-8");
  for await (const chunk of stream) {
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
