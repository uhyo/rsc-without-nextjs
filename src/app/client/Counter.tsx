import { useState } from "react";

declare global {
  interface ClientComponents {
    Counter: {};
  }
}

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};
