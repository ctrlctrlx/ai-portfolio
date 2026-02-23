"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  /** Delay in ms before starting (default 200) */
  startDelay?: number;
  /** Typing speed in ms per character (default 40) */
  speed?: number;
}

export default function Typewriter({ text, startDelay = 200, speed = 40 }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, startDelay, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" aria-hidden="true" />}
    </span>
  );
}
