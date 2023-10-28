import { Clock } from "./Clock.js";

export const allClientComponents: {
  [K in keyof ClientComponents]: React.FC<ClientComponents[K]>;
} = {
  Clock,
};
