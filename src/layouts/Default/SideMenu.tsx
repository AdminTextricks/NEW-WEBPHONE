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
import LightLogo from "../../assets/images/LightLogo.png";
import DarkLogo from "../../assets/images/DarkLogo.png";
//images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import classnames from "classnames";

// menu
import { MENU_ITEMS, MenuItemType } from "./menu";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";

const LogoDarkPNG = () => {
  return (
    <img
      src={DarkLogo}
      alt="Call Analog"
      className="img-thumbnail"

    />
  );
};

const LogoLightPNG = () => {
  return (
    <img
      src={LightLogo}
      alt="Call Analog"
      className="img-thumbnail"
    />
  );
};

const SidebarLogo = () => {
  return (
    <div className="navbar-brand-box" >
      <Link to="#" className="logo logo-dark">
        <span className="logo-md">
          <LogoLightPNG />
        </span>
      </Link>

      <Link to="#" className="logo logo-light">
        <span className="logo-sm">
          <LogoDarkPNG />
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
          <i className={item.icon} style={{ fontSize: 30 }}></i>
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
        `https://pbxbackend.callanalog.com/public/api/UnregisterSip/${userData?.user?.name}`
      );
    } catch (error) {
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
      <SidebarLogo />
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
