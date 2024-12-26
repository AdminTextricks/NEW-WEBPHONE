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
  Badge,
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
import classnames from "classnames";

// menu
import { MENU_ITEMS, MenuItemType } from "./menu";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";

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
  layoutMode: string;
  onChangeLayoutMode: () => void;
  isActive: false;
  onChangeTab: (
    id: TABS.CALLS | TABS.CHAT | TABS.CONTACTS | TABS.USERS,
  ) => void;
}

const ProfileDropdownMenu = ({
  onChangeLayoutMode,
  layoutMode,
  onChangeTab,
  isActive,
}: ProfileDropdownMenuProps) => {
  const userData = useSelector((state: any) => state.Login);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  const handleClickLogout = async () => {
    try {
      await axios.get(
        `https://pbxlivebackend.callanalog.com/public/api/UnregisterSip/${userData?.user?.name}`
      );
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem('user');
      window.location.reload();
    }
  };


  return (
    <Dropdown
      nav
      isOpen={dropdownOpen}
      className="profile-user-dropdown mt-auto"
      toggle={toggle}
    >
      <DropdownToggle nav className="bg-transparent position-relative">
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaCircleUser
              // className="username"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
          <div
            className="blinking-icon"
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              width: "10px",
              height: "10px",
              backgroundColor: isActive ? "#00FF54" : "#ef0808",
              borderRadius: "50%",
              opacity: 1
            }}
          ></div>
        </div>
      </DropdownToggle>

      <DropdownMenu>
        <LightDarkMode
          title="Mode"
          layoutMode={layoutMode}
          onChangeLayoutMode={onChangeLayoutMode}
        />
        <DropdownItem
          className="d-flex cursor-pointer align-items-center justify-content-between"
          tag="a"
          onClick={handleClickLogout}
        // href="/logout"
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

          {/* <LightDarkMode
            layoutMode={layoutMode}
            onChangeLayoutMode={onChangeLayoutMode}
          /> */}

          <ProfileDropdownMenu
            layoutMode={layoutMode}
            onChangeLayoutMode={onChangeLayoutMode}
            isActive={isActive}
            onChangeTab={onChangeTab}
          />
        </Nav>
      </div>
    </div>
  );
};

export default SideMenu;
