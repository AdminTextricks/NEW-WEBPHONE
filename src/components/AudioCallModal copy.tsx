import { useEffect, useState } from "react";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { CallItem } from "../data/calls";
import imagePlaceholder from "../assets/images/users/user-dummy-img.jpg";
import { FiPhone } from "react-icons/fi";
import { formatTimer } from "../utils";
import { useRedux } from "../hooks";
import { selectElapsedTime } from "../redux/sessionCall/itilities";
import { FaDeleteLeft } from "react-icons/fa6";

interface AudioCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CallItem | null;
  session?: any;
  setSession?: any;
  incomingSession?: any;
  userAgentSession?: any;
  toggleMicrophone?: any;
  micMute?: any;
  toggleCallHold?: any;
  callHold?: any;
  isChannel?: any;
  onChangeDtmf?: any;
  isTalking?: Boolean;
  setIsTalking?: any;
}

const handleAudioOutput = async () => {
  const audioElement: any = document.getElementById("remoteAudio");

  if (typeof audioElement.setSinkId === "function") {
    try {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter(
        device => device.kind === "audiooutput",
      );
      if (isMobile) {
        const speakerDevice = audioOutputDevices.find(device =>
          device.label.toLowerCase().includes("speaker"),
        );
        if (speakerDevice) {
          await audioElement.setSinkId(speakerDevice.deviceId);
        } else { }
      } else {
        if (audioOutputDevices.length > 0) {
          await audioElement.setSinkId(audioOutputDevices[0].deviceId);
        }
      }
    } catch (error) { }
  } else { }
};

const AudioCallModal = ({
  isOpen,
  user,
  session,
  setSession,
  incomingSession,
  toggleMicrophone,
  micMute,
  toggleCallHold,
  callHold,
  isChannel,
  onChangeDtmf,
  isTalking,
  setIsTalking,
}: AudioCallModalProps) => {

  const { useAppSelector } = useRedux();

  const audioContext = new (window.AudioContext || window.BaseAudioContext)();

  const elapsedTime = useAppSelector(selectElapsedTime);

  const callData = useAppSelector((state: any) => state.CallHistory.callData);

  const [clearTimeoutId, setClearTimeoutId] = useState<any>(null);
  const [incomingCalling, setIncomingCalling] = useState(true);

  const [dialPadModal, setDialPadModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const [transferSubmitModal, setDialSubmitModal] = useState(false);
  const [input, setInput] = useState("");
  const [btnType, setBtnType] = useState('transfer');

  const [dtmfKey, setDtmfKey] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setDialPadModal(false);
      setDialSubmitModal(false);
      setDtmfKey('');
    }

  }, [isOpen]);

  const handleClickConferenceBtn = (e: any) => {
    setBtnType('conference')
    e.preventDefault();
    setDialSubmitModal(true);
    setDtmfKey('*3');
  }

  const handleClickBlindTransferBtn = (e: any) => {
    setBtnType('transfer')
    e.preventDefault();
    setDialSubmitModal(true);
    setDtmfKey('##');
  }

  // ~~~~~~~~~~~~~~~~~Dial Pad Modal~~~~~~~~~~~~~~~~~~~~~~~~~~

  const toggleDialPadModalNested = () => {
    setDialPadModal(!dialPadModal);
  };

  const handleButtonClick = (value: any) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const lastDigit = value.slice(-1);
    onChangeDtmf(lastDigit);
    setTypingTimeout(
      setTimeout(() => {
        if (value.length > 1) {
          onChangeDtmf(value);
        }
      }, 3000)
    );
    setInputValue(prevInput => prevInput + value);
  };

  const handleInputValueChange = (event: any) => {
    const value: string = event.target.value;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const lastDigit = value.slice(-1);
    onChangeDtmf(lastDigit);
    setTypingTimeout(
      setTimeout(() => {
        if (value.length > 1) {
          onChangeDtmf(value);
        }
      }, 3000)
    );
    setInputValue(value);
  };

  const handleClear = () => {
    setInputValue(prevInput => prevInput.slice(0, -1));
  };

  const handleLongClear = () => {
    setInputValue("");
  };

  const handleOpenDialpadModal = () => {
    setDialPadModal(true);
  }

  // ~~~~~~~~~~~~~~~~~Transfer DialPad Modal~~~~~~~~~~~~~~~~~~~~~~~~~~

  const toggleTransferModal = () => {
    setDialSubmitModal(!transferSubmitModal);
  };

  const handlePressDigit = (value: any) => {
    setInput(prevInput => prevInput + value);
  };

  const handleDigitsChange = (event: any) => {
    setInput(event.target.value);
  };

  const handleClearDigits = () => {
    setInput(prevInput => prevInput.slice(0, -1));
  };

  const handleLongClearDigits = () => {
    setInput("");
  };

  const handleZeroDigitPress = () => {
    handlePressDigit("0");
  };

  const handleSubmitDialModal = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!input) return;
    onChangeDtmf(dtmfKey + input + '#');
    setDialSubmitModal(false);
    setInput('');
  }

  // ~~~~~~~~~~~~~~~~~ Hangup ~~~~~~~~~~~~~~~~~~~~~~~~~~


  const handleHangup = () => {
    if (session) {
      session.terminate();
      setSession(null);
      setIncomingCalling(false);
      setIsTalking(false);
    }
  };

  // ~~~~~~~~~~~~~~~~~ Call Accept ~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleAccept = () => {
    if (session) {
      setIncomingCalling(false);
      session.answer();
      setIsTalking(true);
    }
  };

  // ~~~~~~~~~~~~~~~~~ Audio Listen ~~~~~~~~~~~~~~~~~~~~~~~~~~

  useEffect(() => {
    if (isOpen) {
      const startListening = () => {
        if (!incomingSession) {
          return;
        }
        incomingSession?.connection?.addEventListener("track", (e: any) => {
          if (e.track.kind === "audio") {
            audioContext.resume().then(() => {
              const remoteAudio: any = document.getElementById("remoteAudio");
              remoteAudio.play().catch((error: any) => { });
            });
          }
        });
      };

      if (incomingSession && !callHold) {
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
    }
  }, [incomingSession, callHold]);

  // ~~~~~~~~~~~~~~~~~ Call Mute ~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleClickMuteBtn = (e: any) => {
    e.preventDefault();
    toggleMicrophone();
  }

  // ~~~~~~~~~~~~~~~~~ Call Hold ~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleClickHoldBtn = (e: any) => {
    e.preventDefault();
    toggleCallHold();
  }


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
                  {user ? (user?.number || "Anonymous") : ""}
                </h5>
                <h6 className="font-size-15 mb-0 text-truncate">
                  {user ? (user.number === user.name ? "Anonymous" : user.name || "Anonymous") : ""}
                </h6>
              </>
            ) : (
              <>
                <h5 className="font-size-18 mb-0 text-truncate">
                  {callData ? `${callData?.number}` : ""}
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
                onClick={handleClickMuteBtn}
                disabled={!isTalking}
              >
                <span className={`avatar-title bg-transparent ${!micMute && 'text-muted'} font-size-20`}>
                  <i className="mdi mdi-microphone-off" ></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-Mute mt-2">
                Mute
              </h5>
            </div>
            <div className="avatar-md h-auto">
              <Button
                type="button"
                color="light"
                className="avatar-sm rounded-circle"
                onClick={handleClickHoldBtn}
                disabled={!isTalking}
              >
                <span className={`avatar-title bg-transparent ${!callHold && 'text-muted'} font-size-20`}>
                  <i className="mdi mdi-pause"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-Mute mt-2">
                Hold
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
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="avatar-md h-auto">
              <Button
                color="light"
                type="button"
                className="avatar-sm rounded-circle"
                onClick={() => handleOpenDialpadModal()}
                disabled={!isChannel}
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="bx bx-dialpad"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-waiting mt-2">
                Dialpad
              </h5>
            </div>

            <div className="avatar-md h-auto">
              <Button
                color="light"
                type="button"
                className="avatar-sm rounded-circle"
                onClick={handleClickBlindTransferBtn}
                disabled={!isTalking}
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="mdi mdi-transit-transfer"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-waiting mt-2">
                Transfer
              </h5>
            </div>
            <div className="avatar-md h-auto">
              <Button
                color="light"
                type="button"
                className="avatar-sm rounded-circle"
                onClick={handleClickConferenceBtn}
                disabled={!isTalking}
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="mdi mdi-call-merge"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-waiting mt-2">
                Conference
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
              {incomingCalling && (
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
              )}
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


        <Modal
          isOpen={dialPadModal}
          toggle={toggleDialPadModalNested}
          centered
          size='sm'
        >
          <ModalBody>
            <div
              className="container text-center p-2"
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control text-center"
                  value={inputValue}
                  onChange={handleInputValueChange}
                  placeholder="Enter Number"
                  style={{ fontSize: "1rem", height: "30px" }}
                />
                {inputValue && (
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "rgb(213 34 34)",
                      color: "white",
                      height: "30px",
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignContent: 'center',
                      flexWrap: 'wrap'
                    }}
                    onMouseDown={() => {
                      const timeoutId = setTimeout(handleLongClear, 1000);
                      setClearTimeoutId(timeoutId);
                    }}
                    onMouseUp={() => {
                      clearTimeout(clearTimeoutId);
                      handleClear();
                    }}
                    onMouseLeave={() => clearTimeout(clearTimeoutId)}
                  >
                    <FaDeleteLeft color="#fff" size={18} />
                  </button>
                )}
              </div>
              <div className="row text-center g-2 w-100 mt-1">
                {["1", "2", "3"].map(num => (
                  <div className="col-4" key={num}>
                    <button
                      className="btn btn-primary btn-lg rounded-circle"
                      onClick={() => handleButtonClick(num)}
                      style={{ width: "50px", height: "50px" }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
                {["4", "5", "6"].map(num => (
                  <div className="col-4" key={num}>
                    <button
                      className="btn btn-primary btn-lg rounded-circle"
                      onClick={() => handleButtonClick(num)}
                      style={{ width: "50px", height: "50px" }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
                {["7", "8", "9"].map(num => (
                  <div className="col-4" key={num}>
                    <button
                      className="btn btn-primary btn-lg rounded-circle"
                      onClick={() => handleButtonClick(num)}
                      style={{ width: "50px", height: "50px" }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
                <div className="col-4">
                  <button
                    className="btn btn-primary btn-lg rounded-circle"
                    onClick={() => handleButtonClick('*')}
                    style={{ width: "50px", height: "50px" }}
                  >
                    *
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-primary btn-lg rounded-circle"
                    onClick={() => handleButtonClick('0')}
                    style={{ width: "50px", height: "50px" }}
                  >
                    0
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-primary btn-lg rounded-circle"
                    onClick={() => handleButtonClick('#')}
                    style={{ width: "50px", height: "50px" }}
                  >
                    #
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={transferSubmitModal}
          toggle={toggleTransferModal}
          centered
          size='sm'
        >
          <ModalHeader>{btnType === 'transfer' ? 'Transfer Call' : 'Conference Call'}</ModalHeader>
          <ModalBody>
            <div
              className="container text-center"
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control text-center"
                  value={input}
                  onChange={handleDigitsChange}
                  placeholder="Enter number"
                  style={{ fontSize: "1rem", height: "30px" }}
                />
                {input && (
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "rgb(213 34 34)",
                      color: "white",
                      height: "30px",
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignContent: 'center',
                      flexWrap: 'wrap'
                    }}
                    onMouseDown={() => {
                      const timeoutId = setTimeout(handleLongClearDigits, 1000);
                      setClearTimeoutId(timeoutId);
                    }}
                    onMouseUp={() => {
                      clearTimeout(clearTimeoutId);
                      handleClearDigits();
                    }}
                    onMouseLeave={() => clearTimeout(clearTimeoutId)}
                  >
                    <FaDeleteLeft color="#fff" size={18} />
                  </button>
                )}
              </div>

              <div className="row text-center g-2 w-100 mt-1">
                {["1", "2", "3"].map(num => (
                  <div className="col-4" key={num}>
                    <button
                      className="btn btn-primary btn-lg rounded-circle"
                      onClick={() => handlePressDigit(num)}
                      style={{ width: "50px", height: "50px" }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
                {["4", "5", "6"].map(num => (
                  <div className="col-4" key={num}>
                    <button
                      className="btn btn-primary btn-lg rounded-circle"
                      onClick={() => handlePressDigit(num)}
                      style={{ width: "50px", height: "50px" }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
                {["7", "8", "9"].map(num => (
                  <div className="col-4" key={num}>
                    <button
                      className="btn btn-primary btn-lg rounded-circle"
                      onClick={() => handlePressDigit(num)}
                      style={{ width: "50px", height: "50px" }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
                <div className="col-4">
                  <button
                    className="btn btn-secondary btn-lg rounded-circle"
                    onClick={() => handlePressDigit("*")}
                    style={{ width: "50px", height: "50px" }}
                  >
                    *
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-primary btn-lg rounded-circle"
                    onClick={() => handleZeroDigitPress()}
                    style={{ width: "50px", height: "50px" }}
                  >
                    0
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-secondary btn-lg rounded-circle"
                    onClick={() => handlePressDigit("#")}
                    style={{ width: "50px", height: "50px" }}
                  >
                    #
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex space-between">
            <Button size="sm" color="danger" onClick={toggleTransferModal}>
              Cancel
            </Button>
            <Button size="sm" color="primary" onClick={handleSubmitDialModal}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>


      </ModalBody>
      <audio id="remoteAudio" autoPlay></audio>
    </Modal >
  );
};

export default AudioCallModal;