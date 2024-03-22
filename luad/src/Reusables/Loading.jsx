import React, { useState, useEffect } from "react";
import Pot from "../Assets/pot.png"; // Assuming Pot is your image import

export function Loading() {
  const [x, setX] = useState(1);

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      setX((prev) => {
        if (prev >= 3) {
          return 1;
        } else {
          return prev + 1;
        }
      });
    }, 350);

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <div className="Loading">
      <img className="Pot" src={Pot} alt="Loading Icon" width={250} />
      <h1>Loading{".".repeat(x)}</h1>
    </div>
  );
}
