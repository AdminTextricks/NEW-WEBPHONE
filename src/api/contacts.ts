import axios from "axios";

const getContacts = async (data: any) => {
  try {
    const response = await axios.get(
      `https://pbxlivebackend.callanalog.com/public/api/getContactList?name=${data.name}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

const inviteContact = (data: object) => {
  return null;
};

export { getContacts, inviteContact };
