"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface TextColorProps {
  words: string[];
}

export function TextColor({ words }: TextColorProps) {
  return (
    <div className="relative">
      <h1 className="flex select-none flex-col text-left font-display leading-[0.95]">
        {words.map((word, index) => (
          <span
            key={index}
            data-content={word}
            className={`before:animate-gradient-background-${index + 1} relative before:absolute before:left-0 before:top-0 before:z-0 before:w-full before:content-[attr(data-content)]`}
            style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
          >
            <span className={`from-gradient-${index + 1}-start to-gradient-${index + 1}-end animate-gradient-foreground-${index + 1} bg-gradient-to-r bg-clip-text text-transparent`}>
              {word}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
