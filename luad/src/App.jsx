import { ReactDOM } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Homepage } from "./pages/Homepage";
import { AboutPage } from "./pages/AboutPage";
import { NavigationBar } from "./Components";
import ContentPage from "./pages/ContentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TimelinePage } from "./pages/TimelinePage";
import { BoardMembersPage } from "./pages/BoardMembersPage";

export default function App() {


  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Routes>
          <Route path="/luad" element={<Homepage />} />
          <Route path="/luad/post/:id" element={<ContentPage />} />
          <Route path="/luad/about" element={<AboutPage />} />
          <Route path="/luad/profile" element={ <ProfilePage /> } />
          <Route path="/luad/timeline" element={ <TimelinePage /> } />
          <Route path="/luad/boardmembers" element={ <BoardMembersPage /> } />
        </Routes>

      </BrowserRouter>
    </>
  );
}
