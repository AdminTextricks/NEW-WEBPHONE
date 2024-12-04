import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import JsSIP, { WebSocketInterface } from "jssip";

// hooks
import { useRedux } from "../../hooks/index";

// components
import ConversationUser from "./ConversationUser/index";
import UserProfileDetails from "./UserProfileDetails/index";
import Welcome from "./ConversationUser/Welcome";
import Leftbar from "./Leftbar";
import axios from "axios";
import moment from "moment";
import {
  handleCallClicked,
  setCallsHistory,
  setIsCalling,
  startTimer,
  stopTimer,
  updateTimer,
} from "../../redux/sessionCall/actions";
import AudioCallModal from "../../components/AudioCallModal";
import store from "../../redux/store";

interface IndexProps {}

const Index = (props: IndexProps) => {
  JsSIP.debug.enable("JsSIP:*");

  const { useAppSelector } = useRedux();

  const [userAgentSession, setUserAgentSession] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const errorData = createSelector(
    (state: any) => state.Chats,
    state => ({
      selectedChat: state.selectedChat,
    }),
  );
  const { selectedChat } = useAppSelector(errorData);

  const dispatch = useDispatch();

  const { getCallsLoading, callData } = useAppSelector((state: any) => ({
    getCallsLoading: state.CallHistory.getCallsLoading,
    callData: state.CallHistory.callData,
  }));

  const timerRef: any = useRef(null);

  const onCloseAudio = () => {
    setUser(null);
  };

  const userData = useSelector((state: any) => state.Login);

  const config = {
    domain: "opensips.callanalog.com",
    uri: `sip:${userData?.user?.name}@opensips.callanalog.com`,
    password: `${userData?.user?.secret}`,
    ws_servers: `wss://opensips.callanalog.com:5063/ws`,
    sockets: new WebSocketInterface(`wss://opensips.callanalog.com:5063/ws`),
    display_name: `${userData?.user?.agent_name}`,
    session_timers: false,
    register: true,
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // Using useRef for JsSIP instance
  const userAgent = new JsSIP.UA(config);

  const userAgentRef = useRef<any>(null);

  useEffect(() => {
    userAgentRef.current = userAgent;

    userAgent.on("connecting", () => {
      console.log("Connecting...");
    });

    userAgent.on("connected", event => {
      console.log("User connected", event);
    });

    userAgent.on("disconnected", () => {
      console.log("Disconnected");
    });

    userAgent.on("registered", () => {
      setIsActive(true);
      dispatch({ type: "SET_ACTIVE_STATUS", payload: true });
      setUserAgentSession(userAgent);
    });

    userAgent.start();

    userAgent.on("unregistered", () => {
      setIsActive(false);
      dispatch({ type: "SET_ACTIVE_STATUS", payload: false });
    });

    userAgent.on("registrationFailed", async () => {
      setIsActive(false);

      dispatch({ type: "SET_ACTIVE_STATUS", payload: false });
      try {
        const response = await axios.get(
          `https://pbxlivebackend.callanalog.com/public/api/UnregisterSip/${userData?.user?.name}`,
        );
        return response.data;
      } catch (error: any) {}
    });

    const intervalId = setInterval(() => {
      if (!userAgent.isRegistered()) {
        dispatch({ type: "SET_ACTIVE_STATUS", payload: false });
        userAgent.register();
      }
    }, 7000);
    return () => {
      clearInterval(intervalId);
      userAgent.unregister();
      userAgent.stop();
    };
  }, [dispatch]);

  const callingSessionRef = useRef(null);
  const messagingSessionRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      userAgentSession.on("newRTCSession", (data: any) => {
        callingSessionRef.current = data.session;
        const incomingSession: any = callingSessionRef.current;
        if (incomingSession.direction === "incoming") {
          const newCall = {
            name:
              data?.request?.from?._uri._user ==
              data?.request?.from?._display_name
                ? ""
                : data?.request?.from?._uri._user,
            id: incomingSession._id.substring(
              0,
              incomingSession._id.indexOf("@"),
            ),
            direction: "incoming",
            number: data?.request?.from?._display_name,
            startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            endTime: "",
            status: "calling",
          };
          setUser(newCall);
          dispatch(setIsCalling(true));
          dispatch(setCallsHistory(newCall));

          incomingSession.on("failed", () => {
            const newCall = {
              id: incomingSession._id.substring(
                0,
                incomingSession._id.indexOf("@"),
              ),
              endTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: "missedcall",
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
          });

          incomingSession.on("accepted", () => {
            dispatch(startTimer());
            timerRef.current = setInterval(() => {
              setTimeout(() => {
                const latestState = store.getState();
                const currentElapsedTime =
                  latestState.CallHistory.elapsedTime + 1;
                dispatch(updateTimer(currentElapsedTime));
              });
            }, 1000);

            setSession(incomingSession);
            const remoteStream =
              incomingSession?.connection?.getRemoteStreams()[0];
            const remoteAudio: any = document.getElementById("remoteAudio");
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play().catch((error: any) => {
              console.error("Failed to play audio:", error);
            });
          });

          incomingSession.on("ended", () => {
            const newCall = {
              id: incomingSession._id.substring(
                0,
                incomingSession._id.indexOf("@"),
              ),
              endTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: "recieved",
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
            clearInterval(timerRef.current);
            dispatch(stopTimer());
          });
        } else if (incomingSession.direction === "outgoing") {
          const outgoingCallDetails = {
            name: callData?.name || "",
            id: incomingSession._id,
            direction: "outgoing",
            number: data?.request?.to?._uri._user,
            startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            endTime: "",
            status: "calling",
          };

          setUser(outgoingCallDetails);
          dispatch(setIsCalling(true));
          dispatch(setCallsHistory(outgoingCallDetails));

          incomingSession.on("accepted", () => {
            dispatch(startTimer());
            timerRef.current = setInterval(() => {
              setTimeout(() => {
                const latestState = store.getState();
                const currentElapsedTime =
                  latestState.CallHistory.elapsedTime + 1;
                dispatch(updateTimer(currentElapsedTime));
              });
            }, 1000);
            setSession(incomingSession);
            const remoteStream =
              incomingSession?.connection?.getRemoteStreams()[0];
            const remoteAudio: any = document.getElementById("remoteAudio");
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play().catch((error: any) => {
              console.error("Failed to play audio:", error);
            });
          });

          incomingSession.on("ended", () => {
            const newCall = {
              id: incomingSession._id,
              endTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: "recieved",
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
            clearInterval(timerRef.current);
            dispatch(stopTimer());
            dispatch(handleCallClicked(null));
          });

          incomingSession.on("failed", () => {
            const newCall = {
              id: incomingSession._id,
              status: "failed",
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
            clearInterval(timerRef.current);
            dispatch(stopTimer());
            dispatch(handleCallClicked(null));
          });
        }
        setSession(incomingSession);
      });

      userAgentSession.on("newMessage", (data: any) => {
        messagingSessionRef.current = data.message;
        const messagingSession: any = messagingSessionRef.current;
        console.log(data.message._request);

        console.log("??????", messagingSession);

        if (messagingSession.direction === "outgoing") {
          messagingSession.on("failed", () => {
            console.log("Failed...");
          });
          messagingSession.on("succeeded", () => {
            console.log("Succeeded...");
          });
          // const outgoingCallDetails = {
          //   name: callData?.name || "",
          //   id: incomingSession._id,
          //   direction: "outgoing",
          //   number: data?.request?.to?._uri._user,
          //   startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
          //   endTime: "",
          //   status: "calling",
          // };
        }
      });
    }
  }, [isActive]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isActive && callData) {
      const number = callData.number.toString();
      const callSession = userAgentSession.call(number, {
        mediaConstraints: {
          audio: true,
          video: false,
        },
        rtcOfferConstraints: {
          offerToReceiveAudio: 1,
        },
      });
      setSession(callSession);
    }
  }, [callData]);

  const sendMessage = () => {
    const target = "sip:7746987@opensips.callanalog.com"; // Replace with actual target
    const input = "Hello Buddy!";

    userAgentSession.sendMessage(target, input, {
      eventHandlers: {
        succeeded: (res: any) => {
          console.log("Message sent successfully!", res);
        },
        failed: (e: any) => {
          console.error("Failed to send message. Error:", e);
        },
      },
      contentType: "text/plain",
    });
  };

  return (
    <>
      <Leftbar />
      <div
        className={classnames("user-chat", "w-100", "overflow-hidden", {
          "user-chat-show": selectedChat,
        })}
        id="user-chat"
      >
        <div className="user-chat-overlay" id="user-chat-overlay"></div>

        {selectedChat !== null ? (
          <div className="chat-content d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              <ConversationUser isChannel={true} />
            </div>
            <UserProfileDetails isChannel={true} />
          </div>
        ) : (
          <Welcome onChangeClick={sendMessage} />
        )}
      </div>

      <AudioCallModal
        isOpen={getCallsLoading}
        onClose={onCloseAudio}
        user={user}
        session={session}
        setSession={setSession}
        incomingSession={callingSessionRef.current}
      />
    </>
  );
};

export default Index;
