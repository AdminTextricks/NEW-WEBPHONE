import { useState } from "react";
import classnames from "classnames";
import { BiPhoneCall } from "react-icons/bi";
import { useRedux } from "../../../hooks";
import { handleCallClicked } from "../../../redux/sessionCall/actions";
import {
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
} from "../../../redux/actions";

interface ContactItemProps {
  contact: any;
  onSelectChat: (number: string | number) => void;
}

const ContactItem = ({ contact }: ContactItemProps) => {

  const { dispatch } = useRedux();

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
            <span
              className={classnames(
                "avatar-title",
                "rounded-circle",
                "font-size-40",
                "text-uppercase",
                "bx bx-user",
                colors[color],
              )}
            >
            </span>
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
