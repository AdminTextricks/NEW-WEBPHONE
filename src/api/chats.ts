import * as url from "./urls";

const api = null;

const getFavourites = () => {
  return null;
};

const getDirectMessages = () => {
  return null;
};
const getChannels = () => {
  return null;
};

const addContacts = (contacts: Array<string | number>) => {
  return null;
};

const createChannel = (data: object) => {
  return null;
};

const getChatUserDetails = (id: string | number) => {
  return null;
};

const getChatUserConversations = (id: string | number) => {
  return null;
};

const sendMessage = (data: object) => {
  return null;
};

const receiveMessage = (id: string | number) => {
  return null;
};

const readMessage = (id: string | number) => {
  return null;
};

const receiveMessageFromUser = (id: string | number) => {
  return null;
};

const deleteMessage = (userId: number | string, messageId: number | string) => {
  return null;
};

const forwardMessage = (data: object) => {
  return null;
};

const deleteUserMessages = (userId: number | string) => {
  return null;
};

const getChannelDetails = (id: string | number) => {
  return null;
};

const toggleFavouriteContact = (id: string | number) => {
  return null;
};

/*
archive
*/
const getArchiveContact = () => {
  return null;
};

const toggleArchiveContact = (id: string | number) => {
  return null;
};

const readConversation = (id: string | number) => {
  return null;
};

const deleteImage = (
  userId: number | string,
  messageId: number | string,
  imageId: number | string,
) => {
  return null;
};

export {
  getFavourites,
  getDirectMessages,
  getChannels,
  addContacts,
  createChannel,
  getChatUserDetails,
  getChatUserConversations,
  sendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  forwardMessage,
  deleteUserMessages,
  getChannelDetails,
  toggleFavouriteContact,
  getArchiveContact,
  toggleArchiveContact,
  readConversation,
  deleteImage,
};
