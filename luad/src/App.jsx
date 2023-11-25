import { ReactDOM } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  HashRouter,
} from "react-router-dom";

import { Homepage } from "./pages/Homepage";
import { AboutPage } from "./pages/AboutPage";
import { NavigationBar } from "./Components";
import ContentPage from "./pages/ContentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TimelinePage } from "./pages/TimelinePage";
import { BoardMembersPage } from "./pages/BoardMembersPage";

export const paths = {
  homepage: "/",
  contentPage: "post/:id",
  contentPageBlank: "post/",
  aboutPage: "/about",
  profilePage: "/profile",
  timelinePage: "/timeline",
  boardMembersPage: "/boardmembers",
};

export default function App() {
  return (
    <>
      <HashRouter>
        <NavigationBar />

        <Routes>
          <Route path={paths.homepage} element={<Homepage />} />
          <Route path={paths.contentPage} element={<ContentPage />} />
          <Route path={paths.aboutPage} element={<AboutPage />} />
          <Route path={paths.profilePage} element={<ProfilePage />} />
          <Route path={paths.timelinePage} element={<TimelinePage />} />
          <Route path={paths.boardMembersPage} element={<BoardMembersPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}
