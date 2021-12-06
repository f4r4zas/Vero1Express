import AsyncStorage from '@react-native-community/async-storage';

// const serverUrl = '157.230.183.30';
export const url = 'http://157.230.183.30';
const twiloURL =
  'https://verify.twilio.com/v2/Services/VAe1c02a852065f25c1c8684dbc2d664d7';
// const VerificationCheck =
//   'https://verify.twilio.com/v2/Services/VAe1c02a852065f25c1c8684dbc2d664d7/VerificationCheck';
import { Store } from '../reduxStore/Store';
// // const url = 'http://52.14.8.1:'
export const serverUrl = `${url}:3000`;

const requestUrls = {
  //Authentication Controller
  sendMobileVerification: `${twiloURL}/Verifications`,
  verifyMobileVerification: `${twiloURL}/VerificationCheck`,
  verifyUser: `${serverUrl}/users/find`,
  registerUser: `${serverUrl}/register`,
  stores: `${serverUrl}/stores`,
  getItemList: `${serverUrl}/product/search`,
  getCategories: `${serverUrl}/category`,
  getProductSearch: `${serverUrl}/product/search`,
  addItemToCart: `${serverUrl}/basket`,
  updateItemToCart: `${serverUrl}/basket/update-item`,
  getItemsFromCart: `${serverUrl}/basket`,
  deleteItemFromCart: `${serverUrl}/basket/delete`,
  emptyCart: `${serverUrl}/basket/empty`,
  createWallet: `${serverUrl}/wallet`,
  getCustomerWallet: `${serverUrl}/wallet`,
  makePayment: `${serverUrl}/wallet/make-payment`,
  deleteCardFromWallet: `${serverUrl}/wallet/delete-card-customer`,
  addAmount: `${serverUrl}/purchase/charge`,
  createPurchase: `${serverUrl}/driver/request-driver`,
  uploadImage: `${serverUrl}/image`,

  //Logout Controller
  // logOut: `${serverUrl}/logout`,
};

export { requestUrls };
