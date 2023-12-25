import React from "react";
import { Icon } from "@iconify/react";
import { useMediaWrapperRef } from "../Configuration/MediaWrapperContext";

export default function ThemeToggle() {
  const MediaWrapperReference = useMediaWrapperRef();

  return (
    <>
      <button
        title="ThemeToggle"
        onClick={() => {
          alert("Not yet working, sorry");
        }}
      >
        <Icon icon="ph:moon-fill" color="#1100be" />
      </button>
    </>
  );
}
