import { useState, useEffect } from "react";

// Custom hook for screen size detection
export const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      setIsDesktop(screenWidth >= 1024);
      setIsTablet(screenWidth >= 768 && screenWidth < 1024);
      setIsPhone(screenWidth < 768);
    };

    // Initial screen size determination
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isDesktop, isTablet, isPhone };
};
