"use client";
import React from "react";
import Image from "next/image";

interface Teaser2Props {
  onGetStarted: () => void;
  activeBar: number;
  setActiveBar: (idx: number) => void;
}

const Teaser2: React.FC<Teaser2Props> = ({
  onGetStarted,
  activeBar,
  setActiveBar,
}) => {
  const bars = [0, 1];
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[##01060D]">
   
      <Image 
      src="/images/zeno-icon.png"
        alt="Logo"
        className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 z-20"
        width={100}
        height={100}
/> 

      <div className="flex flex-col w-full max-w-6xl items-center justify-center px-12">
        <h1 className="text-white font-bold text-8xl leading-tight mb-4 -mt-10 text-center">
          How <span className=" text-cyan-300"> Zeno AI </span>works?
        </h1>

        <p className="text-cyan-100 text-xl mb-8 text-center">
          Please watch the video for step-by-step instructions.
        </p>

        <div className="flex justify-center mb-8 w-full">
          <div className="w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video autoPlay loop muted controls className="w-full h-full">
              <source src="/images/backk.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="flex items-center mb-10 space-x-3">
          {bars.map((bar) => (
            <button
              key={bar}
              onClick={() => setActiveBar(bar)}
              aria-label={`Go to step ${bar + 1}`}
              className={`w-8 h-2 rounded-full transition ${
                activeBar === bar
                  ? "bg-cyan-400"
                  : "bg-cyan-900 border border-cyan-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onGetStarted}
          className="bg-cyan-300 text-lg text-[#0B182F] font-bold px-16 py-3 rounded-full hover:bg-cyan-200 transition cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Teaser2;