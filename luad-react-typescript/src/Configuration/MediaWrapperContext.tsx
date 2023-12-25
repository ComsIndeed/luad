// MediaWrapperContext.tsx
import React, { createContext, useContext, useRef, ReactNode } from "react";

interface MediaWrapperContextProps {
  children: ReactNode;
}

interface MediaWrapperContextValue {
  mediaWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}

const MediaWrapperContext = createContext<MediaWrapperContextValue | undefined>(
  undefined
);

export const MediaWrapperProvider: React.FC<MediaWrapperContextProps> = ({
  children,
}: MediaWrapperContextProps) => {
  const mediaWrapperRef = useRef<HTMLDivElement | null>(null);

  const contextValue: MediaWrapperContextValue = {
    mediaWrapperRef,
  };

  return (
    <MediaWrapperContext.Provider value={contextValue}>
      {children}
    </MediaWrapperContext.Provider>
  );
};

export const useMediaWrapperRef =
  (): React.MutableRefObject<HTMLDivElement | null> => {
    const context = useContext(MediaWrapperContext);

    if (!context) {
      throw new Error(
        "useMediaWrapperRef must be used within a MediaWrapperProvider"
      );
    }

    return context.mediaWrapperRef;
  };
