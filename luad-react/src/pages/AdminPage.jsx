import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../lib/firestoreControls";
import { HologramLink } from "../Components";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const adminConfig = {
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

function Sidebar() {
  const renderAllPaths = () => {
    return Object.keys(adminConfig.paths).map((path) => {
      return (
        <HologramLink
          key={path}
          to={adminConfig.mainPath + adminConfig.paths[path]}
        >
          {" "}
          {path[0].toUpperCase() + path.slice(1)}{" "}
        </HologramLink>
      );
    });
  };

  return (
    <>
      <nav>{renderAllPaths()}</nav>
    </>
  );
}

// New Layout component
function Layout({ children }) {
  return (
    <div className="adminPageLayout">
      <Sidebar />
      <div className="adminPage">{children}</div>
    </div>
  );
}

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

// Update each individual screen component
function AnalyticsPage() {
  return (
    <Layout>
      <div className="analyticsPage">
        <h1>This is the Analytics Page</h1>
      </div>
    </Layout>
  );
}

function DatabaseScreen() {
  return (
    <Layout>
      <div className="databaseScreen">
        <h1>This is the Database Screen</h1>
      </div>
    </Layout>
  );
}

function DashboardScreen() {
  return (
    <Layout>
      <div className="dashboardScreen">
        <h1>This is the Dashboard Screen</h1>
      </div>
    </Layout>
  );
}

function StorageScreen() {
  return (
    <Layout>
      <div className="storageScreen">
        <h1>This is the Storage Screen</h1>
      </div>
    </Layout>
  );
}

function LogsScreen() {
  return (
    <Layout>
      <div className="logsScreen">
        <h1>This is the Logs Screen</h1>
      </div>
    </Layout>
  );
}

function SettingsScreen() {
  return (
    <Layout>
      <div className="settingsScreen">
        <h1>This is the Settings Screen</h1>
      </div>
    </Layout>
  );
}

export function AdminPageRouters() {
  return (
    <>
      <Routes>
        <Route
          key="analytics"
          path={adminConfig.mainPath + adminConfig.paths.analytics}
          element={<AnalyticsPage />}
        />
        <Route
          key="dashboard"
          path={adminConfig.mainPath + adminConfig.paths.dashboard}
          element={<DashboardScreen />}
        />
        <Route
          key="database"
          path={adminConfig.mainPath + adminConfig.paths.database}
          element={<DatabaseScreen />}
        />
        <Route
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
        />
      </Routes>
    </>
  );
}
