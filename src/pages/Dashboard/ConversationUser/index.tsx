import { useEffect, useState } from "react";
import { useRedux } from "../../../hooks/index";
import { createSelector } from "reselect";
import {
  toggleUserDetailsTab,
  getChatUserConversations,
  onSendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  deleteUserMessages,
  toggleArchiveContact,
} from "../../../redux/actions";

import { useProfile } from "../../../hooks";
import UserHead from "./UserHead";
import Conversation from "./Conversation";
import ChatInputSection from "./ChatInputSection/index";
import { MessagesTypes } from "../../../data/messages";

const Index = () => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const errorData = createSelector(
    (state: any) => state.Chats,
    state => ({
      chatUserDetails: state.chatUserDetails,
      chatUserConversations: state.chatUserConversations,
      isUserMessageSent: state.isUserMessageSent,
      isMessageDeleted: state.isMessageDeleted,
      isMessageForwarded: state.isMessageForwarded,
      isUserMessagesDeleted: state.isUserMessagesDeleted,
      isImageDeleted: state.isImageDeleted,
    }),
  );
  // Inside your component
  const {
    chatUserDetails,
    chatUserConversations,
    isUserMessageSent,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
  } = useAppSelector(errorData);

  const onOpenUserDetails = () => {
    dispatch(toggleUserDetailsTab(true));
  };

  const { userProfile } = useProfile();

  const [replyData, setReplyData] = useState<
    null | MessagesTypes | undefined
  >();
  const onSetReplyData = (reply: null | MessagesTypes | undefined) => {
    setReplyData(reply);
  };

  const onSend = (data: any) => {
    let params: any = {
      text: data.text && data.text,
      time: new Date().toISOString(),
      image: data.image && data.image,
      newimage: data.newimage && data.newimage,
      attachments: data.attachments && data.attachments,
      meta: {
        receiver: chatUserDetails.id,
        sender: "12",
      },
    };

    if (replyData && replyData !== null) {
      params["replyOf"] = replyData;
    }

    dispatch(onSendMessage(params));
    setTimeout(() => {
      dispatch(receiveMessage(chatUserDetails.id));
    }, 1000);
    setTimeout(() => {
      dispatch(readMessage(chatUserDetails.id));
    }, 1500);
    setTimeout(() => {
      dispatch(receiveMessageFromUser(chatUserDetails.id));
    }, 2000);
    setReplyData(null);
  };

  useEffect(() => {
    if (
      isUserMessageSent ||
      isMessageDeleted ||
      isMessageForwarded ||
      isUserMessagesDeleted ||
      isImageDeleted
    ) {
      dispatch(getChatUserConversations(chatUserDetails.id));
    }
  }, [
    dispatch,
    isUserMessageSent,
    chatUserDetails,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
  ]);

  const onDeleteMessage = (messageId: string | number) => {
    dispatch(deleteMessage(chatUserDetails.id, messageId));
  };

  const onDeleteUserMessages = () => {
    dispatch(deleteUserMessages(chatUserDetails.id));
  };

  const onToggleArchive = () => {
    dispatch(toggleArchiveContact(chatUserDetails.id));
  };
  return (
    <>
      <UserHead
        chatUserDetails={chatUserDetails}
        onOpenUserDetails={onOpenUserDetails}
        onDelete={onDeleteUserMessages}
        onToggleArchive={onToggleArchive}
      />
      <Conversation
        chatUserConversations={chatUserConversations}
        chatUserDetails={chatUserDetails}
        onDelete={onDeleteMessage}
        onSetReplyData={onSetReplyData}
      />
      <ChatInputSection
        onSend={onSend}
        replyData={replyData}
        onSetReplyData={onSetReplyData}
        chatUserDetails={chatUserDetails}
      />
    </>
  );
};

export default Index;
