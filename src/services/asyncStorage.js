import AsyncStorage from '@react-native-community/async-storage';
class asyncStorage {
  static ls = AsyncStorage;

  static setItem(key, value) {
    this.ls.setItem(key, JSON.stringify(value));
  }

  static getItem(key) {
    const value = this.ls.getItem(key);
    // console.log('getItem: ', JSON.parse(value));
    return value;
  }

  static removeItem(key) {
    this.ls.removeItem(key);
  }

  static clear() {
    this.ls.clear();
  }

  static getHeaderToken() {
    const token = this.getItem('@header_token');
    return token;
  }

  static setHeaderToken(value) {
    this.setItem('@header_token', value);
  }

  static removeHeaderToken() {
    this.removeItem('@header_token');
  }

  static getDataToken() {
    this.getItem('@data_token');
  }

  static setDataToken(value) {
    this.setItem('@data_token', value);
  }

  static removeDataToken() {
    this.removeItem('@data_token');
  }
}

export default asyncStorage;
