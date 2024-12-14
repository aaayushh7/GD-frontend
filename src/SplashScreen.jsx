import { useState, useEffect } from 'react';

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <img 
        src="./splashScreen.png" 
        alt="Splash Screen"
        className="max-w-md w-3/5 h-auto animate-fade-in"
      />
    </div>
  );
};

export default SplashScreen;