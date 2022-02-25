import {
  MOBILE_VERIFICATION,
  MOBILE_VERIFICATION_FAILURE,
  MOBILE_VERIFICATION_SUCCESS,
  CODE_VERIFICATION,
  CODE_VERIFICATION_FAILURE,
  CODE_VERIFICATION_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  USER_DATA,
  // LOGOUT_SUCCESS,
  // UPDATE_HEADER_TOKEN,
  // GENERATE_OTP,
  // GENERATE_OTP_FAILURE,
  // GENERATE_OTP_SUCCESS,
  // RESET_PIN,
  // RESET_PIN_FAILURE,
  // RESET_PIN_SUCCESS,
  // ADD_TO_CART,
  // REMOVE_FROM_CART,
} from '../constants';

const initialState = {
  user: null,

  mobileVericifationLoader: false,
  mobileVericifationError: null,
  isMobileVerified: false,
  isMobileVerifiedLoader: false,
  isMobileVerifiedError: null,

  codeVericifationLoader: false,
  codeVericifationError: null,

  isCodeVerified: false,
  isCodeVerifiedLoader: false,
  isCodeVerifiedError: null,

  loginLoader: false,
  loginError: null,

  isLogin: false,
  isLoginLoader: false,
  isLoginError: null,
  loginFailureData: null,
  // cart: null,
  // counter: 0,

  emailVerified: false,

  register: null,
  registerLoader: false,
  registerError: null,

  // TOKENS
  // header_token: '',
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    ////////////////////////// MOBILE_VERIFICATION /////////////////////
    case MOBILE_VERIFICATION:
      return {
        ...state,
        user: null,
        mobileVericifationLoader: true,
        mobileVericifationError: null,
      };

    case MOBILE_VERIFICATION_SUCCESS:
      console.log('in Reducer: ', action.payload);
      return {
        ...state,
        user: action.payload,
        // header_token: action.payload?.token || '',
        mobileVericifationLoader: false,
        mobileVericifationError: null,

        isMobileVerified: true,
        isMobileVerifiedLoader: false,
        isMobileVerifiedError: null,
      };

    case MOBILE_VERIFICATION_FAILURE:
      return {
        ...state,
        user: null,
        mobileVericifationLoader: false,
        mobileVericifationError: action.error,
      };

    ////////////////////////// CODE_VERIFICATION /////////////////////
    case CODE_VERIFICATION:
      return {
        ...state,
        user: null,
        codeVericifationLoader: true,
        codeVericifationError: null,
      };

    case CODE_VERIFICATION_SUCCESS:
      console.log('in Reducer: ', action.payload);
      return {
        ...state,
        user: action.payload,
        // header_token: action.payload?.token || '',
        codeVericifationLoader: false,
        codeVericifationError: null,

        isCodeVerified: true,
        isCodeVerifiedLoader: false,
        isCodeVerifiedError: null,
      };

    case CODE_VERIFICATION_FAILURE:
      return {
        ...state,
        user: null,
        codeVericifationLoader: false,
        codeVericifationError: action.error,
      };

    ////////////////////////// LOGIN /////////////////////
    case LOGIN:
      return {
        ...state,
        user: null,
        loginLoader: true,
        loginError: null,
      };

    case LOGIN_SUCCESS:
      console.log('in Reducer: ', action.payload);
      return {
        ...state,
        user: action.payload,
        // header_token: action.payload?.token || '',
        loginLoader: false,
        loginError: null,

        isLogin: true,
        isLoginLoader: false,
        isLoginError: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        loginLoader: false,
        loginError: action.error,
        loginFailureData: action.payload,
      };

    ////////////////////////// REGISTER /////////////////////
    case REGISTER:
      return {
        ...state,
        emailVerified: false,
        register: null,
        registerLoader: true,
        registerError: null,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        register: action.payload,
        registerLoader: false,
        registerError: null,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        register: null,
        registerLoader: false,
        registerError: action.error,
      };

    case USER_DATA:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
    ////////////////////////// ADD_TO_CART /////////////////////
    // case ADD_TO_CART:
    //   return {
    //     ...state,
    //     ...state.cart,
    //     ...state.counter,
    //     cart: action.payload,
    //     counter: state.counter + 1,
    //   };

    // case REMOVE_FROM_CART:
    //   return {
    //     ...state,
    //     ...state.cart,
    //     ...state.counter,
    //     cart: action.payload,
    //     counter: state.counter - 1,
    //   };

    ////////////////////////// REMOVE_FROM_CART /////////////////////

    ////////////////////////// HEADER TOKEN /////////////////////
    // case UPDATE_HEADER_TOKEN:
    //   return {
    //     ...state,
    //     header_token: action.payload,
    //   };

    ////////////////////////// RESET PIN /////////////////////
    // case RESET_PIN:
    //   return {
    //     ...state,
    //     resetPinLoader: true,
    //     resetPinError: null,
    //   };

    // case RESET_PIN_SUCCESS:
    //   return {
    //     ...state,
    //     header_token: action.payload,
    //     resetPinLoader: false,
    //     resetPinError: null,
    //   };

    // case RESET_PIN_FAILURE:
    //   return {
    //     ...state,
    //     header_token: action.token,
    //     resetPinLoader: false,
    //     resetPinError: action.error,
    //   };

    ////////////////////////// RESEND OTP /////////////////////
    // case GENERATE_OTP:
    //   return {
    //     ...state,
    //     generateOtpLoader: true,
    //     generateOtpError: null,
    //   };

    // case GENERATE_OTP_SUCCESS:
    //   return {
    //     ...state,
    //     header_token: action.payload,
    //     generateOtpLoader: false,
    //     generateOtpError: null,
    //   };

    // case GENERATE_OTP_FAILURE:
    //   return {
    //     ...state,
    //     header_token: action.token,
    //     generateOtpLoader: false,
    //     generateOtpError: action.error,
    //   };
    ////////////////////////// SIGNOUT /////////////////////
    // case LOGOUT_SUCCESS:
    //   state = initialState;
    //   return state;
  }
}
