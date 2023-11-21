
import { BrowserRouter, Link } from "react-router-dom";

export function NavigationBar() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </BrowserRouter>
    </>
  );
}
