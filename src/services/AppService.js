import { requestUrls } from './config';
import HttpServices from './HttpServices';
import { Store } from '../reduxStore/Store';
import asyncStorage from './asyncStorage';
import axios from 'axios';
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
    '$2a$10$qe37jtOjiqVJMGsf6oDMA.m/d8JMaH180NfHLa5tZVD1OS.A8AErK',
  // '$2a$10$z1qoIGiG17pjSQjcAUBrlu8y3K13.aen2YZ0bhWXpwaAXsxRgXkx.',
  mobileVerification:
    'Basic' +
    ' ' +
    'QUM5YWMyMGYyYTkyOWY2ZDE3YjI3ZmUxOGIzOWY3NGUxNTplMzdlNzFjOGUzZmJiNmZmODhiZmE3MzNlNGE3MDJjMA==',
  contentType: 'application/x-www-form-urlencoded',
  cartContentType: 'application/json',
  uploadImage: 'multipart/form-data',
  // userApiKey: userApiKey(),
};
let userApiKey = async () => {
  const { auth } = await Store.getState();
  // debugger;
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
    console.log('userStringData******: ', userStringData);
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
    let headers = '';
    const key = headerInfo.mobileVerification;
    const Channel = 'sms';
    params.append(mobile_number);
    params.append(Channel);
    const data = qs.stringify({ To: mobile_number, Channel: Channel });
    return this.post(
      requestUrls['sendMobileVerification'],
      (headers = { Authorization: key }),
      data,
    );
  }
  static verifyMobileVerification(mobile_number, verification_code) {
    let headers = '';
    const key = headerInfo.mobileVerification;
    // let Channel = 'sms';
    params.append(mobile_number);
    params.append(verification_code);
    const data = qs.stringify({ To: mobile_number, Code: verification_code });
    return this.post(
      requestUrls['verifyMobileVerification'],
      (headers = { Authorization: key }),
      data,
    );
    // let url = requestUrls['verifyMobileVerification'];
    // url += `?mobile_number=${mobile_number}&verification_code=${verification_code}`;
    // return this.get(url);
  }
  static verifyUser(mobile_number) {
    let headers = '';

    const key = headerInfo.adminKey;
    const apiType = headerInfo.contentType;
    params.append(mobile_number);
    const data = qs.stringify({ mobile_number: mobile_number });
    // debugger;
    // let url = requestUrls['verifyUser'];
    // url += `?mobile_number=${mobile_number}`;
    // return this.get(url, headers);
    return this.post(
      requestUrls['verifyUser'],
      (headers = {
        Authorization: key,
        'Content-Type': apiType,
      }),
      data,
    );
  }
  static registerUser(payload) {
    let headers = '';

    const { first_name, last_name, email, gender, mobile_number, user_type } =
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
      (headers = { 'Content-Type': headerInfo.contentType }),
      data,
    );
  }
  static getStoreData() {
    let headers = '';

    const key = headerInfo.userKey;

    let url = requestUrls['stores'];
    return this.get(url, (headers = { Authorization: key }));
  }
  static getCategories(payload) {
    let headers = '';

    const { store_name, is_main, parent_id } = payload;

    let url = requestUrls['getCategories'];
    // url += `?product_store=${store_name}`;
    if (parent_id) {
      url += `?store_name=${store_name}&is_main=${is_main}&parent_id=${parent_id}`;
    } else {
      url += `?store_name=${store_name}&is_main=${is_main}`;
    }
    return this.get(url, {});
  }
  static getProductSearch(payload) {
    let headers = '';

    const key = headerInfo.userKey;

    const { product_store, product_category, product_name } = payload;

    let url = requestUrls['getProductSearch'];
    if (product_category) {
      url += `?product_store=${product_store}&product_category=${product_category}`;
    } else {
      url += `?product_store=${product_store}&product_name=${product_name}`;
    }
    return this.get(url, (headers = { Authorization: key }));
  }
  static getItemList(payload) {
    let headers = '';

    const { store_name, page, per_page } = payload;
    const key = headerInfo.userKey;

    let url = requestUrls['getItemList'];
    // url += `?product_store=${store_name}`;
    url += `?product_store=${store_name}&page=${page}&per_page=${per_page}`;
    return this.get(url, (headers = { Authorization: key }));
  }
  static async addItemToCart(payload) {
    let headers = '';

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
    let headers = '';

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
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.get(
      requestUrls['getItemsFromCart'],
      (headers = { Authorization: api_key }),
    );
  }
  static async deleteItemFromCart(id) {
    let headers = '';

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
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.post(
      requestUrls['emptyCart'],
      (headers = { Authorization: api_key }),
    );
  }
  static async createWallet(payload) {
    let headers = '';

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
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.get(
      requestUrls['getCustomerWallet'],
      (headers = { Authorization: api_key }),
    );
  }
  static async getUserRides() {
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    return this.get(
      requestUrls['getUserRides'],
      (headers = { Authorization: api_key }),
    );
  }
  static async addAmount(payload) {
    let headers = '';

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
    let headers = '';

    let api_key = await userApiKey();
    let urlApi = requestUrls['createPurchase'];
    let dataPayload = JSON.stringify(payload);
    console.log('headerInfo.userApiKey: ', api_key);
    return await axios({
      method: 'post',
      url: urlApi,
      data: payload,
      config: {
        headers: {
          Authorization: api_key,
          'Content-Type': headerInfo.cartContentType,
        },
      },
      headers: {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      },
    });
    // return this.post(
    //   requestUrls['createPurchase'],
    //   (headers = {
    //     Authorization: api_key,
    //     'Content-Type': headerInfo.cartContentType,
    //   }),
    //   payload,
    // );
  }
  static async makePayment(payload) {
    let headers = '';

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
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    const { card_id } = payload;
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
  static async uploadImage(payload) {
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', payload);
    const formData = new FormData();
    formData.append('image_type', 'purchase');
    formData.append('api_key', api_key);
    formData.append('image', payload);
    // Object.keys(payload).forEach(key => {
    //   formData.append(key, payload[key]);
    // });
    let urlApi = requestUrls['uploadImage'];
    // console.log('formData appened: ', formData);
    // console.log('urlApi: ', urlApi);

    return await axios({
      method: 'post',
      url: urlApi,
      data: formData,
      config: {
        headers: {
          Authorization: api_key,
          'Content-Type': 'multipart/form-data',
        },
      },
      headers: {
        Authorization: api_key,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async getDriverInfo(payload) {
    let headers = '';

    let api_key = await userApiKey();
    // console.log('headerInfo.userApiKey: ', api_key);
    let url = requestUrls['driverInfo'];
    const { _id } = payload;
    console.log(_id);
    url += `/${_id}`;
    return this.get(
      // requestUrls['driverInfo'],
      url,
      (headers = { Authorization: api_key }),
    );
    // params.append(_id);
    // const data = qs.stringify({ _id: _id });
    // return this.post(
    //   requestUrls['driverInfo'],
    //   (headers = {
    //     Authorization: headerInfo.adminKey,
    //     'Content-Type': headerInfo.contentType,
    //   }),
    //   data,
    // );
  }
  static async getNotifications() {
    let headers = '';

    let api_key = await userApiKey();
    // console.log('headerInfo.userApiKey: ', api_key);
    let url = requestUrls['notifications'];
    // const { _id } = payload;
    // console.log(_id);
    // url += `/${_id}`;
    return this.get(
      // requestUrls['driverInfo'],
      url,
      (headers = { Authorization: api_key }),
    );
    // params.append(_id);
    // const data = qs.stringify({ _id: _id });
    // return this.post(
    //   requestUrls['driverInfo'],
    //   (headers = {
    //     Authorization: headerInfo.adminKey,
    //     'Content-Type': headerInfo.contentType,
    //   }),
    //   data,
    // );
  }

  static async getTransactionHistory() {
    let headers = '';

    let api_key = await userApiKey();
    // console.log('headerInfo.userApiKey: ', api_key);
    let url = requestUrls['transactionHistory'];
    // const { _id } = payload;
    // console.log(_id);
    // url += `/${_id}`;
    return this.get(
      // requestUrls['driverInfo'],
      url,
      (headers = { Authorization: api_key }),
    );
    // params.append(_id);
    // const data = qs.stringify({ _id: _id });
    // return this.post(
    //   requestUrls['driverInfo'],
    //   (headers = {
    //     Authorization: headerInfo.adminKey,
    //     'Content-Type': headerInfo.contentType,
    //   }),
    //   data,
    // );
  }

  static async calculateFair(payload) {
    let headers = '';

    let api_key = await userApiKey();
    console.log('headerInfo.userApiKey: ', api_key);
    const url = `${requestUrls['driverInfo']}/${payload}/calculate-fair-v2`;
    return this.post(
      url,
      (headers = {
        Authorization: api_key,
        'Content-Type': headerInfo.cartContentType,
      }),
      payload,
    );
  }
}

export default AppService;
