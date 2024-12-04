import React, { useState } from "react";
import { Link } from "react-router-dom";

// hooks
import { useRedux } from "../../../hooks/index";
import { useContacts } from "../../../hooks";

interface GroupProps {
  member: any;
}
const Member = ({ member }: GroupProps) => {
  // global store
  const { dispatch } = useRedux();
  const { categorizedContacts } = useContacts();

  var fullName = "";
  var shortName = "";
  if (member.firstName) {
    fullName = `${member.firstName} ${member.lastName}`;
    shortName = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
  } else {
    const result = categorizedContacts.filter(
      categorizedContact => categorizedContact.data[0].id === member,
    );

    if (result[0]) {
      fullName = result[0].data[0].firstName + " " + result[0].data[0].lastName;
      shortName =
        result[0].data[0].firstName.charAt(0) +
        result[0].data[0].lastName.charAt(0);
    }
  }

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
  const onSelectChat = (id: string | number, isChannel?: boolean) => {};

  return (
    <li>
      <Link to="#" onClick={() => onSelectChat(member.id)}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs me-2">
            {member.profileImage ? (
              <div>
                <img
                  src={member.profileImage}
                  className="rounded-circle avatar-xs"
                  alt=""
                />
              </div>
            ) : (
              <span>{shortName}</span>
            )}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">{fullName}</p>
          </div>
          {member.isAdmin && <div className="ms-auto">Admin</div>}
        </div>
      </Link>
    </li>
  );
};
interface GroupsProps {
  chatUserDetails: any;
}

const Members = ({ chatUserDetails }: GroupsProps) => {
  const groups =
    chatUserDetails.members &&
    chatUserDetails.members.length &&
    chatUserDetails.members;
  return (
    <div>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h5 className="font-size-11 text-muted text-uppercase">Members</h5>
        </div>
      </div>

      {groups ? (
        <ul className="list-unstyled chat-list mx-n4">
          {(groups || []).map((member: any, key: number) => (
            <Member key={key} member={member} />
          ))}
        </ul>
      ) : (
        <p>No Groups</p>
      )}
    </div>
  );
};

export default Members;
