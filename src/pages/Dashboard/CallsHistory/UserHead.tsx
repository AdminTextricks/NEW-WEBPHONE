import { useState } from "react";
import { Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { useRedux } from "../../../hooks/index";
import { changeSelectedChat } from "../../../redux/actions";
import { getFirstLetter } from "../../../utils";
import { handleCallClicked } from "../../../redux/sessionCall/actions";

interface ProfileImageProps {
  callUserDetails?: any;
  onCloseConversation?: () => any;
  onOpenUserDetails?: () => any;
}
const ProfileImage = ({
  callUserDetails,
  onCloseConversation,
  onOpenUserDetails,
}: ProfileImageProps) => {
  const fullName = callUserDetails?.agent_name
    ? callUserDetails.agent_name
    : `--`;

  const intercom = callUserDetails?.callbackextension
    ? callUserDetails.callbackextension
    : `--`;

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

  const isOnline = true;

  return (
    <div className="d-flex align-items-center">
      <div className="flex-shrink-0 d-block d-lg-none me-2">
        <Link
          to="#"
          onClick={onCloseConversation}
          className="user-chat-remove text-muted font-size-24 p-2"
        >
          <i className="bx bx-chevron-left align-middle"></i>
        </Link>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center">
          <div
            className={classnames(
              "flex-shrink-0",
              "chat-user-img",
              "align-self-center",
              "me-3",
              "ms-0",
              { online: isOnline },
            )}
          >
            <div className="avatar-sm align-self-center">
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "text-uppercase",
                  "text-white",
                  colors[color],
                )}
              >
                <span className="username">{getFirstLetter(fullName)}</span>
                {/* <span className="user-status"></span> */}
              </span>
            </div>
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <h6 className="text-truncate mb-0 font-size-18">
              <Link
                to="#"
                onClick={onOpenUserDetails}
                className="user-profile-show text-reset"
              >
                {fullName}
              </Link>
            </h6>
            <p className="text-truncate text-muted mb-0">
              <small>{intercom}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserHeadProps {
  callUserDetails: any;
}

const UserHead = ({ callUserDetails }: UserHeadProps) => {
  const { dispatch } = useRedux();

  const onCloseConversation = () => {
    dispatch(changeSelectedChat(null));
  };

  const handleClickCall = () => {
    const call_detail = {
      number: callUserDetails.callbackextension,
      name: callUserDetails.agent_name,
    };
    dispatch(handleCallClicked(call_detail));
  };

  return (
    <div className="p-3 p-lg-4 user-chat-topbar">
      <Row className="align-items-center">
        <Col sm={4} className="col-8">
          <ProfileImage
            callUserDetails={callUserDetails}
            onCloseConversation={onCloseConversation}
          />
        </Col>
        <Col sm={8} className="col-4">
          <ul className="list-inline user-chat-nav text-end mb-0">
            <li className="list-inline-item d-lg-none d-inline-block ms-0">
              <Button
                type="button"
                color="none"
                className="btn nav-btn"
                onClick={() => handleClickCall()}
              >
                <i className="bx bxs-phone-call"></i>
              </Button>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default UserHead;
