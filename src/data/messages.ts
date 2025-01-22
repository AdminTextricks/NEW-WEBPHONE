export interface AttachmentTypes {
  id: number;
  name: string;
  downloadLink: string;
  desc: string;
}

export interface ImageTypes {
  id: number;
  downloadLink: string;
}
export interface MessagesTypes {
  mId: number;
  text?: string;
  time: string;
  meta: {
    receiver: string | number;
    sender: string | number;
    sent: boolean;
    received: boolean;
    read: boolean;
    isForwarded?: boolean;
  };
  attachments?: AttachmentTypes[];
  image?: ImageTypes[];
  newimage?: ImageTypes[];
  replyOf?: MessagesTypes;
}
export interface ConversationTypes {
  conversationId: string | number;
  userId: string;
  isGroupConversation?: boolean;
  typingUser?: string | number;
  messages: MessagesTypes[];
}
