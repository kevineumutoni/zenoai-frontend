'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
  const [fade, setFade] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        router.push('/landing_page');
      }, 700);
    }, 2000);

    return () => {
      clearTimeout(fadeTimeout);
    };
  }, [router]);

  return (
    <div
      className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <Image
        src="/images/zeno-logo.png"
        alt="Zeno Logo"
        width={500}
        height={800}
        className="object-contain"
      />
    </div>
  );
};

export default WelcomePage;