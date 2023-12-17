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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "./config/firebase";
import { signInWithRedirect } from "firebase/auth";
import LoadingScreen from "./pages/LoadingScreen";

export const paths = {
  homepage: "/",
  contentPage: "post/:id",
  contentPageBlank: "post/",
  aboutPage: "/about",
  profilePage: "/profile",
  redirectPage: "/signInWithRedirect",
  apply: "/applications",
};

function Redirect() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <div className="redirectPage">
        <div className="icon" />
        <h1>Redirecting</h1>
        <p>Please wait</p>
        {loading ? "" : user ? "" : signInWithRedirect(auth, provider)}
        {user ? window.close() : ""}
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Routes>
          <Route path={paths.homepage} element={<Homepage />} />
          <Route path={paths.contentPage} element={<ContentPage />} />
          <Route path={paths.aboutPage} element={<AboutPage />} />
          <Route path={paths.profilePage} element={<ProfilePage />} />
          <Route path={paths.redirectPage} element={<Redirect />} />
          <Route path={paths.apply} element={<LoadingScreen />} />
        </Routes>

        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
}
