import { useState } from "react";
import { Button } from "reactstrap";

// interface
import { CallItem } from "../../../data/calls";
import AudioCallModal from "../../../components/AudioCallModal";
import { MdPhoneMissed } from "react-icons/md";

import "../../../assets/scss/custom.css";
import { calculateTimeDifference } from "../../../utils";
import { useDispatch } from "react-redux";
import { handleCallClicked } from "../../../redux/sessionCall/actions";

interface CallProps {
  call: any;
}

const Call = ({ call }: CallProps) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState<null | CallItem>(null);

  const [isOpenAudioModal, setIsOpenAudioModal] = useState<boolean>(false);

  const onCloseAudio = () => {
    setUser(null);
    setIsOpenAudioModal(false);
  };

  const handleClickCall = (call: any) => {
    dispatch(handleCallClicked(call));
  };

  return (
    <>
      <li>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">
              {call.name === "" ? call.number : `${call.name}`}
            </p>
            <div className="text-muted font-size-12 text-truncate">
              {call.direction === "incoming" ? (
                <>
                  {call.causes === "Missed" ? (
                    <MdPhoneMissed className="text-danger align-center me-1" />
                  ) : (
                    <i className="ri-arrow-left-down-fill text-success align-bottom me-1"></i>
                  )}
                </>
              ) : (
                <i className="ri-arrow-right-up-fill text-danger align-bottom me-1"></i>
              )}
              {call.startTime}
            </div>
          </div>
          <div className="flex-shrink-0 ms-3">
            <div className="d-flex align-items-center gap-3">
              <div>
                <h5 className="mb-0 font-size-12 text-muted">
                  {call.status === "Missed" ? (
                    ""
                  ) : (
                    <>
                      {call.endTime
                        ? calculateTimeDifference(call.startTime, call.endTime)
                        : ""}
                    </>
                  )}
                </h5>
              </div>

              {call.status === "ringing" ? (
                <div>
                  <Button
                    color="link"
                    type="button"
                    className="p-0 font-size-20 stretched-link"
                  >
                    <i className="bx bxs-phone-call align-middle blinking-icon"></i>
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    color="link"
                    type="button"
                    className="p-0 font-size-20 stretched-link "
                    onClick={() => handleClickCall(call)}
                  >
                    <i className="bx bxs-phone-call align-middle"></i>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </li>
      <AudioCallModal
        isOpen={isOpenAudioModal}
        onClose={onCloseAudio}
        user={user}
      />
    </>
  );
};

export default Call;
