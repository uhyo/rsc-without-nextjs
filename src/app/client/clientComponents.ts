import { Clock } from "./Clock.js";
import { Counter } from "./Counter.js";

export const allClientComponents: {
  [K in keyof ClientComponents]: React.FC<ClientComponents[K]>;
} = {
  Clock,
  Counter,
};
