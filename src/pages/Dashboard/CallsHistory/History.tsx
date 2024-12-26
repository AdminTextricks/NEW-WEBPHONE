import { useEffect, useRef, useCallback } from "react";
import AppSimpleBar from "../../../components/AppSimpleBar";
import classnames from "classnames";
import { calculateTimeDifference } from "../../../utils";
import { MdCallMissed, MdCallReceived } from "react-icons/md";
import { MdCallMade } from "react-icons/md";

interface ConversationProps {
  callUserHistory?: any;
  callUserDetails?: any;
}
const Conversation = ({
  callUserHistory,
  callUserDetails,
}: ConversationProps) => {
  const ref = useRef<any>();

  const scrollElement = useCallback(() => {
    if (ref && ref.current) {
      const listEle = document.getElementById("chat-conversation-list");
      let offsetHeight = 0;
      if (listEle) {
        offsetHeight = listEle.scrollHeight - window.innerHeight + 250;
      }
      if (offsetHeight) {
        ref.current
          .getScrollElement()
          .scrollTo({ top: offsetHeight, behavior: "smooth" });
      }
    }
  }, [ref]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.recalculate();
    }
  }, []);
  useEffect(() => {
    if (callUserHistory) {
      scrollElement();
    }
  }, [callUserHistory, scrollElement]);

  return (
    <AppSimpleBar
      scrollRef={ref}
      className="chat-conversation p-3 p-lg-4 positin-relative"
    >
      <ul
        className="list-unstyled chat-conversation-list"
        id="chat-conversation-list"
      >
        {(callUserHistory || []).map((call: any, key: number) => {
          return (
            <li
              key={key}
              className={classnames("chat-list", {
                right: call.direction === "outgoing" ? true : false,
              })}
            >
              <div className="conversation-list">
                {/*<div className="chat-avatar">
                  {call.direction === "outgoing" ? (
                    <span>Me</span>
                  ) : (
                    <span>{callUserDetails?.agent_name || ""}</span>
                  )}
                </div> */}

                <div className="user-chat-content">
                  <div className="ctext-wrap">
                    <div className="ctext-wrap-content">
                      {call.status === "Terminated" ? (
                        <>
                          Duration:{" "}
                          <small className="mb-0 ctext-content">
                            {calculateTimeDifference(
                              call.startTime,
                              call.endTime,
                            )}
                          </small>
                        </>
                      ) : (
                        <>
                          Status:{" "}
                          <small className="mb-0 ctext-content">
                            {call.status}
                          </small>
                        </>
                      )}
                    </div>
                  </div>

                  <span
                    className={classnames(
                      "me-1",
                      "text-muted",
                      "font-size-13",
                      "mb-1",
                      "d-block",
                    )}
                  >
                    {call.direction === "incoming" ? (
                      <>
                        {call.causes === "Missed" ? (
                          <MdCallMissed />
                        ) : (
                          <MdCallReceived />
                        )}
                      </>
                    ) : (
                      <MdCallMade />
                    )}
                    {/* <i
                      className={classnames(
                        "ri",
                        "ri-share-forward-line",
                        "align-middle",
                        "me-1",
                      )}
                    ></i> */}
                    {call.startTime}
                  </span>
                </div>
              </div>
            </li>
          );
        })}

        {/* {(messages || []).map((message: MessagesTypes, key: number) => {
          const isFromMe = message.meta.sender + "" === "";
          return (
            <Message
              message={message}
              key={key}
              chatUserDetails={chatUserDetails}
              isFromMe={isFromMe}
            />
          );
        })} */}
      </ul>
    </AppSimpleBar>
  );
};

export default Conversation;
