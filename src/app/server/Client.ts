import { ClientComponent } from "../shared/registry.js";

export const Client = new Proxy(
  {},
  {
    get(_, key) {
      return {
        $$typeof: Symbol.for("react.module.reference"),
        filepath: "__mod__",
        name: key,
      };
    },
  }
) as {
  [K in keyof ClientComponents]: ClientComponent<K>;
};

export const bundlerConfig = {
  __mod__: new Proxy(
    {},
    {
      get(_, key) {
        return {
          id: "__mod__",
          name: key,
          chunks: [],
        };
      },
    }
  ),
};
