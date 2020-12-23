/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import { startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import crashlytics from '@react-native-firebase/crashlytics';
import axios from 'axios';
import Config from 'react-native-config';
import Geolocation from 'react-native-geolocation-service';

export const { OS } = Platform;

const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

export const weekDays = eachDayOfInterval({
  start: startWeek,
  end: addDays(startWeek, 13),
});

export const Api = token => {
  const AxiosInstance = axios.create({
    baseURL: Config.BASE_URL,
    timeout: 100000,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  AxiosInstance.interceptors.request.use(
    config => {
      if (token) {
        config.headers.authorization = token;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  AxiosInstance.interceptors.response.use(
    response => {
      // if (response.data.statusMessage.toLowerCase() === 'success') {
      //   return response;
      // } else {
      //   return Promise.reject(new Error(response.data.statusMessage));
      // }
      const { statusCode } = response.data;
      if (parseInt(statusCode, 10) < 200 || parseInt(statusCode, 10) > 299) {
        return Promise.reject(new Error(response.data.statusMessage));
      }
      return response;
    },
    error => {
      const { status } = error.response;
      if (status === 401) {
        return Promise.reject(new Error('Session expired or invalid. Please Login Again.'));
      }
      return Promise.reject(error);
    },
  );

  return AxiosInstance;
};

export const getToken = state => {
  const { access_token, token_type } = state.auth;
  if (token_type && access_token) {
    return `${token_type} ${access_token}`;
  }
  return '';
};

export const camalize = str =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

export const isConnected = state => state.network.isConnected;

export const action = (type, payload, meta) => ({
  type,
  payload,
  meta,
});

export const groupBy = function (xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const hasLocationPermission = async () => {
  if (OS === 'ios' || (OS === 'android' && Platform.Version < 23)) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
  }

  return false;
};

export const getLocation = () =>
  new Promise(async (resolve, reject) => {
    const locationPermission = await hasLocationPermission();
    if (!locationPermission) {
      reject('Location Permission Not available');
    }
    const onChange = ({ coords }) => {
      resolve(coords);
    };

    const onError = err => {
      reject(err.message);
    };

    const defaultSettings = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      distanceFilter: 50,
      forceRequestLocation: true,
    };

    Geolocation.getCurrentPosition(onChange, onError, defaultSettings);
  });

export const registerCrashlytics = async user => {
  try {
    await Promise.all([
      crashlytics().setUserId(user.Id),
      crashlytics().setUserName(user.Username),
      crashlytics().setUserEmail(user.Email),
      crashlytics().setAttribute('UserType', user.UserType),
      crashlytics().setAttribute('UserRoleId', user.UserRoleId),
      crashlytics().setAttribute('Name', user.Name),
      crashlytics().setAttribute('ProfileId', user.ProfileId),
    ]);
  } catch (error) {
    console.warn('Crashlytics not registered');
  }
};

export const recordError = error => {
  crashlytics().recordError(error);
};
