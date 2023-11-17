import { Link } from "react-router-dom"

export function Homepage() {
  return (
    <>
      <h1>The homepage</h1>
      <Link to="/GetStarted">Landing Page</Link>
    </>
  )
}