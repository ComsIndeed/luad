import React, { useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Homepage } from "./Pages/Homepage";
import { paths } from "./Configuration/paths";
import { DocumentPage } from "./Pages/DocumentPage";
import Navigation from "./Components/Navigation";
import { ThemeProvider } from "./Configuration/ThemeContext";
import { useScreenSize } from "./Library/customHooks";
import NotFound from "./Pages/NotFound";

export default function App() {
  let location = useLocation();
  let { isDesktop, isTablet } = useScreenSize();
  return (
    <>
      <ThemeProvider>
        <div className="MediaWrapper">
          {location.pathname != paths.homepage && (
            <Navigation
              targetDevice={
                isDesktop ? "desktops" : isTablet ? "tablets" : "phones"
              }
            />
          )}
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path={paths.homepage} element={<Homepage />} />
            <Route path={paths.documentPage} element={<DocumentPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </>
  );
}
