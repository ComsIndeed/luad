import React, { useRef, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Homepage } from "./Pages/Homepage";
import { paths } from "./Configuration/paths";
import { DocumentPage } from "./Pages/DocumentPage";
import Navigation from "./Components/Navigation";
import { ThemeProvider } from "./Configuration/ThemeContext";
import { useScreenSize } from "./Library/customHooks";
import NotFound from "./Pages/NotFound";
import AccountPage from "./Pages/AccountPage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Library/firebase";

export default function App() {
  let location = useLocation();
  let { isDesktop, isTablet } = useScreenSize();

  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((result) => {
        setIsAdmin(result?.claims?.admin);
      });
    }
  }, [user]);

  return (
    <>
      <ThemeProvider>
        <div className="MediaWrapper">
          {location.pathname != paths.homepage && (
            <Navigation
              targetDevice={
                isDesktop ? "desktops" : isTablet ? "tablets" : "phones"
              }
            />
          )}
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route
              path={paths.homepage}
              element={<Homepage isAdmin={isAdmin} />}
            />
            <Route path={paths.documentPage} element={<DocumentPage />} />
            <Route path={paths.accountPage} element={<AccountPage />} />
            <Route
              path={paths.adminPage}
              element={<AdminPage isAdmin={isAdmin} />}
            />
          </Routes>
        </div>
      </ThemeProvider>
    </>
  );
}
