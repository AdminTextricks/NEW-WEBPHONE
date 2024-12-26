import { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import JsSIP, { WebSocketInterface } from "jssip";
import { useRedux } from "../../hooks/index";
import ConversationUser from "./ConversationUser/index";
import UserProfileDetails from "./UserProfileDetails/index";
import CallHistoryUser from "./CallsHistory/index";
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
import { getContacts } from "../../redux/actions";
import FabButtonWithFade from "../../components/AddFloatButton";
import DialPadModal from "../../components/DialPadModal";

const Index = () => {
  const { useAppSelector } = useRedux();
  const userData = useSelector((state: any) => state.Login);
  const dispatch = useDispatch();

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

  const userAgent = new JsSIP.UA(config);

  const timerRef: any = useRef(null);
  const isBusyRef = useRef<boolean | undefined>(undefined);

  const [userAgentSession, setUserAgentSession] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const userAgentRef = useRef<any>(null);
  const callingSessionRef = useRef(null);

  const isCallWaiting = useSelector((state: any) => ({
    isCallWaiting: state.CallHistory.isCallWaiting
  }));

  const { getCallsLoading, callData, selectedChat } = useAppSelector(
    (state: any) => ({
      getCallsLoading: state.CallHistory.getCallsLoading,
      callData: state.CallHistory.callData,
      selectedChat: state.Chats.selectedChat,
    }),
  );

  const isBusy = useSelector(
    (state: any) => state.CallHistory.getCallsLoading
  );

  const { callDetail } = useSelector((state: any) => ({
    callDetail: state.CallHistory.callData,
  }));

  const onCloseAudio = () => {
    setUser(null);
  };

  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  useEffect(() => {
    userAgentRef.current = userAgent;

    userAgent.on("connecting", () => {
      console.debug("Connecting...");
    });

    userAgent.on("connected", event => {
      console.debug("User connected", event);
    });

    userAgent.on("disconnected", () => {
      console.debug("Disconnected");
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
      } catch (error: any) { }
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

  useEffect(() => {
    if (isActive) {
      userAgentSession.on("newRTCSession", (data: any) => {
        callingSessionRef.current = data.session;
        const incomingSession: any = callingSessionRef.current;

        if (isBusyRef.current) {
          console.log("No Waiting");

          incomingSession.terminate();

          return;

          // incomingSession.terminate({ status_code: 486, reason_phrase: 'Busy Here' });
          // const newCall = {
          //   name:
          //     data?.request?.from?._uri._user ==
          //       data?.request?.from?._display_name
          //       ? ""
          //       : data?.request?.from?._uri._user,
          //   number: data?.request?.from?._display_name,
          //   id: incomingSession._id.substring(
          //     0,
          //     incomingSession._id.indexOf("@"),
          //   ),
          //   startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
          //   status: 'Missed',
          //   causes: "Missed",
          //   direction: "incoming",
          // };
          // dispatch(setCallsHistory(newCall));
          // return;
        }

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
            startTime: "",
            endTime: "",
            status: "calling",
          };
          setUser(newCall);
          dispatch(setIsCalling(true));
          dispatch(setCallsHistory(newCall));
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
            remoteAudio.play().catch((error: any) => { });
            const newCall = {
              name:
                data?.request?.from?._uri._user ==
                  data?.request?.from?._display_name
                  ? ""
                  : data?.request?.from?._uri._user,
              number: data?.request?.from?._display_name,
              id: incomingSession._id.substring(
                0,
                incomingSession._id.indexOf("@"),
              ),
              startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: "talking",
              direction: "incoming",
            };
            dispatch(setCallsHistory(newCall));
            setUser(newCall);
          });
          incomingSession.on("failed", (e: any) => {
            const newCall = {
              name:
                data?.request?.from?._uri._user ==
                  data?.request?.from?._display_name
                  ? ""
                  : data?.request?.from?._uri._user,
              number: data?.request?.from?._display_name,
              id: incomingSession._id.substring(
                0,
                incomingSession._id.indexOf("@"),
              ),
              startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: e.cause,
              causes: "Missed",
              direction: "incoming",
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
            clearInterval(timerRef.current);
            dispatch(stopTimer());
            dispatch(handleCallClicked(null));
          });
          incomingSession.on("ended", (e: any) => {
            const newCall = {
              name:
                data?.request?.from?._uri._user ==
                  data?.request?.from?._display_name
                  ? ""
                  : data?.request?.from?._uri._user,
              number: data?.request?.from?._display_name,
              id: incomingSession._id.substring(
                0,
                incomingSession._id.indexOf("@"),
              ),
              endTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: e.cause,
              direction: "incoming",
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
            clearInterval(timerRef.current);
            dispatch(stopTimer());
            dispatch(handleCallClicked(null));
          });

        } else if (incomingSession.direction === "outgoing") {
          const outgoingCallDetails = {
            name: callDetail?.name || "",
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

          incomingSession.on("accepted", (e: any) => {
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
            remoteAudio.play().catch((error: any) => { });
            const newCall = {
              name: callDetail?.name || "",
              direction: "outgoing",
              number: data?.request?.to?._uri._user,
              id: incomingSession._id,
              startTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: "talking",
            };
            dispatch(setCallsHistory(newCall));
            setUser(newCall);
          });

          incomingSession.on("ended", (e: any) => {
            const newCall = {
              name: callDetail?.name || "",
              direction: "outgoing",
              number: data?.request?.to?._uri._user,
              id: incomingSession._id,
              endTime: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
              status: e.cause,
            };
            setUser(newCall);
            dispatch(setIsCalling(false));
            dispatch(setCallsHistory(newCall));
            clearInterval(timerRef.current);
            dispatch(stopTimer());
            dispatch(handleCallClicked(null));
          });

          incomingSession.on("failed", (e: any) => {
            const newCall = {
              name: callDetail?.name || "",
              direction: "outgoing",
              number: data?.request?.to?._uri._user,
              id: incomingSession._id,
              status: e.cause,
              causes: e?.message?.reason_phrase || "Canceled",
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

  useEffect(() => {
    dispatch(getContacts(userData?.user?.name));
  }, []);

  const [isOpenDialModal, setIsOpenDialModal] = useState<boolean>(false);

  const onOpenDialPad = () => {
    setIsOpenDialModal(true);
  };
  const onCloseDialPad = () => {
    setIsOpenDialModal(false);
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
          // <div className="chat-content d-lg-flex">
          //   <div className="w-100 overflow-hidden position-relative">
          //     <ConversationUser />
          //   </div>
          //   <UserProfileDetails isChannel={true} />
          // </div>

          <div className="chat-content d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              <CallHistoryUser />
            </div>
            <UserProfileDetails isChannel={true} />
          </div>
        ) : (
          <Welcome />
        )}
      </div>

      <FabButtonWithFade onChangeClick={onOpenDialPad} />

      <DialPadModal
        isOpen={isOpenDialModal}
        onClose={onCloseDialPad}
      />

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
