"use client";

import React, { useState } from "react";
import Teaser from "./teaser-one/page";
import Teaser2 from "./teaser-two/page";
import { useRouter } from "next/navigation";

const TeaserScreen: React.FC = () => {
  const [showInitial, setShowInitial] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [activeBar, setActiveBar] = useState(0);
  const router = useRouter();

  const handleContinue = () => setActiveBar((prev) => Math.min(prev + 1, 1));
  const handleGetStarted = () => router.push("/signup");
  const handleSkip = () => router.push("/siginin");

  const onSplashTimeout = () => {
    setFadeOut(true);
    setTimeout(() => setShowInitial(false), 700);
  };

  return (
    <div className="relative min-h-screen">
      <div
        className={`relative z-10 ${
          showInitial ? "pointer-events-none select-none" : ""
        }`}
      >
        {activeBar === 0 ? (
          <Teaser
            onContinue={handleContinue}
            onSkip={handleSkip}
            activeBar={activeBar}
            setActiveBar={setActiveBar}
          />
        ) : (
          <Teaser2
            onGetStarted={handleGetStarted}
            activeBar={activeBar}
            setActiveBar={setActiveBar}
          />
        )}
      </div>
    </div>
  );
};

export default TeaserScreen;