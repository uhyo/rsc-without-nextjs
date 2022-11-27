import { useEffect, useState } from "react";
import { ClientComponent } from "../shared/registry.js";

declare global {
  interface ClientComponents {
    Clock: {};
  }
}

export const Clock: ClientComponent<"Clock"> = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <p>{time}</p>;
};
