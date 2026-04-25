"use client";

import { useState, useEffect } from "react";

const PHRASES = [
  "the people who build them.",
  "data center engineers.",
  "AI infrastructure roles.",
  "critical facilities teams.",
  "the people who keep the world running.",
];

export function HeroTypewriterLine() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const phrase = PHRASES[phraseIndex];
    let t: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === phrase) {
      t = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    } else {
      const delay = isDeleting ? 38 : 72;
      t = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? phrase.slice(0, displayText.length - 1)
            : phrase.slice(0, displayText.length + 1)
        );
      }, delay);
    }

    return () => clearTimeout(t);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <span className="text-[#ABABAB]">
      {displayText}
      <span
        aria-hidden="true"
        className="inline-block ml-1 rounded-sm align-middle"
        style={{
          width: "3px",
          height: "0.82em",
          backgroundColor: "#ABABAB",
          opacity: cursorOn ? 1 : 0,
          transition: "opacity 60ms",
        }}
      />
    </span>
  );
}
