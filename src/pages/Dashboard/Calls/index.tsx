import React, { useEffect, useState } from "react";

// hooks
import { useRedux } from "../../../hooks/index";
import { createSelector } from "reselect";
// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import LeftbarTitle from "../../../components/LeftbarTitle";
import { Button, UncontrolledTooltip } from "reactstrap";
import Call from "./Call";
import { MdDialpad } from "react-icons/md";

// actions
import { getCalls } from "../../../redux/actions";

// interface
import { CallItem } from "../../../data/calls";
import AudioCallModal from "../../../components/AudioCallModal";
import DialPadModal from "../../../components/DialPadModal";

interface IndexProps {}
const Index = (props: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const { calls, getCallsLoading } = useAppSelector((state: any) => ({
    // calls: state.Calls.calls,
    getCallsLoading: state.Calls.getCallsLoading,
    calls: state.CallHistory.call_list,
  }));

  // const errorData = createSelector(
  //   (state: any) => state.Calls,
  //   state => ({
  //     calls: state.calls,
  //     getCallsLoading: state.getCallsLoading,
  //   }),
  // );
  // Inside your component
  // const { calls,getCallsLoading} = useAppSelector(errorData);

  // get user calls
  useEffect(() => {
    dispatch(getCalls());
  }, [dispatch]);

  const [callsList, setCallsList] = useState([]);
  const [isOpenAudioModal, setIsOpenAudioModal] = useState<boolean>(false);

  const onOpenAudio = () => {
    setIsOpenAudioModal(true);
  };
  const onCloseAudio = () => {
    setIsOpenAudioModal(false);
  };

  useEffect(() => {
    setCallsList(calls);
  }, [calls]);

  return (
    <div className="position-relative">
      {getCallsLoading && <Loader />}
      <DialPadModal isOpen={isOpenAudioModal} onClose={onCloseAudio} />
      <div
        className="px-4 pt-4"
        style={{
          height: "10vh",
        }}
      >
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h4 className="mb-4">Calls</h4>
          </div>
          <div className="flex-shrink-0">
            <div id="add-contact-button">
              <Button
                color="primary"
                type="button"
                onClick={onOpenAudio}
                className="btn btn-soft-primary btn-sm"
              >
                <MdDialpad />
              </Button>
            </div>
            <UncontrolledTooltip target="add-contact-button" placement="bottom">
              Dial Number
            </UncontrolledTooltip>
          </div>
        </div>
      </div>

      <AppSimpleBar
        style={{
          height: "90vh",
        }}
        className="chat-message-list chat-call-list"
      >
        <ul className="list-unstyled chat-list">
          {(callsList || [])
            .sort((a: CallItem, b: CallItem) => {
              const dateA = new Date(a.startTime?.split(" ").join("T"));
              const dateB = new Date(b.endTime?.split(" ").join("T"));
              return dateB.getTime() - dateA.getTime(); // Descending order
            })
            .map((call, key) => (
              <Call call={call} key={key} />
            ))}
        </ul>

        {callsList?.length === 0 && (
          <div
            className="rounded p-4 text-center border-top"
            style={{
              display: "flex",
              justifyContent: "center",
              height: "60vh",
              flexDirection: "column",
            }}
          >
            <i className="bx bx-info-circle fs-1 mb-3" />
            <div>No records found.</div>
          </div>
        )}
      </AppSimpleBar>
    </div>
  );
};

export default Index;
