import { ReactDOM } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Homepage } from "./pages/Homepage";
import { AboutPage } from "./pages/AboutPage";
import { NavigationBar } from "./Components";

export default function App() {
  return (
    <>
      <BrowserRouter>

        {/* Insert components that use links here */}
        <NavigationBar />

        <Routes>
          <Route path="/luad" element={<Homepage />} />
          <Route path="/luad/about" element={<AboutPage />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}
