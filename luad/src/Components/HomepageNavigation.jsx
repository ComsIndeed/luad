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

function Buttons({ isAdmin }) {
  return (
    <>
      <div className="Buttons">
        <NavigationButton>
          <Icon icon="material-symbols:menu" />
        </NavigationButton>
        {isAdmin && (
          <NavigationLink to={paths.adminPage}>
            <Icon icon="material-symbols:admin-panel-settings" />
          </NavigationLink>
        )}
        <NavigationLink to={paths.accountPage}>
          <Icon icon="material-symbols:account-circle" />
        </NavigationLink>
      </div>
    </>
  );
}

function ForDesktops({ isAdmin }) {
  return (
    <>
      <div className="left">
        <Buttons isAdmin={isAdmin} />
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

function ForTablets({ isAdmin }) {
  return (
    <>
      <div className="top">
        <Buttons isAdmin={isAdmin} />

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
function ForPhones({ isAdmin }) {
  return (
    <>
      <div className="top">
        <Buttons isAdmin={isAdmin} />

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

export function HomepageNavigation({ isAdmin }) {
  const { isDesktop, isTablet, isPhone } = useScreenSize();

  return (
    <>
      <div className="HomepageNavigation">
        {isDesktop && <ForDesktops isAdmin={isAdmin} />}
        {isTablet && <ForTablets isAdmin={isAdmin} />}
        {isPhone && <ForPhones isAdmin={isAdmin} />}
      </div>
    </>
  );
}
