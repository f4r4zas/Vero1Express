// import history from '@history.js';
import Snackbar from 'react-native-snackbar';
import messaging from '@react-native-firebase/messaging';
import {
  MOBILE_VERIFICATION,
  MOBILE_VERIFICATION_SUCCESS,
  MOBILE_VERIFICATION_FAILURE,
  CODE_VERIFICATION,
  CODE_VERIFICATION_SUCCESS,
  CODE_VERIFICATION_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_DATA,
  // ADD_TO_CART,
  // REMOVE_FROM_CART,
  // RESET_PIN,
  // RESET_PIN_SUCCESS,
  // RESET_PIN_FAILURE,
  // GENERATE_OTP,
  // GENERATE_OTP_SUCCESS,
  // GENERATE_OTP_FAILURE,
  // LOGOUT,
  // LOGOUT_SUCCESS,
  // LOGOUT_FAILURE,
  // UPDATE_HEADER_TOKEN,
} from '../constants';

import asyncStorage from '../../services/asyncStorage';
import AppService from '../../services/AppService';
// import {
//   handleApiResponseError,
//   showSuccess,
//   showError,
//   validationError,
// } from '../../helpers/methods';

// import {setGlobalLoader} from './LayoutActions';

////////////////////////  MOBILE_VERIFICATION  ////////////////////
export const sendMobileVerification = payload => async dispatch => {
  const { mobile_number } = payload;
  dispatch({ type: MOBILE_VERIFICATION });
  asyncStorage.setItem('mobile_num', mobile_number);
  // try {
  await AppService.sendMobileVerification(mobile_number)
    .then(res => {
      console.log('login: data: ', res);
      // const {data} = res.data;
      if (res.data.account_sid) {
        dispatch({ type: MOBILE_VERIFICATION_SUCCESS, payload: res.data });
        // asyncStorage.setItem('verification_code', res.data);
        // return data.message
      } else {
        dispatch({ type: MOBILE_VERIFICATION_FAILURE, payload: res.data });
        // return data.message
      }
    })
    .catch(error => {
      console.log('error: ', error);
      console.log('error.response: ', error.response);
      // this.setState({ loading: false });
      Snackbar.show({
        text: error.response.data.message,
        duration: Snackbar.LENGTH_LONG,
      });
    });
  // } catch (error) {
  //   // showError(error);
  //   dispatch({type: MOBILE_VERIFICATION_FAILURE, error});
  // }
};

////////////////////////  CODE_VERIFICATION  ////////////////////
export const verifyMobileVerification = payload => async dispatch => {
  const { mobile_number, verification_code } = payload;
  dispatch({ type: CODE_VERIFICATION });
  try {
    await AppService.verifyMobileVerification(mobile_number, verification_code)
      .then(res => {
        console.log('code Verification: ', res);
        const { data } = res;
        if (data.status == 'approved') {
          // verifyUser(mobile_number);
          dispatch({ type: CODE_VERIFICATION_SUCCESS, payload: data });
          // asyncStorage.setItem(data.data.mobile_number);
          // return data.message
        } else {
          dispatch({ type: CODE_VERIFICATION_FAILURE, payload: data });
          // return data.message
        }
      })
      .catch(error => {
        console.log('error: ', error);
        console.log('error.response: ', error.response);
        // this.setState({ loading: false });
        Snackbar.show({
          text: error.response.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
      });
  } catch (error) {
    // showError(error);
    dispatch({ type: CODE_VERIFICATION_FAILURE, error });
  }
};

export const verifyUser = data => async dispatch => {
  const { mobile_number } = data;
  dispatch({ type: LOGIN });

  console.log('mobile_number***: ', mobile_number);
  try {
    let api = await AppService.verifyUser(mobile_number)
      .then(res => {
        console.log('verify User api: ', res);
        // debugger;
        const { data } = res.data;
        // debugger;
        if (res.data.status) {
          // let api_key = data[0].api_key;
          // let mobile_num = data[0].mobile_number;
          // let user_type = data[0].user_type;
          const user_data = data[0];
          // debugger;
          messaging().subscribeToTopic('ride-accepted-' + user_data._id);
          messaging().subscribeToTopic('ride-started-' + user_data._id);
          messaging().subscribeToTopic('ride-ended-' + user_data._id);
          messaging().subscribeToTopic('ride-usercancelled-' + user_data._id);
          messaging().subscribeToTopic('driver-location-ride-' + user_data._id);
          dispatch({ type: LOGIN_SUCCESS, payload: user_data });
          // asyncStorage.setItem('api_key', api_key);
          // asyncStorage.setItem('mobile_number', mobile_num);
          // asyncStorage.setItem('user_type', user_type);
          asyncStorage.setItem('user_data', user_data);
        } else {
          dispatch({ type: LOGIN_FAILURE, payload: res.data.error });
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.message;
        console.log(
          'api result: ',
          error.response.data,
          ' errorMessage: ',
          errorMessage,
        );
        if (error.response.data.status == false) {
          dispatch({
            type: LOGIN_FAILURE,
            errorMessage,
            payload: error.response.data,
          });
          // return error.response.data;
        }
        // console.log(error);
      });
  } catch (error) {
    let errorMessage = error.response.data.message;
    console.log(
      'api result: ',
      error.response.data,
      ' errorMessage: ',
      errorMessage,
    );
    if (error.response.data.status == false) {
      dispatch({ type: LOGIN_FAILURE, errorMessage });
      return error.response.data;
    }
    console.log(error);
  }
};

////////////////////////// REGISTER /////////////////////
export const registerUser = payload => async dispatch => {
  dispatch({ type: REGISTER });
  try {
    // debugger;
    await AppService.registerUser(payload)
      .then(res => {
        console.log('code Verification: ', res);
        const { data } = res.data;
        // debugger;
        if (res.data.status) {
          // asyncStorage.setItem(data.data.mobile_number);
          dispatch({ type: REGISTER_SUCCESS, payload: data });
          // const api_key = data[0].api_key;
          const mobile_num = data.mobile_number;
          // const user_type = data[0].user_type;
          const user_data = data;
          messaging().subscribeToTopic('ride-accepted-' + user_data._id);
          messaging().subscribeToTopic('ride-started-' + user_data._id);
          messaging().subscribeToTopic('ride-ended-' + user_data._id);
          messaging().subscribeToTopic('ride-usercancelled-' + user_data._id);
          messaging().subscribeToTopic('driver-location-ride-' + user_data._id);
          dispatch({ type: LOGIN_SUCCESS, payload: user_data });
          // asyncStorage.setItem('api_key', api_key);
          asyncStorage.setItem('mobile_number', mobile_num);
          // asyncStorage.setItem('user_type', user_type);
          asyncStorage.setItem('user_data', user_data);
          // return data.message
        } else {
          dispatch({ type: REGISTER_FAILURE, payload: data });
          // return data.message
        }
      })
      .catch(error => {
        console.log('error: ', error);
        console.log('error.response: ', error.response);
        // this.setState({ loading: false });
        Snackbar.show({
          text: error.response.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
      });
  } catch (error) {
    // showError(error);
    dispatch({ type: REGISTER_FAILURE, error });
  }
  // dispatch({type: REGISTER});
  // try {
  //   const {data} = await AppService.submitRegisterCustomerForm(payload);

  //   if (
  //     data.responseCode == 641 ||
  //     data.responseCode == 615 ||
  //     data.responseCode == 614 ||
  //     data.responseCode == 625 ||
  //     data.responseCode == 643 ||
  //     data.responseCode == 656 ||
  //     data.responseCode == 657
  //   ) {
  //     dispatch({type: REGISTER_FAILURE});
  //     // return validationError('Invalid Credentials');
  //   }

  //   // handleApiResponseError(data, dispatch);
  //   console.log('User Registration Form ==>>', data);
  //   dispatch({
  //     type: REGISTER_SUCCESS,
  //     payload: {...data['data'], mobileNumber: payload['mobileNumber']},
  //   });
  // setCurrentStep(2);
  // } catch (error) {
  //   // showError(error);
  //   dispatch({type: REGISTER_FAILURE, error});
  // }
};

export const userData = payload => async dispatch => {
  dispatch({ type: USER_DATA, payload: payload });
};

// export const addToCart = payload => async dispatch => {
//   console.log('payload addToCart: ', payload);
//   dispatch({type: ADD_TO_CART, payload: payload});
// };
// export const removeFromCart = payload => async dispatch => {
//   dispatch({type: REMOVE_FROM_CART, payload: payload});
//   console.log('payload removeFromCart: ', payload);
// };

////////////////////////  RESET PIN  ////////////////////
// export const resetNewPin = payload => async dispatch => {
//   dispatch(setGlobalLoader(true));
//   console.log('tufail RESET PIN payload: ', payload);
//   let nextToken = '';

//   dispatch({type: RESET_PIN});

//   try {
//     const {data, headers} = await AppService.resetCustomerPin(payload);

//     console.log('tufail resetNewPin data: ', data);
//     console.log('tufail resetNewPin headers: ', headers);

//     nextToken = headers['x-auth-next-token'];
//     console.log('next token: ', nextToken);
//     // handleApiResponseError(data, dispatch);

//     console.log('Response === >> ', data);
//     if (data.responseCode === '633' || data.responseCode === '606') {
//       dispatch(setGlobalLoader(false));
//       // return validationError('Incorrect Old Pin');
//     }

//     // showSuccess('Pin Changed');

//     // dispatch({ type: RESET_PIN_SUCCESS, payload: nextToken });
//     dispatch({type: RESET_PIN_SUCCESS, payload: nextToken});
//     dispatch(setGlobalLoader(false));

//     dispatch(getAccountsList());

//     // window.location.reload();
//     // history.push('/dashboard');
//     // history.push("/dashboard");
//     console.log('Response === >> ', data);
//   } catch (error) {
//     dispatch(setGlobalLoader(false));
//     // showError(error);
//     dispatch({type: RESET_PIN_FAILURE, error, token: nextToken});
//     // history.push('/session/MOBILE_VERIFICATION');
//     // history.push("/session/MOBILE_VERIFICATION");
//   }
// };

////////////////////////  GENERATE OTP  ////////////////////
// export const generateOtp = payload => async dispatch => {
//   let nextToken = '';

//   dispatch({type: GENERATE_OTP});
//   dispatch({type: SET_GLOBAL_LOADER, payload: true});
//   try {
//     const {data, headers} = await AppService.generateOTP();
//     nextToken = headers['x-auth-next-token'];
//     // handleApiResponseError(data, dispatch);
//     // showSuccess(data['data']['result']);
//     dispatch({type: GENERATE_OTP_SUCCESS, payload: nextToken});
//     dispatch({type: SET_GLOBAL_LOADER, payload: false});
//   } catch (error) {
//     // showError(error);
//     dispatch({type: GENERATE_OTP_FAILURE, error, token: nextToken});
//     dispatch({type: SET_GLOBAL_LOADER, payload: false});
//   }
// };

////////////////////////  LOGOUT  ////////////////////
// export const logout = payload => async dispatch => {
//   // dispatch({ type: LOGOUT });
//   // try {
//   //   const { data } = await AppService.logOut();
//   //   handleApiResponseError(data, dispatch);
//   dispatch({type: LOGOUT_SUCCESS});
//   // history.push('/session/MOBILE_VERIFICATION');
//   // history.push("/session/MOBILE_VERIFICATION");
//   // } catch (error) {
//   //   showError(error);
//   //   dispatch({ type: LOGOUT_FAILURE, error });
//   // }
// };

////////////////////////  UPDATE HEADER TOKEN  ////////////////////
// export const updateHeaderToken = payload => dispatch => {
//   dispatch({type: UPDATE_HEADER_TOKEN, payload});
// };
