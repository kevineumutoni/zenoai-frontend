"use client";

import React, { useState } from "react";
import Teaser from "./teaser-one/page";
import Teaser2 from "./teaser-two/page";
import { useRouter } from "next/navigation";

const TeaserScreen: React.FC = () => {
  const [activeBar, setActiveBar] = useState(0);
  const router = useRouter();

  const handleContinue = () => setActiveBar((prev) => Math.min(prev + 1, 1));
  const handleGetStarted = () => router.push("/signin");
  const handleSkip = () => router.push("/signin");

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
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