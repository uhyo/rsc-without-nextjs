// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-webpack/client";
import { use } from "react";
import { createRoot } from "react-dom/client";
import { Clock } from "./app/client/Clock.js";

const app = document.getElementById("app");
const ssrData = document.getElementById("ssr-data")?.getAttribute("data-data");

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

const allClientComponents: {
  [K in keyof ClientComponents]: React.FC<ClientComponents[K]>;
} = {
  Clock,
};

const chunk = createFromReadableStream(ssrDataStream);
// @ts-expect-error
globalThis.__webpack_require__ = async () => {
  return allClientComponents;
};

const Container: React.FC = () => {
  return use(chunk);
};

createRoot(app).render(<Container />);
