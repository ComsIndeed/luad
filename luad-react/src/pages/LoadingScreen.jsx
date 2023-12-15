import Pot from "../assets/pot.png";

export default function LoadingScreen(props) {
  return (
    <>
      <div className="loadingScreen">
        <img className="Pot" src={Pot} />
        <h3 className="Pot-text">
          {props.children ? props.children : "Loading"}
        </h3>
      </div>
    </>
  );
}
