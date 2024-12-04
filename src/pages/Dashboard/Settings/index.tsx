import React, { useState, useEffect } from "react";
// hooks
import { useRedux } from "../../../hooks/index";

// constants
import { SETTINGS_COLLAPSES } from "../../../constants";

// interface
import { SettingsTypes } from "../../../data/settings";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import UserCoverImage from "./UserCoverImage";
import UserProfile from "./UserProfile";
import PersonalInfo from "./PersonalInfo";
import ThemeSettings from "./ThemeSettings";
import Privacy from "./Privacy";
import Security from "./Security";
import Help from "./Help";

interface CollapseItemTypes {
  value:
    | SETTINGS_COLLAPSES.PROFILE
    | SETTINGS_COLLAPSES.HELP
    | SETTINGS_COLLAPSES.PRIVACY
    | SETTINGS_COLLAPSES.SECURITY
    | SETTINGS_COLLAPSES.THEME;
  label: string;
  icon: string;
  component: any;
}

interface AccordianItemProps {
  item: CollapseItemTypes;
  onChange: (
    id:
      | null
      | SETTINGS_COLLAPSES.PROFILE
      | SETTINGS_COLLAPSES.HELP
      | SETTINGS_COLLAPSES.PRIVACY
      | SETTINGS_COLLAPSES.SECURITY
      | SETTINGS_COLLAPSES.THEME,
  ) => void;
  selectedMenu:
    | null
    | SETTINGS_COLLAPSES.PROFILE
    | SETTINGS_COLLAPSES.HELP
    | SETTINGS_COLLAPSES.PRIVACY
    | SETTINGS_COLLAPSES.SECURITY
    | SETTINGS_COLLAPSES.THEME;
}
const AccordianItem = ({
  item,
  selectedMenu,
  onChange,
}: AccordianItemProps) => {
  const isOpen: boolean =
    selectedMenu && selectedMenu === item.value ? true : false;
  const toggleCollapse = () => {
    if (isOpen) {
      onChange(null);
    } else {
      onChange(item.value);
    }
  };
  return (
    <div className="accordion-item">
      <div className="accordion-header" id="headerpersonalinfo">
        <button color="none" onClick={toggleCollapse} type="button">
          <i></i> {item.label}
        </button>
      </div>
      <div
        // isOpen={isOpen}
        id="personalinfo"
        className="accordion-div"
      >
        {item.component}
      </div>
    </div>
  );
};
interface IndexProps {}
const Index = (props: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  // get user settings
  useEffect(() => {}, [dispatch]);

  const [settings, setSettings] = useState<any>(null);

  const onChangeData = (field: string, value: any) => {};

  /*
  collapse handeling
  */
  const [selectedMenu, setSelectedMenu] = useState<
    | null
    | SETTINGS_COLLAPSES.PROFILE
    | SETTINGS_COLLAPSES.HELP
    | SETTINGS_COLLAPSES.PRIVACY
    | SETTINGS_COLLAPSES.SECURITY
    | SETTINGS_COLLAPSES.THEME
  >(null);

  const collapseItems: CollapseItemTypes[] = [
    {
      value: SETTINGS_COLLAPSES.PROFILE,
      label: "Personal Info",
      icon: "bx bxs-user",
      component: <PersonalInfo basicDetails={settings.basicDetails} />,
    },
    {
      value: SETTINGS_COLLAPSES.THEME,
      label: "Themes",
      icon: "bx bxs-adjust-alt",
      component: (
        <ThemeSettings theme={settings.theme} onChangeData={onChangeData} />
      ),
    },
    {
      value: SETTINGS_COLLAPSES.PRIVACY,
      label: "Privacy",
      icon: "bx bxs-lock",
      component: (
        <Privacy privacy={settings.privacy} onChangeSettings={onChangeData} />
      ),
    },
    {
      value: SETTINGS_COLLAPSES.SECURITY,
      label: "Security",
      icon: "bx bxs-check-shield",
      component: (
        <Security
          security={settings.security}
          onChangeSettings={onChangeData}
        />
      ),
    },
    {
      value: SETTINGS_COLLAPSES.HELP,
      label: "Help",
      icon: "bx bxs-help-circle",
      component: <Help />,
    },
  ];

  const onChangeCollapse = (
    id:
      | null
      | SETTINGS_COLLAPSES.PROFILE
      | SETTINGS_COLLAPSES.HELP
      | SETTINGS_COLLAPSES.PRIVACY
      | SETTINGS_COLLAPSES.SECURITY
      | SETTINGS_COLLAPSES.THEME,
  ) => {
    setSelectedMenu(id);
  };

  return (
    <div className="position-relative">
      <UserCoverImage basicDetails={settings.basicDetails} />

      <UserProfile
        basicDetails={settings.basicDetails}
        status={settings.status}
      />
      {/* Start User profile description */}
      <AppSimpleBar className="user-setting">
        <div id="settingprofile" className="accordion accordion-flush">
          {(collapseItems || []).map((item: CollapseItemTypes, key: number) => (
            <AccordianItem
              item={item}
              key={key}
              selectedMenu={selectedMenu}
              onChange={onChangeCollapse}
            />
          ))}
        </div>
      </AppSimpleBar>
    </div>
  );
};

export default Index;
