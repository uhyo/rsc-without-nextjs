import React from "react";

export const Page: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <h1>React Server Components example</h1>
      {children}
    </div>
  );
};
