import type {} from "react/canary";
import { spawn } from "child_process";
import http from "http";
import { Readable, PassThrough } from "stream";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";

import ReactDOM from "react-dom/server";
// @ts-expect-error
import rsdwc from "react-server-dom-webpack/client";
const { createFromReadableStream } = rsdwc;

import { allClientComponents } from "./app/client/clientComponents.js";
import { use } from "react";

function render() {
  const rscFile = fileURLToPath(
    new URL("./rsc.js", import.meta.url).toString(),
  );
  const proc = spawn("node", ["--conditions", "react-server", rscFile], {
    stdio: ["ignore", "pipe", "inherit"],
  });
  return proc.stdout;
}

// @ts-expect-error
globalThis.__webpack_require__ = async () => {
  return allClientComponents;
};

async function renderHTML(): Promise<Readable> {
  const [stream1, stream2] = Readable.toWeb(render()).tee();

  const chunk = createFromReadableStream(stream1);
  // const rscData = await readAll(stream2);

  const PageContainer: React.FC = () => {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
        </head>
        <body>
          <div id="app">{use(chunk)}</div>
          {/* <script id="rsc-data" data-data={rscData} /> */}
        </body>
      </html>
    );
  };

  const htmlStream = ReactDOM.renderToPipeableStream(<PageContainer />, {
    bootstrapModules: ["src/client.tsx"],
  }).pipe(new PassThrough());

  return htmlStream;
}

const server = http.createServer((req, res) => {
  renderHTML()
    .then((html) => {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      html.pipe(res);
    })
    .catch((error) => {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end(String(error));
    });
});
server.listen(8888, () => {
  console.log("Listening on http://localhost:8888");
});
