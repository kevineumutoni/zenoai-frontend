"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onTimeout?: () => void;
}

const splashScreen: React.FC<SplashScreenProps> = ({ onTimeout }) => {
  useEffect(() => {
    if (onTimeout) {
      const timer = setTimeout(() => onTimeout(), 2000);
      return () => clearTimeout(timer);
    }
  }, [onTimeout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020B19]">
      <Image
        src="/images/zeno.png"
        alt="zeno-logo.png"
        className="w-auto h-auto max-w-[80%] max-h-[50vh] md:max-w-[50%] md:max-h-[30vh] lg:max-w-[40%] lg:max-h-[25vh]"
        width={100}
        height={100}
      />
    </div>
  );
};

export default splashScreen;