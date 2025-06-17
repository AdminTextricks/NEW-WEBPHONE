import { AuthLoginActionTypes, AuthLoginState } from "./types";

const localStorageUser = localStorage.getItem("user");

// export const INIT_STATE: AuthLoginState = {
//   error: "",
//   loading: false,
// };

export const INIT_STATE: any = {
  isUserLogin: localStorageUser ? true : false,
  error: null,
  loading: false,
  isUserLogout: false,
  user: localStorageUser ? JSON.parse(localStorageUser) : null, // Parse user data if available
};

const Login = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case AuthLoginActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AuthLoginActionTypes.LOGIN_USER:
          localStorage.setItem(
            "user",
            JSON.stringify(action.payload.data.data),
          );
          return {
            ...state,
            user: action.payload.data.data,
            loading: false,
            isUserLogin: true,
            isUserLogout: false,
          };
        case AuthLoginActionTypes.LOGOUT_USER:
          return {
            ...state,
            loading: false,
            isUserLogout: true,
          };
        default:
          return { ...state };
      }

    case AuthLoginActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AuthLoginActionTypes.LOGIN_USER:
          return {
            ...state,
            error: action.payload.error,
            isUserLogin: false,
            loading: false,
          };
        case AuthLoginActionTypes.LOGOUT_USER:
          return {
            ...state,
            loading: false,
            isUserLogin: false,
            isUserLogout: false,
          };
        default:
          return { ...state };
      }

    case AuthLoginActionTypes.LOGIN_USER: {
      return {
        ...state,
        loading: true,
        isUserLogin: false,
      };
    }

    case AuthLoginActionTypes.LOGOUT_USER:
      return {
        ...state,
        loading: false,
        isUserLogout: false,
      };
    default:
      return { ...state };
  }
};

export default Login;
