import React, { useState, useEffect } from "react";
import H1 from "./H1";

export default function KillChatButton({ killChat }: { killChat: () => void }) {
  const [killing, setKilling] = useState(false);
  const [quickChange, setQuickChange] = useState(false); // Track when to speed up

  useEffect(() => {
    if (killing) {
      // After 4 seconds, speed up the animation
      const speedUpTimeout = setTimeout(() => {
        setQuickChange(true);
      }, 5000);

      //   // After 5 seconds, stop the animation
      //   const stopTimeout = setTimeout(() => {
      //     setKilling(false); // Reset the animation state
      //     setQuickChange(false); // Reset quick change state
      //   }, 5000);

      // Cleanup timeouts on unmount or when killing state changes
      return () => {
        // clearTimeout(speedUpTimeout);
        // clearTimeout(stopTimeout);
      };
    }
  }, [killing]);

  const handleClick = () => {
    setKilling(true);
    killChat(); // This function takes 5000ms to complete
  };

  return (
    <button
      className={`hover:text-primary ${
        killing
          ? quickChange
            ? "animate-color-change-quick"
            : "animate-color-change"
          : ""
      }`}
      onClick={handleClick}
      disabled={killing} // Disable the button while killChat is running
    >
      <H1>/kllcht</H1>
    </button>
  );
}
