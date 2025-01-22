import axios from "axios";

const API_URL =
  "https://pbxbackend.callanalog.com/public/api/extension_login";

// postForgetPwd
const postFakeForgetPwd = (data: any) => {};

// postForgetPwd
const postJwtForgetPwd = (data: any) => {};

const postFakeLogin = (data: any) => {};

const postJwtLogin = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

// Register Method
const postFakeRegister = (data: any) => {
  return null;
};

// Register Method
const postJwtRegister = (data: any) => {
  return null;
};
const changePassword = (data: object) => {
  return null;
};

// postSocialLogin
const postSocialLogin = (data: any) => null;

export {
  postFakeForgetPwd,
  postJwtForgetPwd,
  postFakeLogin,
  postJwtLogin,
  postFakeRegister,
  postJwtRegister,
  changePassword,
  postSocialLogin,
};
