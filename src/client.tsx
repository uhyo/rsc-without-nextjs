// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-webpack/client";
import { use } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Clock } from "./app/client/Clock.js";
import { allClientComponents } from "./app/client/clientComponents.js";

const app = document.getElementById("app");
const ssrData = document.getElementById("rsc-data")?.getAttribute("data-data");

if (app === null) {
  throw new Error("Root element does not exist");
}

if (ssrData == null) {
  throw new Error("ssrData is not provided");
}

const { readable: ssrDataStream, writable } = new TransformStream<
  Uint8Array,
  Uint8Array
>();

(async () => {
  const encoder = new TextEncoder();
  const writer = writable.getWriter();
  await writer.write(encoder.encode(ssrData));
  await writer.close();
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
