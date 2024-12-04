import { Button, Modal, ModalBody } from "reactstrap";
import { CallItem } from "../data/calls";
import imagePlaceholder from "../assets/images/users/user-dummy-img.jpg";
import { FiPhone } from "react-icons/fi";
import { useEffect, useState } from "react";
import { formatTimer } from "../utils";
import { useAppSelector } from "../redux/hook";
import { selectElapsedTime } from "../redux/sessionCall/itilities";

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

  // Check if the browser supports setSinkId
  if (typeof audioElement.setSinkId === "function") {
    try {
      // Detect mobile or desktop
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      console.log(isMobile);

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
          console.log("Audio set to speaker on mobile");
        } else {
          console.warn("No speaker device found for mobile");
        }
      } else {
        // Use the default device for desktop
        if (audioOutputDevices.length > 0) {
          await audioElement.setSinkId(audioOutputDevices[0].deviceId);
          console.log("Audio set to desktop speaker");
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
  const elapsedTime = useAppSelector(selectElapsedTime);
  const audioContext = new (window.AudioContext || window.BaseAudioContext)();

  const [incomingCalling, setIncomingCalling] = useState(true);

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
        console.log(incomingSession?.connection);
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
            Incoming...
          </h4>
          {!incomingCalling && formatTimer(elapsedTime)}
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
        </div>

        <div className="p-4 bg-soft-primary mt-n4">
          <div className="mt-4 text-center">
            <h5 className="font-size-18 mb-0 text-truncate">
              {user ? `${user.number}` : ""}
            </h5>
            <h6 className="font-size-15 mb-0 text-truncate">
              {user ? `${user.name}` : ""}
            </h6>
          </div>
        </div>
        <audio id="remoteAudio" autoPlay></audio>
      </ModalBody>
    </Modal>
  );
};

export default AudioCallModal;
