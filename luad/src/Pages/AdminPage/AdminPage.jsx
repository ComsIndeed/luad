import ContentManagement from "./ContentManagementSection";
import Dashboard from "./Dashboard";
import React from "react";

// React.lazy()

export default function AdminPage({ isAdmin }) {
  return (
    <>
      <div className="AdminPage">
        {isAdmin ? (
          <>
            <Dashboard />
            <ContentManagement />
          </>
        ) : (
          <h1>Error: Not enough permissions.</h1>
        )}
      </div>
    </>
  );
}
