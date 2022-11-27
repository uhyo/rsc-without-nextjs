// @ts-expect-error
import rsdws from "react-server-dom-webpack/server";
const { renderToPipeableStream } = rsdws;

import { App } from "./app/App.js";

const bundlerConfig = {
  "src/app/Clock.tsx": {
    Clock: {
      id: "Clock.tsx",
      name: "Clock",
      chunks: ["pika", "chu"],
    },
  },
};

renderToPipeableStream(<App />, bundlerConfig).pipe(process.stdout);
