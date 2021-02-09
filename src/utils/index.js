/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import { startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import axios from 'axios';
import Config from 'react-native-config';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const { OS } = Platform;

export const getToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@token');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw new Error('Something went wrong');
  }
};

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw new Error('Something went wrong');
  }
};

export const storeToken = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@token', jsonValue);
  } catch (e) {
    throw new Error('Something went wrong');
  }
};

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    throw new Error('Something went wrong');
  }
};

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
