
import { ReactDOM } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Homepage } from "./Pages/Homepage";
import { LandingPage } from "./Pages/LandingPage";
import { NavigationBar } from "./Components";


export default function App() {
  return (
    <>
    {/* <NavigationBar /> */}
      <BrowserRouter basename={import.meta.env.DEV ? '/' : '/react-vite-gh-pages/'}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/GetStarted" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
