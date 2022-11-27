import React from "react";

declare global {
  interface ClientComponents {}
}

export type ClientComponent<Key extends keyof ClientComponents> = React.FC<
  ClientComponents[Key]
>;
