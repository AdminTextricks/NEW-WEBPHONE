import { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import JsSIP, { WebSocketInterface } from "jssip";
import { useRedux } from "../../hooks/index";
import CallHistoryUser from "./CallsHistory/index";
import Welcome from "./ConversationUser/Welcome";
import Leftbar from "./Leftbar";
import axios from "axios";
import moment from "moment";
import {
  handleCallClicked,
  handleCallConferenceClicked,
  handleCallTransferClicked,
  setCallsHistory,
  setIsCalling,
  startTimer,
  stopTimer,
  updateTimer,
} from "../../redux/sessionCall/actions";
import AudioCallModal from "../../components/AudioCallModal";
import store from "../../redux/store";
import { getContacts } from "../../redux/actions";
import DialPadModal from "../../components/DialPadModal";
import ringSound from "../../assets/sound/ringSound.mp3";
import outgoingRingtone from "../../assets/sound/outgoingRingtone.mp3";
import dialTone from "../../assets/sound/dialSound.mp3";

import { Howl, Howler } from "howler";

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
  const [isOpenDialModal, setIsOpenDialModal] = useState<boolean>(false);
  const [micMute, setMicMute] = useState(false);
  const [callHold, setCallHold] = useState(false);

  const [isChannel, setIsChannel] = useState(false);
  const [isTalking, setIsTalking] = useState(false);


  const sound = new Howl({
    src: [ringSound],
    loop: true,
  });

  const outgoingRingSound = new Howl({
    src: [outgoingRingtone],
    loop: true,
  });

  const dialRingTone = new Howl({
    src: [dialTone],
    loop: true,
  });

  Howler.volume(0.1);

  const userAgentRef = useRef<any>(null);
  const callingSessionRef = useRef<any>(null);

  const { getCallsLoading, callData, selectedChat, blindNumber } =
    useAppSelector((state: any) => ({
      getCallsLoading: state.CallHistory.getCallsLoading,
      callData: state.CallHistory.callData,
      dtmfSequence: state.CallHistory.dtmfSequence,
      blindNumber: state.CallHistory.blindNumber,
      selectedChat: state.Chats.selectedChat,
    }));

  const isBusy = useSelector((state: any) => state.CallHistory.getCallsLoading);

  const { callDetail } = useSelector((state: any) => ({
    callDetail: state.CallHistory.callData,
  }));

  const onCloseAudio = () => {
    dispatch(handleCallConferenceClicked(null));
    setUser(null);
  };


  const onCloseDialPad = () => {
    setIsOpenDialModal(false);
  };

  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  useEffect(() => {
    dispatch(getContacts(userData?.user?.name));
  }, []);

  useEffect(() => {
    userAgentRef.current = userAgent;

    userAgent.on("connecting", () => { });

    userAgent.on("connected", event => { });

    userAgent.on("disconnected", () => { });

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

        if (incomingSession.direction === "incoming") {
          if (isBusyRef.current) {
            incomingSession.terminate({
              status_code: 486,
              reason_phrase: "Busy Here",
            });
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
              status: "Missed",
              causes: "Missed",
              direction: "incoming",
            };
            dispatch(setCallsHistory(newCall));
            return;
          }
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
          sound.play();
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
            dispatch(handleCallTransferClicked(null));
            sound.stop();
            setIsChannel(true);
            setIsTalking(true);
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
            dispatch(handleCallTransferClicked(null));
            setMicMute(false);
            setCallHold(false);
            sound.stop();
            setIsChannel(false);
            setIsTalking(false);
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
            dispatch(handleCallTransferClicked(null));
            setMicMute(false);
            setCallHold(false);
            sound.stop();
            setIsChannel(false);
            setIsTalking(false);
          });

        } else if (incomingSession.direction === "outgoing") {
          dialRingTone.play();
          setIsChannel(false);

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

          incomingSession.on("progress", (e: any) => {
            if (e && e.progressTone) {
              outgoingRingSound.stop();
              dialRingTone.stop();
              setIsChannel(true);
            } else {
              outgoingRingSound.play();
              dialRingTone.stop();
            }
          });

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
            setIsChannel(true);
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
            dispatch(handleCallTransferClicked(null));
            outgoingRingSound.stop();
            dialRingTone.stop();
            setIsTalking(true);
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
            dispatch(handleCallTransferClicked(null));
            setMicMute(false);
            setCallHold(false);
            outgoingRingSound.stop();
            dialRingTone.stop();
            setIsChannel(false);
            setIsTalking(false);
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
            dispatch(handleCallTransferClicked(null));
            setMicMute(false);
            setCallHold(false);
            outgoingRingSound.stop();
            dialRingTone.stop();
            setIsChannel(false);
            setIsTalking(false);
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
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        },
        pcConfig: {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        },
      });
      setSession(callSession);
    }
  }, [callData]);

  useEffect(() => {
    if (isActive && blindNumber) {
      if (!session) return;
      const sendDtmf = async () => {
        try {
          session.sendDTMF(blindNumber, {
            duration: 100,
            interToneGap: 200,
          });

          const onFailed = (error: any) => {
            if (error.cause === "Not Found" || error.status_code === 404) {
              setSession(session);
              dispatch(handleCallTransferClicked(null));
            }
          };

          const onAccepted = () => { };

          session.on("failed", onFailed);
          session.on("accepted", onAccepted);

          return () => {
            session.off("failed", onFailed);
            session.off("accepted", onAccepted);
          };
        } catch (error) {
          dispatch(handleCallTransferClicked(null));
        }
      };

      sendDtmf();
    }
  }, [blindNumber]);

  const toggleMicrophone = () => {
    callingSessionRef?.current?.connection
      .getLocalStreams()[0]
      .getAudioTracks()
      .forEach((track: any) => {
        track.enabled = !track.enabled;
        setMicMute(!track.enabled);
      });
  };

  const toggleCallHold = () => {
    if (!callHold) {
      session.hold();
      setCallHold(true);
    } else {
      session.unhold();
      setCallHold(false);
    }
  };

  const handleChangeDTMF = (number: any) => {
    if (isActive && number) {
      if (!session) return;
      const sendDtmf = async () => {
        try {
          session.sendDTMF(number, {
            duration: 160
          });

          const onFailed = (error: any) => {
            if (error.cause === "Not Found" || error.status_code === 404) {
              setSession(session);
            }
          };

          const onAccepted = () => { };

          session.on("failed", onFailed);
          session.on("accepted", onAccepted);

          return () => {
            session.off("failed", onFailed);
            session.off("accepted", onAccepted);
          };
        } catch (error) {
        }
      };
      sendDtmf();
    }


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
              <CallHistoryUser />
            </div>
          </div>
        ) : (
          <Welcome />
        )}
      </div>

      <DialPadModal isOpen={isOpenDialModal} onClose={onCloseDialPad} />

      <AudioCallModal
        isOpen={getCallsLoading}
        onClose={onCloseAudio}
        user={user}
        session={session}
        setSession={setSession}
        incomingSession={callingSessionRef.current}
        userAgentSession={userAgentSession}
        toggleMicrophone={toggleMicrophone}
        micMute={micMute}
        callHold={callHold}
        toggleCallHold={toggleCallHold}
        isChannel={isChannel}
        isTalking={isTalking}
        setIsTalking={setIsTalking}
        onChangeDtmf={handleChangeDTMF}
      />
    </>
  );
};

export default Index;
