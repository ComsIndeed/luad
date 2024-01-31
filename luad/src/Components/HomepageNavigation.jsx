import React from "react";
import { Icon } from "@iconify/react";
import { useScreenSize } from "../Library/customHooks";
import { NavigationLink } from "../Reusables/Clickables";

// PAGINATION BUTTONS SAVE
{
  /* <div className="PaginationButtons">
<button>
  <Icon icon="mingcute:left-fill" />
</button>
<p> 255/255 </p>
<button>
  <Icon icon="mingcute:right-fill" />
</button>
</div> */
}

function ForDesktops() {
  return (
    <>
      <div className="left">
        <div className="Buttons">
          <button>
            <Icon icon="material-symbols:menu" />
          </button>
          <button>
            <Icon icon="material-symbols:admin-panel-settings" />
          </button>
        </div>
      </div>

      <div className="center">
        <NavigationLink>All</NavigationLink>
        <NavigationLink>Featured</NavigationLink>
        <NavigationLink>Articles</NavigationLink>
        <NavigationLink>Editorials</NavigationLink>
        <NavigationLink>Literature</NavigationLink>
      </div>

      <div className="right">
        <input
          type="search"
          name="Search"
          placeholder="Search"
          className="Phone"
          id="HomepageNavigation-SearchBar"
        />
      </div>
    </>
  );
}
function ForTablets() {
  return (
    <>
      <div className="left">
        <div className="Buttons">
          <button>
            <Icon icon="material-symbols:admin-panel-settings" />
          </button>
          <button>
            <Icon icon="material-symbols:menu" />
          </button>
        </div>
      </div>

      <div className="center">
        <button>
          <Icon icon="mdi:filter" />
        </button>
      </div>

      <div className="right">
        <input
          type="search"
          name="Search"
          placeholder="Search"
          className="Phone"
          id="HomepageNavigation-SearchBar"
        />
      </div>
    </>
  );
}
function ForPhones() {
  return (
    <>
      <div className="left">
        <div className="Buttons">
          <button>
            <Icon icon="material-symbols:admin-panel-settings" />
          </button>
          <button>
            <Icon icon="material-symbols:menu" />
          </button>
        </div>
      </div>

      <div className="center">
        <button>
          <Icon icon="mdi:filter" />
        </button>
      </div>

      <div className="right">
        <input
          type="search"
          name="Search"
          placeholder="Search"
          className="Phone"
          id="HomepageNavigation-SearchBar"
        />
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
