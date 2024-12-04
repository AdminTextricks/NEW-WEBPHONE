import React, { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { FiPhone } from "react-icons/fi";
import { FaDeleteLeft } from "react-icons/fa6";

// interface
import { CallItem } from "../data/calls";
import { useDispatch } from "react-redux";
import { handleCallClicked } from "../redux/sessionCall/actions";
import { name } from "jssip";

interface AudioCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CallItem | null;
  isCall: boolean;
}

const DialPadModal = ({ isOpen, onClose, user }: AudioCallModalProps) => {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [clearTimeoutId, setClearTimeoutId] = useState<any>(null);

  const handleButtonClick = (value: any) => {
    setInput(prevInput => prevInput + value);
  };

  const handleInputChange = (event: any) => {
    setInput(event.target.value);
  };

  const handleClear = () => {
    setInput(prevInput => prevInput.slice(0, -1));
  };

  const handleLongClear = () => {
    setInput("");
  };

  const handleZeroPress = () => {
    handleButtonClick("0");
  };

  const handleZeroLongPress = () => {
    handleButtonClick("+");
  };

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const call_detail = {
      number: input,
      name: input,
    };
    dispatch(handleCallClicked(call_detail));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      tabIndex={-1}
      centered
      contentClassName="shadow-lg border-0"
      size="sm"
    >
      <ModalBody className="p-0">
        <div className="text-center p-3 pb-0">
          <div
            className="container text-center"
            style={{ maxWidth: "264px", marginTop: "30px" }}
          >
            {/* Input Box */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control text-center"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter number"
                style={{ fontSize: "1.5rem", height: "50px" }}
              />
              {input && (
                <button
                  className="btn"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                  }}
                  onMouseDown={() => {
                    const timeoutId = setTimeout(handleLongClear, 1000); // Long press clears all
                    setClearTimeoutId(timeoutId);
                  }}
                  onMouseUp={() => {
                    clearTimeout(clearTimeoutId);
                    handleClear(); // Single click clears one character
                  }}
                  onMouseLeave={() => clearTimeout(clearTimeoutId)}
                >
                  <FaDeleteLeft size={18} />
                </button>
              )}
            </div>

            <div className="row text-center g-2 w-100 w-md-70">
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
                  className="btn btn-secondary btn-lg rounded-circle"
                  onClick={() => handleButtonClick("*")}
                  style={{ width: "50px", height: "50px" }}
                >
                  *
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-primary btn-lg rounded-circle"
                  onMouseDown={() => {
                    const timeoutId = setTimeout(handleZeroLongPress, 500);
                    setClearTimeoutId(timeoutId);
                  }}
                  onMouseUp={() => {
                    clearTimeout(clearTimeoutId);
                    handleZeroPress();
                  }}
                  onMouseLeave={() => clearTimeout(clearTimeoutId)}
                  style={{ width: "50px", height: "50px" }}
                >
                  0
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-secondary btn-lg rounded-circle"
                  onClick={() => handleButtonClick("#")}
                  style={{ width: "50px", height: "50px" }}
                >
                  #
                </button>
              </div>
            </div>
          </div>

          <div
            className="mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: "25px",
            }}
          >
            <Button
              type="button"
              className="btn btn-danger avatar-md call-close-btn rounded-circle"
              color="danger"
              onClick={onClose}
            >
              <span className="avatar-title bg-transparent font-size-24">
                <i className="mdi mdi-phone-hangup"></i>
              </span>
            </Button>
            <Button
              type="button"
              className="btn btn-danger avatar-md call-close-btn rounded-circle"
              color="primary"
              onClick={handleClick}
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
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DialPadModal;
