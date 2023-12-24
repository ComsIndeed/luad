import React from "react";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./Pages/Homepage";

export default function App() {
  return (
    <>
      <div className="MediaWrapper">
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </>
  );
}
