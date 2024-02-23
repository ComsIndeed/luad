export default function AdminPage({ isAdmin }) {
  return (
    <>
      <div className="AdminPage">
        {isAdmin ? (
          <>
            <DashboardPage />
            <ContentManagementPage />
          </>
        ) : (
          <h1>Error: Not enough permissions.</h1>
        )}
      </div>
    </>
  );
}

function DashboardPage() {
  return (
    <>
      <div className="DashboardPage">
        <h1>This is the admin page</h1>
      </div>
    </>
  );
}

function ContentManagementPage() {
  return (
    <>
      <div className="ContentManagementPage">
        <h1>THis is the CMS page</h1>
      </div>
    </>
  );
}
