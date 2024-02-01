import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <div className="NotFoundPage">
        <h1>Error</h1>
        <h2>Page not found</h2>
        <Link to="/">Home</Link>
      </div>
    </>
  );
}
