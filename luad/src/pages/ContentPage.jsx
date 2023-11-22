import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

export function CardContent(props) {
  const link = "/luad/post/" + props.entry.id

  return (
    <>
      <Link to={link} className="content">
        <h1 className="content-title"> {props.entry.title} </h1>
        <p className="content-author"> {props.entry.author} </p>
        <p className="content-content"> {props.entry.content} </p>
      </Link>
    </>
  )
}

export default function ContentPage() {
  const { id } = useParams()

  return (
    <>
      <h1>Content Page - { id } </h1>
      <Link to="/luad">Home</Link>
    </>
  )
}