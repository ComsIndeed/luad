import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

import Database from "../adminPages/Database";
import Dashboard from "../adminPages/Dashboard";

export const adminConfig = {
  mainPath: "/admin",
  paths: {
    dashboard: `/dashboard`,
    analytics: `/analytics`,
    database: `/database`,
    storage: `/storage`,
    logs: `/logs`,
    settings: `/settings`,
  },
};

export function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(adminConfig.mainPath + adminConfig.paths.dashboard);
  }, []);

  return (
    <>
      <LoadingScreen />
    </>
  );
}

export function AdminPageRouters() {
  return (
    <>
      <Routes>
        {/* <Route
          key="analytics"
          path={adminConfig.mainPath + adminConfig.paths.analytics}
          element={<AnalyticsPage />}
        /> */}
        <Route
          key="dashboard"
          path={adminConfig.mainPath + adminConfig.paths.dashboard}
          element={<Dashboard />}
        />
        <Route
          key="database"
          path={adminConfig.mainPath + adminConfig.paths.database}
          element={<Database />}
        />
        {/* <Route
          key="storage"
          path={adminConfig.mainPath + adminConfig.paths.storage}
          element={<StorageScreen />}
        />
        <Route
          key="logs"
          path={adminConfig.mainPath + adminConfig.paths.logs}
          element={<LogsScreen />}
        />
        <Route
          key="settings"
          path={adminConfig.mainPath + adminConfig.paths.settings}
          element={<SettingsScreen />}
        /> */}
      </Routes>
    </>
  );
}
