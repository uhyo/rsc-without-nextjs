import { Suspense } from "react";
import { Client } from "./Client.js";
import { Page } from "./Page.js";
import { Uhyo } from "./Uhyo.js";

export const App: React.FC = () => {
  return (
    <Page>
      <p>Hello, world!</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Uhyo />
      </Suspense>
      <Client.Clock />
    </Page>
  );
};
