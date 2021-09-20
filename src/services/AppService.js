import {requestUrls} from './config';
import HttpServices from './HttpServices';
import {Store} from '../reduxStore/Store';
import asyncStorage from './asyncStorage';
const params = new URLSearchParams();
import qs from 'qs';

export const headerInfo = {
  userKey:
    'Bearer' +
    ' ' +
    '$2a$10$gNcaWm5FfzeAyDFVfuIjeOAm2ME/Hgv6PofXy5szRAt7Lod.t1mcG',
  adminKey:
    'Bearer' +
    ' ' +
    '$2a$10$z1qoIGiG17pjSQjcAUBrlu8y3K13.aen2YZ0bhWXpwaAXsxRgXkx.',
  mobileVerification:
    'Basic' +
    ' ' +
    'QUM5YWMyMGYyYTkyOWY2ZDE3YjI3ZmUxOGIzOWY3NGUxNTplMzdlNzFjOGUzZmJiNmZmODhiZmE3MzNlNGE3MDJjMA==',
  contentType: 'application/x-www-form-urlencoded',
  cartContentType: 'application/json',
  // userApiKey: userApiKey(),
};
let userApiKey = async () => {
  const {auth} = Store.getState();
  if (auth.user) {
    if (typeof auth.user == 'string') {
      const user_data = JSON.parse(auth.user);
      const api_key = user_data.api_key;
      return 'Bearer ' + api_key;
    } else {
      const api_key = auth.user.api_key;
      return 'Bearer ' + api_key;
    }
  } else {
    let userStringData = '';
    await asyncStorage.getItem('user_data').then(res => {
      userStringData = res;
    });
    console.log('userStringData: ', userStringData);
    if (typeof userStringData == 'string') {
      let userJsonData = JSON.parse(userStringData);
      let userApiKey = userJsonData.api_key;
      return 'Bearer ' + userApiKey;
    } else {
      let userApiKey = userStringData.api_key;
      return 'Bearer ' + userApiKey;
    }
  }
};
class AppService extends HttpServices {
  static sendMobileVerification(mobile_number) {
    let Channel = 'sms';
    params.append(mobile_number);
    params.append(Channel);
    const data = qs.stringify({To: mobile_number, Channel: Channel});
    return this.post(
      requestUrls['sendMobileVerification'],
      (headers = {Authorization: headerInfo.mobileVerification}),
      data,
    );
  }
  static verifyMobileVerification(mobile_number, verification_code) {
    // let Channel = 'sms';
    params.append(mobile_number);
    params.append(verification_code);
    const data = qs.stringify({To: mobile_number, Code: verification_code});
    return this.post(
      requestUrls['verifyMobileVerification'],
      (headers = {Authorization: headerInfo.mobileVerification}),
      data,
    );
    // let url = requestUrls['verifyMobileVerification'];
    // url += `?mobile_number=${mobile_number}&verification_code=${verification_code}`;
    // return this.get(url);
  }
  static verifyUser(mobile_number) {
    params.append(mobile_number);
    const data = qs.stringify({mobile_number: mobile_number});
    // debugger;
    // let url = requestUrls['verifyUser'];
    // url += `?mobile_number=${mobile_number}`;
    // return this.get(url, headers);
    return this.post(
      requestUrls['verifyUser'],
      (headers = {
        Authorization: headerInfo.adminKey,
        'Content-Type': headerInfo.contentType,
      }),
      data,
    );
  }
  static registerUser(payload) {
    const {first_name, last_name, email, gender, mobile_number, user_type} =
      payload;
    // debugger;
    params.append(user_type);
    params.append(first_name);
    params.append(last_name);
    params.append(mobile_number);
    params.append(email);
    params.append(gender);
    const data = qs.stringify({
      user_type: user_type,
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      email: email,
      gender: gender,
    });
    return this.post(
      requestUrls['registerUser'],
      (headers = {'Content-Type': headerInfo.contentType}),
      data,
    );
  }
  static getStoreData() {
    let url = requestUrls['stores'];
    return this.get(url, (headers = {Authorization: headerInfo.userKey}));
  }
  static getItemList(payload) {
    const {store_name, page, per_page} = payload;

    let url = requestUrls['getItemList'];
    // url += `?product_store=${store_name}`;
    url += `?product_store=${store_name}&page=${page}&per_page=${per_page}`;
    return this.get(url, (headers = {Authorization: headerInfo.userKey}));
  }
  static async addItemToCart(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['addItemToCart'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
  static async updateItemToCart(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);

    return this.post(
      requestUrls['updateItemToCart'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
  static async getItemsFromCart() {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.get(
      requestUrls['getItemsFromCart'],
      (headers = {Authorization: api_key}),
    );
  }
  static async deleteItemFromCart(id) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);

    return this.post(
      requestUrls['deleteItemFromCart'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      id,
    );
  }
  static async emptyCart() {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['emptyCart'],
      (headers = {Authorization: api_key}),
    );
  }
  static async createWallet(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['createWallet'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
  static async getCustomerWallet() {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.get(
      requestUrls['getCustomerWallet'],
      (headers = {Authorization: api_key}),
    );
  }
  static async addAmount(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['addAmount'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
  static async createPurchase(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['createPurchase'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
  static async makePayment(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['makePayment'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
  static async deleteCardFromWallet(payload) {
    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    const {card_id} = payload;
    params.append(card_id);
    const data = qs.stringify({
      card_id: card_id,
    });
    return this.post(
      requestUrls['deleteCardFromWallet'],
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.contentType,
      }),
      data,
    );
  }
}

export default AppService;
