import { Client } from "./Client.js";
import { Page } from "./Page.js";

export const App: React.FC = () => {
  return (
    <Page>
      <p>Hello, world!</p>
      <Client.Clock />
    </Page>
  );
};
