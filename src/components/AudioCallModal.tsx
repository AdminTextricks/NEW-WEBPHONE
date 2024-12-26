import { Button, Modal, ModalBody } from "reactstrap";
import { CallItem } from "../data/calls";
import imagePlaceholder from "../assets/images/users/user-dummy-img.jpg";
import { FiPhone } from "react-icons/fi";
import { useEffect, useState } from "react";
import { formatTimer } from "../utils";
import { selectElapsedTime } from "../redux/sessionCall/itilities";
import { useRedux } from "../hooks";
import { useSelector } from "react-redux";
import { CiNoWaitingSign } from "react-icons/ci";
import { FaPhone, FaPhoneSlash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setWaitBtnClicked } from "../redux/sessionCall/actions";

interface AudioCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CallItem | null;
  session?: any;
  setSession?: any;
  incomingSession?: any;
}

const handleAudioOutput = async () => {
  const audioElement: any = document.getElementById("remoteAudio");

  if (typeof audioElement.setSinkId === "function") {
    try {
      // Detect mobile or desktop
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      // Get all available audio devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter(
        device => device.kind === "audiooutput",
      );

      if (isMobile) {
        // Use the first available speaker for mobile
        const speakerDevice = audioOutputDevices.find(device =>
          device.label.toLowerCase().includes("speaker"),
        );
        if (speakerDevice) {
          await audioElement.setSinkId(speakerDevice.deviceId);
        } else {
          console.warn("No speaker device found for mobile");
        }
      } else {
        // Use the default device for desktop
        if (audioOutputDevices.length > 0) {
          await audioElement.setSinkId(audioOutputDevices[0].deviceId);
        }
      }
    } catch (error) {
      console.error("Error setting audio output:", error);
    }
  } else {
    console.warn("setSinkId not supported in this browser");
  }
};

const AudioCallModal = ({
  isOpen,
  user,
  session,
  setSession,
  incomingSession,
}: AudioCallModalProps) => {
  const dispatch = useDispatch();
  const { isCallWaiting } = useSelector((state: any) => ({
    isCallWaiting: state.CallHistory.isCallWaiting
  }));
  const { useAppSelector } = useRedux();

  const elapsedTime = useAppSelector(selectElapsedTime);
  const audioContext = new (window.AudioContext || window.BaseAudioContext)();

  const [incomingCalling, setIncomingCalling] = useState(true);

  const { callData } = useAppSelector((state: any) => ({
    callData: state.CallHistory.callData,
  }));

  const handleClickWaitingBtn = () => {
    dispatch(setWaitBtnClicked(!isCallWaiting));
  }

  const handleHangup = () => {
    if (session) {
      session.terminate();
      setSession(null);
      setIncomingCalling(false);
    }
  };

  const handleAccept = () => {
    if (session) {
      setIncomingCalling(false);
      session.answer();
    }
  };

  useEffect(() => {
    const startListening = () => {
      if (!incomingSession) {
        console.error("No active incomingSession");
        return;
      }
      incomingSession?.connection?.addEventListener("track", (e: any) => {
        if (e.track.kind === "audio") {
          audioContext.resume().then(() => {
            const remoteAudio: any = document.getElementById("remoteAudio");
            remoteAudio.play().catch((error: any) => {
              console.error("Audio playback failed:", error);
            });
          });
        }
      });
    };

    if (incomingSession) {
      setIncomingCalling(true);
      startListening();
    }

    return () => {
      if (incomingSession) {
        incomingSession?.connection?.removeEventListener(
          "track",
          startListening,
        );
      }
    };
  }, [incomingSession]);

  return (
    <Modal
      isOpen={isOpen}
      tabIndex={-1}
      centered
      className="audiocallModal"
      contentClassName="shadow-lg border-0"
    >
      <ModalBody className="p-0">
        <div className="text-center p-4 pb-0">
          <div className="avatar-xl mx-auto mb-4">
            <img
              src={imagePlaceholder}
              alt="user_image"
              className="img-thumbnail rounded-circle"
            />
          </div>

          <h4
            className={`${!incomingCalling ? "none" : "block blinking-icon"}`}
          >
            {user?.direction === "incoming" ? "Calling from" : "Calling to"}
          </h4>
          <div className="mt-4 text-center">
            {user?.direction === "incoming" ? (
              <>
                <h5 className="font-size-18 mb-0 text-truncate">
                  {user ? `${user.number}` : ""}
                </h5>
                <h6 className="font-size-15 mb-0 text-truncate">
                  {user ? `${user.name}` : ""}
                </h6>
              </>
            ) : (
              <>
                <h5 className="font-size-18 mb-0 text-truncate">
                  {callData ? `${callData.number}` : ""}
                </h5>
                <h6 className="font-size-15 mb-0 text-truncate">
                  {callData ? `${callData.name}` : ""}
                </h6>
              </>
            )}
          </div>

          <span className={`${elapsedTime !== 0 ? "hidden" : "block"}`}>
            {elapsedTime !== 0 && formatTimer(elapsedTime)}
          </span>

          <div className="d-flex justify-content-center align-items-center mt-4">
            <div className="avatar-md h-auto">
              <Button
                type="button"
                color="light"
                className="avatar-sm rounded-circle"
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="bx bx-microphone-off"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-muted mt-2">
                Mute
              </h5>
            </div>
            <div className="avatar-md h-auto">
              <Button
                type="button"
                color="light"
                className=" avatar-sm rounded-circle"
                onClick={handleAudioOutput}
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="bx bx-volume-full"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-muted mt-2">
                Speaker
              </h5>
            </div>
            <div className="avatar-md h-auto">
              <Button
                color="light"
                type="button"
                className="avatar-sm rounded-circle"
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="bx bx-user-plus"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-muted mt-2">
                Add New
              </h5>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="avatar-md h-auto">
              <Button
                color="light"
                type="button"
                className="avatar-sm rounded-circle"
                onClick={handleClickWaitingBtn}
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  {isCallWaiting ? (
                    <i className="mdi mdi-phone-in-talk" style={{
                      color: 'green'
                    }}></i>
                  ) : (
                    <i className="mdi mdi-phone-minus"></i>
                  )}

                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-waiting mt-2">
                Waiting
              </h5>
            </div>

          </div>



          {user?.direction === "incoming" && (
            <div className="mt-4 d-flex gap-4 justify-content-center">
              <Button
                type="button"
                className="btn btn-danger avatar-md call-close-btn rounded-circle"
                color="danger"
                onClick={handleHangup}
              >
                <span className="avatar-title bg-transparent font-size-24">
                  <i className="mdi mdi-phone-hangup"></i>
                </span>
              </Button>
              <Button
                type="button"
                className="btn btn-danger avatar-md call-close-btn rounded-circle"
                color="primary"
                onClick={handleAccept}
              >
                <span className="avatar-title bg-transparent font-size-24">
                  <FiPhone />
                </span>
              </Button>
            </div>
          )}

          {user?.direction === "outgoing" && (
            <div className="mt-4">
              <Button
                type="button"
                className="btn btn-danger avatar-md call-close-btn rounded-circle"
                color="danger"
                onClick={handleHangup}
              >
                <span className="avatar-title bg-transparent font-size-24">
                  <i className="mdi mdi-phone-hangup"></i>
                </span>
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 bg-soft-primary mt-n4">
          <div className="mt-4 text-center"></div>
        </div>

        <audio id="remoteAudio" autoPlay></audio>
      </ModalBody>
    </Modal >
  );
};

export default AudioCallModal;
