import { Icon } from "@iconify/react";
import { useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PccsIcon from "../assets/pccs.webp";
import LuadIcon from "../assets/luad.webp";

function Screen({ children, classes }) {
  return <div className={"screen " + classes}>{children}</div>;
}

function BoardMember({ entry }) {
  return (
    <>
      <div className="boardMember">
        {entry ? (
          <LazyLoadImage src={entry.profilePhoto} />
        ) : (
          <Icon icon="mdi:user" />
        )}
        <h3>Name</h3>
        <p>Position</p>
      </div>
    </>
  );
}

export function LearnMoreScreen() {
  const learnMoreScreenReference = useRef(null);
  const handleScroll = (event) => {
    const learnMoreScreenObject = learnMoreScreenReference.current;

    if (
      learnMoreScreenObject.scrollTop ===
      learnMoreScreenObject.scrollHeight - learnMoreScreenObject.clientHeight
    ) {
      event.preventDefault();
    }
  };

  // TEMPORARY
  const generateCarousel = (num) => {
    return Array.from({ length: num }, (_, index) => (
      <LazyLoadImage
        src={`https://source.unsplash.com/random?journalism,photography,broadcasting&v=${Math.random()}`}
        height={200}
        width={350}
      />
    ));
  };

  return (
    <>
      <div
        className="learnMoreScreen"
        ref={learnMoreScreenReference}
        onWheel={handleScroll}
      >
        <Screen classes="screen0">
          <div className="icons">
            <LazyLoadImage src={LuadIcon} />
            <LazyLoadImage src={PccsIcon} />
          </div>
          <h1>Welcome to LUAD Publications</h1>
          <div className="imageCarousel">{generateCarousel(5)}</div>
        </Screen>
        <Screen classes="screen1">
          <h1>Board Members</h1>
          <div className="boardMembers">
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
            <BoardMember />
          </div>
        </Screen>
        <Screen classes="screen2">
          <h1>The history of LUAD</h1>
        </Screen>
      </div>
    </>
  );
}
