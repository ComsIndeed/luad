import ContentManagement from "./ContentManagementSection";
import Dashboard from "./Dashboard";

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
