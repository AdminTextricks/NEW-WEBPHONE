import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";
import { createSelector } from "reselect";
// hooks
import { useRedux } from "../../hooks/index";

// actions
import { changeTab } from "../../redux/actions";

// costants
import { TABS } from "../../constants/index";
import LightDarkMode from "../../components/LightDarkMode";

//images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

// menu
import { MENU_ITEMS, MenuItemType } from "./menu";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";

const LogoLightSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
    >
      <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z" />
    </svg>
  );
};

const LogoDarkSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
    >
      <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z" />
    </svg>
  );
};

const Logo = () => {
  return (
    <div className="navbar-brand-box">
      <Link to="#" className="logo logo-dark">
        <span className="logo-sm">
          Logo
          {/* <LogoLightSVG /> */}
        </span>
      </Link>

      <Link to="#" className="logo logo-light">
        <span className="logo-sm">
          Logo
          {/* <LogoDarkSVG /> */}
        </span>
      </Link>
    </div>
  );
};

interface MenuNavItemProps {
  item: MenuItemType;
  selectedTab: TABS.CALLS | TABS.CHAT | TABS.CONTACTS | TABS.USERS;
  onChangeTab: (
    id: TABS.CALLS | TABS.CHAT | TABS.CONTACTS | TABS.USERS,
  ) => void;
}
const MenuNavItem = ({ item, selectedTab, onChangeTab }: MenuNavItemProps) => {
  const onClick = () => {
    onChangeTab(item.tabId);
  };
  return (
    <>
      <NavItem className={item.className} id={`${item.key}-container`}>
        <NavLink
          href="#"
          active={selectedTab === item.tabId}
          id={item.key}
          role="tab"
          onClick={onClick}
        >
          <i className={item.icon}></i>
        </NavLink>
      </NavItem>
      <UncontrolledTooltip target={`${item.key}-container`} placement="right">
        {item.tooltipTitle}
      </UncontrolledTooltip>
    </>
  );
};

interface ProfileDropdownMenuProps {
  isActive: false;
  onChangeTab: (
    id: TABS.CALLS | TABS.CHAT | TABS.CONTACTS | TABS.USERS,
  ) => void;
}
const ProfileDropdownMenu = ({
  onChangeTab,
  isActive,
}: ProfileDropdownMenuProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown
      nav
      isOpen={dropdownOpen}
      className="profile-user-dropdown"
      toggle={toggle}
    >
      <DropdownToggle nav className="bg-transparent position-relative">
        {/* <img
        // src={avatar1}
        alt="Profile"
        className="profile-user rounded-circle"
        style={{ width: '40px', height: '40px' }} // Inline style for the image size
      /> */}
        <FaCircleUser style={{ width: "40px", height: "40px" }} />
        <span
          className={` ${isActive ? "bg-success" : "bg-danger"} rounded-circle`}
          style={{
            position: "absolute",
            width: "12px",
            height: "12px",
            top: "-2px", // Slightly above the image
            right: "-2px", // Slightly to the right of the image
            transform: "translate(-100%, 100%)",
            border: "2px solid white", // Optional: adds a border to separate from the image
          }}
        ></span>
      </DropdownToggle>

      <DropdownMenu>
        {/* <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.USERS)}
        >
          Profile <i className="bx bx-user-circle text-muted ms-1"></i>
        </DropdownItem> */}
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          tag="a"
          href="/logout"
        >
          Log out <i className="bx bx-log-out-circle text-muted ms-1"></i>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const SideMenu = ({ onChangeLayoutMode }: any) => {
  const { dispatch, useAppSelector } = useRedux();

  const menuItems: MenuItemType[] = MENU_ITEMS;

  const { isActive } = useSelector((state: any) => ({
    isActive: state.SIPReducer.isActive,
  }));

  const errorData = createSelector(
    (state: any) => state.Layout,
    state => ({
      activeTab: state.activeTab,
      layoutMode: state.layoutMode,
    }),
  );

  const { activeTab, layoutMode } = useAppSelector(errorData);

  const [selectedTab, setSelectedTab] = useState<
    TABS.CALLS | TABS.CHAT | TABS.CONTACTS | TABS.USERS
  >(TABS.CHAT);

  const onChangeTab = (
    id: TABS.CALLS | TABS.CHAT | TABS.CONTACTS | TABS.USERS,
  ) => {
    setSelectedTab(id);
    dispatch(changeTab(id));
  };

  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  return (
    <div className="side-menu flex-lg-column">
      {/* LOGO */}
      <Logo />
      <div className="flex-lg-column my-0 sidemenu-navigation">
        <Nav pills className="side-menu-nav" role="tablist">
          {(menuItems || []).map((item: MenuItemType, key: number) => (
            <MenuNavItem
              item={item}
              key={key}
              selectedTab={selectedTab}
              onChangeTab={onChangeTab}
            />
          ))}

          <LightDarkMode
            layoutMode={layoutMode}
            onChangeLayoutMode={onChangeLayoutMode}
          />

          <ProfileDropdownMenu isActive={isActive} onChangeTab={onChangeTab} />
        </Nav>
      </div>
    </div>
  );
};

export default SideMenu;
