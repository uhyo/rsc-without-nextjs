import type {} from "react/canary";
import React, { use } from "react";
import ReactDOM from "react-dom/client";
// @ts-expect-error
import { createFromFetch } from "react-server-dom-webpack/client";
import { Clock } from "./app/Clock.js";

const dataFromServer = `
M1:{"id":"Clock.tsx","name":"Clock","chunks":["pika","chu"]}
J0:["$","div",null,{"children":[["$","h1",null,{"children":"React Server Components example"}],[["$","p",null,{"children":"Hello, world!"}],["$","@1",null,{}]]]}]
`;

const root = document.getElementById("app")!;

const chunk = createFromFetch(
  fetch(`data:text/plain;base64,${btoa(dataFromServer)}`)
);

// @ts-expect-error
globalThis.__webpack_chunk_load__ = async (chunkId: string) => {
  console.log(`Chunk '${chunkId}' is loaded`);
};

// @ts-expect-error
globalThis.__webpack_require__ = (moduleId: string) => {
  if (moduleId === "Clock.tsx") {
    return {
      Clock,
    };
  } else {
    throw new Error(`Unknown module ID '${moduleId}'`);
  }
};

const Container: React.FC = () => {
  return use(chunk);
};

ReactDOM.createRoot(root).render(<Container />);
