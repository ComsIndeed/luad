
import { ReactDOM } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Homepage } from "./Pages/Homepage";
import { LandingPage } from "./Pages/LandingPage";
import { NavigationBar } from "./Components";


export default function App() {
  return (
    <>
    {/* <NavigationBar /> */}
      <BrowserRouter >
        <Routes>
          <Route path="/luad" element={<Homepage />} />
          <Route path="/GetStarted" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
