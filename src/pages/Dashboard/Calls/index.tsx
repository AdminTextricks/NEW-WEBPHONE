import React, { useEffect, useMemo, useState } from "react";

// hooks
import { useRedux } from "../../../hooks/index";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import { Button, UncontrolledTooltip } from "reactstrap";
import Call from "./Call";
import { MdDialpad } from "react-icons/md";

// actions
import { getCalls } from "../../../redux/actions";

// interface
import { CallItem } from "../../../data/calls";
import DialPadModal from "../../../components/DialPadModal";

const Index = () => {
  const { dispatch, useAppSelector } = useRedux();

  const [isOpenAudioModal, setIsOpenAudioModal] = useState(false);

  const getCallsLoading = useAppSelector((state: any) => state.Calls.getCallsLoading);
  const calls: CallItem[] = useAppSelector((state: any) => state.CallHistory.call_list);

  useEffect(() => {
    dispatch(getCalls());
  }, [dispatch]);

  const sortedCalls = useMemo(() => {
    if (!Array.isArray(calls)) return [];
    return [...calls].sort((a, b) => {
      const dateA = new Date(a.startTime?.split(" ").join("T") || "").getTime();
      const dateB = new Date(b.startTime?.split(" ").join("T") || "").getTime();
      return dateB - dateA;
    });
  }, [calls]);

  return (
    <div className="position-relative">
      {getCallsLoading && <Loader />}
      <DialPadModal isOpen={isOpenAudioModal} onClose={() => setIsOpenAudioModal(false)} />

      <div className="px-4 pt-4" style={{ height: "10vh" }}>
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h4 className="mb-4">Calls</h4>
          </div>
          <div className="flex-shrink-0">
            <div id="add-contact-button">
              <Button
                color="primary"
                type="button"
                onClick={() => setIsOpenAudioModal(true)}
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
        style={{ height: "90vh" }}
        className="chat-message-list chat-call-list"
      >
        {sortedCalls.length > 0 ? (
          <ul className="list-unstyled chat-list">
            {sortedCalls.map((call, key) => (
              <Call call={call} key={key} />
            ))}
          </ul>
        ) : (
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
