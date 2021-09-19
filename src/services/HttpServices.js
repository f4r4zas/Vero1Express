import axios from 'axios';

export default class HttpServices {
  static get(url, headers) {
    console.log('Get Headers : ', headers);
    return axios({method: 'GET', url, headers});
  }

  static post(url, headers, data) {
    console.log('Post Headers : ', headers);
    console.log('Post data : ', data);
    return axios({method: 'POST', url, headers, data});
  }
  static put(url, headers, data) {
    console.log('Post Headers : ', headers);
    return axios({method: 'PUT', url, headers, data});
  }
}
