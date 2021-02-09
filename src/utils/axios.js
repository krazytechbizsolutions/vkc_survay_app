/* eslint-disable */
import axios from 'axios';
import Config from 'react-native-config';
import { storeToken, getToken } from './index';

const instance = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 3000,
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    const token = await getToken();

    if (token) {
      config.baseURL = token.instance_url;
      config.headers['Authorization'] = 'Bearer ' + token.access_token;        
      config.headers['Content-Type'] = 'application/json';
      config.headers['x-requested-with'] = 'XMLHttpRequest';
    } else {
      config.baseURL = Config.BASE_URL;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error.response.status === 401) {
      await storeToken(null);
    }

    return Promise.reject(error);
  },
);

export default instance;
