import React, { useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Homepage } from "./Pages/Homepage";
import { paths } from "./Configuration/paths";
import { DocumentPage } from "./Pages/DocumentPage";
import Navigation from "./Components/Navigation";
import { MediaWrapperProvider } from "./Configuration/MediaWrapperContext";

export default function App() {
  let location = useLocation();
  const MediaWrapperReference = useRef(null);

  return (
    <>
      <MediaWrapperProvider>
        <div className="MediaWrapper" ref={MediaWrapperReference}>
          {location.pathname != paths.homepage && <Navigation />}
          <Routes>
            <Route path={paths.homepage} element={<Homepage />} />
            <Route path={paths.documentPage} element={<DocumentPage />} />
          </Routes>
        </div>
      </MediaWrapperProvider>
    </>
  );
}
