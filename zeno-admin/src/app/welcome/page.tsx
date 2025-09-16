'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
  const [fade, setFade] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fadeTimeout = setTimeout(() => setFade(true), 2000);
    const routeTimeout = setTimeout(() => {
      router.push('/signin');
    }, 3000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(routeTimeout);
    };
  }, [router]);

  return (
    <div
      className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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