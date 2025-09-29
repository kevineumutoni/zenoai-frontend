"use client";

import React from "react";
import Image from "next/image";

interface TeaserProps {
  onContinue: () => void;
  onSkip: () => void;
  activeBar: number;
  setActiveBar: (idx: number) => void;
}

const Teaser: React.FC<TeaserProps> = ({
  onContinue,
  onSkip,
  activeBar,
  setActiveBar,
}) => {
  const bars = [0, 1];
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="images/backk.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-[#07162A]/70 z-10" />

      <Image
        src="/images/zeno-icon.png"
        alt="Logo"
        className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 z-20"
        width={100}
        height={100}
      />

      <button
        onClick={onSkip}
        className="absolute top-4 right-4 md:top-8 md:right-12 border border-cyan-300 rounded-full px-4 py-1 md:px-8 md:py-2 text-cyan-200 font-semibold text-sm md:text-base hover:bg-white-300/70 transition z-20 cursor-pointer"
      >
        Skip
      </button>

      <div className="relative z-20 flex flex-col items-center w-3/4 mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex flex-col items-center w-full mt-4 md:mt-8">
          <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-5xl lg:text-8xl text-center mb-4 md:mb-6 leading-tight whitespace-pre-line">
            Your <span className="text-cyan-300">Data</span> has a Story. What
            if You Could <span className="text-cyan-300">Read</span> it?
          </h1>
          <p className="text-cyan-100 text-lg sm:text-xl md:text-2xl text-center mb-4 md:mb-8 w-full sm:w-3/4 md:w-2/4 leading-tight">
            The AI platform that transforms complex data into clear actionable
            foresight for economists.
          </p>

          <div className="flex items-center mb-4 md:mb-8 space-x-2 md:space-x-3">
            {bars.map((bar) => (
              <button
                key={bar}
                onClick={() => setActiveBar(bar)}
                aria-label={`Go to step ${bar + 1}`}
                className={`w-6 h-1.5 md:w-8 md:h-2 rounded-full transition ${
                  activeBar === bar
                    ? "bg-cyan-400"
                    : "bg-cyan-900 border border-cyan-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={onContinue}
            className="bg-cyan-300 text-base md:text-lg text-[#0B182F] font-bold px-8 md:px-16 py-2 md:py-3 rounded-full hover:bg-cyan-200 transition cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teaser;