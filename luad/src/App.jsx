import { ReactDOM } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Homepage } from "./Pages/Homepage";
import { LandingPage } from "./Pages/LandingPage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/GetStarted" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
