import Dashboard from "./Dashboard";
import React from "react";

const ContentManagement = React.lazy(() =>
  import("./ContentManagementSection")
);

export default function AdminPage({ isAdmin }) {
  return (
    <>
      <div className="AdminPage">
        {isAdmin ? (
          <>
            <Dashboard />
            <React.Suspense>
              <ContentManagement />
            </React.Suspense>
          </>
        ) : (
          <h1>Error: Not enough permissions.</h1>
        )}
      </div>
    </>
  );
}
