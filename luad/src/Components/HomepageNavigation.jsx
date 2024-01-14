import React from "react";
import { Icon } from "@iconify/react";
import { useScreenSize } from "../Library/customHooks";

function ForDesktops() {
  return (
    <>
      <div className="PaginationButtons">
        <button>
          <Icon icon="mingcute:left-fill" />
        </button>
        <p> 255/255 </p>
        <button>
          <Icon icon="mingcute:right-fill" />
        </button>
      </div>
      <button>
        <Icon icon="mdi:filter" />
      </button>
      <input
        type="search"
        name="Search"
        placeholder="Search"
        className="Phone"
        id="HomepageNavigation-SearchBar"
      />
      <div className="Buttons">
        <button>
          <Icon icon="material-symbols:admin-panel-settings" />
        </button>
        <button>
          <Icon icon="material-symbols:menu" />
        </button>
      </div>
    </>
  );
}
function ForTablets() {
  return (
    <>
      <div className="PaginationButtons">
        <button>
          <Icon icon="mingcute:left-fill" />
        </button>
        <p> 255/255 </p>
        <button>
          <Icon icon="mingcute:right-fill" />
        </button>
      </div>
      <button>
        <Icon icon="mdi:filter" />
      </button>
      <input
        type="search"
        name="Search"
        placeholder="Search"
        className="Phone"
        id="HomepageNavigation-SearchBar"
      />
      <div className="Buttons">
        <button>
          <Icon icon="material-symbols:admin-panel-settings" />
        </button>
        <button>
          <Icon icon="material-symbols:menu" />
        </button>
      </div>
    </>
  );
}
function ForPhones() {
  return (
    <>
      <div className="PaginationButtons">
        <button>
          <Icon icon="mingcute:left-fill" />
        </button>
        <p> 255/255 </p>
        <button>
          <Icon icon="mingcute:right-fill" />
        </button>
      </div>
      <button>
        <Icon icon="mdi:filter" />
      </button>
      <input
        type="search"
        name="Search"
        placeholder="Search"
        className="Phone"
        id="HomepageNavigation-SearchBar"
      />
      <div className="Buttons">
        <button>
          <Icon icon="material-symbols:admin-panel-settings" />
        </button>
        <button>
          <Icon icon="material-symbols:menu" />
        </button>
      </div>
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
