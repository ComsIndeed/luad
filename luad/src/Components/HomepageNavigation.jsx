import React from "react";
import { Icon } from "@iconify/react";
import { useScreenSize } from "../Library/customHooks";
import { NavigationLink, NavigationButton } from "../Reusables/Clickables";
import { paths } from "../Configuration/paths";

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

function Buttons() {
  return (
    <>
      <div className="Buttons">
        <NavigationButton>
          <Icon icon="material-symbols:menu" />
        </NavigationButton>
        <NavigationLink to={paths.adminPage.dashboard}>
          <Icon icon="material-symbols:admin-panel-settings" />
        </NavigationLink>
        <NavigationLink to={paths.accountPage}>
          <Icon icon="material-symbols:account-circle" />{" "}
        </NavigationLink>
      </div>
    </>
  );
}

function ForDesktops() {
  return (
    <>
      <div className="left">
        <Buttons />
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
      <div className="top">
        <Buttons />

        <input
          type="search"
          name="Search"
          placeholder="Search"
          className="Phone"
          id="HomepageNavigation-SearchBar"
        />
      </div>
      <div className="bottom">
        <div className="center">
          <NavigationLink>All</NavigationLink>
          <NavigationLink>Featured</NavigationLink>
          <NavigationLink>Articles</NavigationLink>
          <NavigationLink>Editorials</NavigationLink>
          <NavigationLink>Literature</NavigationLink>
        </div>
      </div>
    </>
  );
}
function ForPhones() {
  return (
    <>
      <div className="top">
        <Buttons />

        <input
          type="search"
          name="Search"
          placeholder="Search"
          className="Phone"
          id="HomepageNavigation-SearchBar"
        />
      </div>
      <div className="bottom">
        <div className="center">
          <NavigationLink>All</NavigationLink>
          <NavigationLink>Featured</NavigationLink>
          <NavigationLink>Articles</NavigationLink>
          <NavigationLink>Editorials</NavigationLink>
          <NavigationLink>Literature</NavigationLink>
        </div>
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
