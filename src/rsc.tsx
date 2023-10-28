import type {} from "react/canary";
// @ts-expect-error
import rsdws from "react-server-dom-webpack/server";
const { renderToPipeableStream } = rsdws;

import { App } from "./app/server/App.js";
import { bundlerConfig } from "./app/server/Client.js";

const stream = renderToPipeableStream(<App />, bundlerConfig);

stream.pipe(process.stdout);