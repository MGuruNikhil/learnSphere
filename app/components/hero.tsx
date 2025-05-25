import React from "react";
import { FlipWords } from "./ui/flip-words";
import { BackgroundLines } from "./ui/background-lines";
import { AnimatedModalDemo } from "./button";

export default function Hero() {
  const words = ["smarter", "sleeker", "cleaner"];
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <div>
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        Make your notebook look{" "}
        <br />10X{""}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <FlipWords words={words} /> <br />
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <FlipWords words={words} /> <br />
          </div>
        </div>
      </h2>
      <p className="text-center text-neutral-500 dark:text-neutral-400 mt-4">
        The best notebook experience you&apos;ll ever have.
      </p>
      <div className="flex justify-center mt-8">
        <AnimatedModalDemo /> 
      </div>
      
      </div>
    </BackgroundLines>
  );
}
