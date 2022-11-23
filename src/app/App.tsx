import { Clock } from "./Clock.js";
import { Page } from "./Page.js";

export const App: React.FC = () => {
  return (
    <Page>
      <p>Hello, world!</p>
      <Clock />
    </Page>
  );
};
