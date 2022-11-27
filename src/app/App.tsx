// import { Clock } from "./Clock.js";
import { Page } from "./Page.js";

const Clock = {
  $$typeof: Symbol.for("react.module.reference"),
  filepath: "src/app/Clock.tsx",
  name: "Clock",
} as unknown as React.ComponentType;

export const App: React.FC = () => {
  return (
    <Page>
      <p>Hello, world!</p>
      <Clock />
    </Page>
  );
};
