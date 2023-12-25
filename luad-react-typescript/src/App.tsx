import React from "react";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./Pages/Homepage";
import { paths } from "./Configuration/paths";
import { DocumentPage } from "./Pages/DocumentPage";

export default function App() {
  return (
    <>
      <div className="MediaWrapper">
        <Routes>
          <Route path={paths.homepage} element={<Homepage />} />
          <Route path={paths.documentPage} element={<DocumentPage />} />
        </Routes>
      </div>
    </>
  );
}
