/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { WebView } from 'react-native-webview';
import SafeAreaView from 'react-native-safe-area-view';
// import { View, Image } from 'react-native';
// import Config from 'react-native-config';
// import styles from './styles';
// import Text from '../../components/text/Text';
// import Button from '../../components/button/Button';
// import CommunityLogin from '../communityLogin/CommunityLogin';

// const title = 'Please select your user type';

// const actionItem = [
//   // {
//   //   title: 'Manager and above',
//   //   path: `${Config.AUTHORIZATION_URL}?response_type=${Config.RESPONSE_TYPE}&client_id=${
//   //     Config.CLIENT_ID
//   //   }&redirect_uri=${encodeURIComponent(Config.CALLBACK)}`,
//   // },
//   {
//     title: 'ASI / MDC',
//     path: 'CommunityLogin',
//   },
// ];

const Login = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
    <WebView source={{ uri: '' }} javaScriptEnabled startInLoadingState incognito />
  </SafeAreaView>
);

export default memo(Login);
