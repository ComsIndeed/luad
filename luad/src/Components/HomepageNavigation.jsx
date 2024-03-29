import React from "react";
import { Icon } from "@iconify/react";
import { useScreenSize } from "../Library/customHooks";
import { NavigationLink, NavigationButton } from "../Reusables/Clickables";
import { paths } from "../Configuration/paths";
import "animate.css";
import { Content } from "../Configuration/config";

function SearchBar() {
  return (
    <div className="SearchBar">
      <Icon
        icon="material-symbols:search"
        width="1.5em"
        height="1.5em"
        className="SearchBar-Icon"
      />
      <input
        type="search"
        name="Search"
        placeholder="Search"
        className="SearchBar-Input"
        id="HomepageNavigation-SearchBar"
      />
    </div>
  );
}

function CategorySelection({ setSelectedCategory, selectedCategory }) {
  return (
    <div className="categorySelection">
      <NavigationButton
        className={selectedCategory === "all" && "selected"}
        onClick={() => {
          setSelectedCategory("all");
        }}
      >
        All
      </NavigationButton>
      {Content.categories.map((item) => {
        return (
          <NavigationButton
            className={selectedCategory === item && "selected"}
            key={item}
            onClick={() => {
              setSelectedCategory(item);
            }}
          >
            {item[0].toUpperCase() + item.slice(1)}{" "}
          </NavigationButton>
        );
      })}
    </div>
  );
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

function ForDesktops({ isAdmin, setSelectedCategory, selectedCategory }) {
  return (
    <>
      <div className="left">
        <Buttons isAdmin={isAdmin} />
      </div>

      <div className="center">
        <CategorySelection
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="right">
        <SearchBar />
      </div>
    </>
  );
}

function ForTablets({ isAdmin, setSelectedCategory, selectedCategory }) {
  return (
    <>
      <div className="top">
        <Buttons isAdmin={isAdmin} />

        <SearchBar />
      </div>
      <div className="bottom">
        <div className="center">
          <CategorySelection
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </>
  );
}
function ForPhones({ isAdmin, setSelectedCategory, selectedCategory }) {
  return (
    <>
      <div className="top">
        <Buttons isAdmin={isAdmin} />

        <SearchBar />
      </div>
      <div className="bottom">
        <div className="center">
          <CategorySelection
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </>
  );
}

export function HomepageNavigation({
  isAdmin,
  setSelectedCategory,
  selectedCategory,
}) {
  const { isDesktop, isTablet, isPhone } = useScreenSize();

  return (
    <>
      <div className="HomepageNavigation animate__animated animate__fadeIn">
        {isDesktop && (
          <ForDesktops
            isAdmin={isAdmin}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}
        {isTablet && (
          <ForTablets
            isAdmin={isAdmin}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}
        {isPhone && (
          <ForPhones
            isAdmin={isAdmin}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    </>
  );
}
