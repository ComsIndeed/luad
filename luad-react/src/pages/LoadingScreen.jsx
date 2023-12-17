import Pot from "../assets/pot.png";

export default function LoadingScreen({ children }) {
  return (
    <>
      <div className="loadingScreen">
        <img className="Pot" src={Pot} />
        <h1 className="Pot-text">{children ? children : "Loading..."}</h1>
      </div>
    </>
  );
}
