import {
  NavItem,
  UncontrolledTooltip,
  NavLink,
  DropdownItem,
} from "reactstrap";

import { LAYOUT_MODES } from "../constants/index";

interface LightDarkProps {
  layoutMode: any;
  onChangeLayoutMode: any;
  title?: string;
}

const LightDarkMode = ({
  title,
  layoutMode,
  onChangeLayoutMode,
}: LightDarkProps) => {
  const mode =
    layoutMode === LAYOUT_MODES["DARK"]
      ? LAYOUT_MODES["LIGHT"]
      : LAYOUT_MODES["DARK"];
  return (
    <>
      <DropdownItem
        className="d-flex align-items-center justify-content-between"
        onClick={() => onChangeLayoutMode(mode)}
      >
        {title}
        {layoutMode === "dark" ? (
          <i className="bx bx-moon"></i>
        ) : (
          <i className="bx bx-sun"></i>
        )}
      </DropdownItem>
    </>

    // <NavItem className="mt-auto" id="color-mode">
    //   <NavLink
    //     className="nav-link light-dark"
    //     style={{
    //       cursor: "pointer",
    //     }}
    //     onClick={() => onChangeLayoutMode(mode)}
    //   >
    //   {title}  <i className="bx bx-moon" id="moon"></i>{" "}
    //   </NavLink>{" "}
    //   <UncontrolledTooltip placement="right" target="color-mode">
    //     <span className="light-mode">Light</span>
    //     <span className="dark-mode">Dark</span> Mode{" "}
    //   </UncontrolledTooltip>{" "}
    // </NavItem>
  );
};

export default LightDarkMode;
