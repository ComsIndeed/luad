import React from "react";
import { useScreenSize } from "../Library/customHooks";
import ThemeToggle from "../Reusables/ThemeToggle";

function ForDesktops() {
  return (
    <>
      <input
        type="search"
        name="Search"
        placeholder="Search"
        id="HomepageNavigation-SearchBar"
      />
      <ThemeToggle />
    </>
  );
}
function ForTablets() {
  return (
    <>
      <input
        type="search"
        name="Search"
        placeholder="Search"
        id="HomepageNavigation-SearchBar"
      />
    </>
  );
}
function ForPhones() {
  return (
    <>
      <input
        type="search"
        name="Search"
        placeholder="Search"
        id="HomepageNavigation-SearchBar"
      />
    </>
  );
}

export function HomepageNavigation() {
  const { isDesktop, isTablet, isPhone } = useScreenSize();

  return (
    <>
      <div className="HomepageNavigation">
        {isDesktop && <ForDesktops />}
        {isTablet && <ForTablets />}
        {isPhone && <ForPhones />}
      </div>
    </>
  );
}
