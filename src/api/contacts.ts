import axios from "axios";

const getContacts = async (name: string | number) => {
  try {
    const response = await axios.get(
      `https://pbxlivebackend.callanalog.com/public/api/getContactList?name=${name}`,
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

const inviteContact = (data: object) => {
  return null;
};

export { getContacts, inviteContact };
