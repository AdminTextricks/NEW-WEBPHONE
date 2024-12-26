import { useState } from "react";
import classnames from "classnames";

// import {
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Button,
// } from "reactstrap";

import { ContactTypes } from "../../../data/contacts";
// import { BsChatText } from "react-icons/bs";
import { BiPhoneCall } from "react-icons/bi";
// import { TABS } from "../../../constants";
import { useRedux } from "../../../hooks";
// import { changeTab } from "../../../redux/actions";
import { handleCallClicked } from "../../../redux/sessionCall/actions";
import {
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
} from "../../../redux/actions";

interface ContactItemProps {
  contact: ContactTypes;
  onSelectChat: (number: string | number) => void;
}

const ContactItem = ({ contact, onSelectChat }: ContactItemProps) => {
  const { dispatch } = useRedux();

  // const [dropdownOpen, setDropdownOpen] = useState(false);

  // const toggle = () => setDropdownOpen(!dropdownOpen);

  const agent_name = `${contact.agent_name}`;
  const callbackextension = `${contact.callbackextension}`;
  const name = `${contact.name}`;

  const colors = [
    "bg-primary",
    "bg-danger",
    "bg-info",
    "bg-warning",
    "bg-secondary",
    "bg-pink",
    "bg-purple",
  ];
  
  const [color] = useState(Math.floor(Math.random() * colors.length));

  const handleClickCall = (call: any) => {
    const call_detail = {
      number: call.callbackextension,
      name: call.agent_name,
    };
    dispatch(handleCallClicked(call_detail));
  };

  const handleSelectUser = (id: any) => {
    dispatch(getChatUserDetails(id));
    dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id));
  };

  return (
    <li>
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 me-2">
          <div className="avatar-xs">
            {contact.profileImage ? (
              <img
                src={contact.profileImage}
                alt=""
                className="img-fluid rounded-circle"
              />
            ) : (
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "font-size-10",
                  "text-uppercase",
                  colors[color],
                )}
              >
                {/* {shortName} */}
              </span>
            )}
          </div>
        </div>
        <div
          className="flex-grow-1"
          onClick={() => handleSelectUser(contact.callbackextension)}
        >
          <h5 className="font-size-14 m-0">{agent_name}</h5>
          <h5 className="font-size-14 m-0">
            {name}{" "}
            <span className="font-size-10 l-2">({callbackextension})</span>
          </h5>
        </div>
        <div className="flex-shrink-0">
          <div onClick={() => handleClickCall(contact)}>
            <BiPhoneCall
              size={20}
              className="bx bxs-message-alt-detail text-primary m-1"
            />
          </div>

          {/* <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle tag="a" className="text-mute">
              <i className="bx bx-dots-vertical-rounded align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={() => handleClickCall(contact)}
              >
                Call <BiPhoneCall />
              </DropdownItem>
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={() => handleClickChat(TABS.CHAT)}
              >
                Chat <BsChatText />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </div>
      </div>
    </li>
  );
};

const CharacterItem = ({ letterContacts, index, onSelectChat }: any) => {
  return (
    <div className="mt-1">
      <div className={classnames({ "mt-1": index !== 0 })}>
        <ul className="list-unstyled contact-list">
          {(letterContacts || []).map((contact: any, key: number) => (
            <ContactItem
              contact={contact}
              key={key}
              onSelectChat={onSelectChat}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CharacterItem;
