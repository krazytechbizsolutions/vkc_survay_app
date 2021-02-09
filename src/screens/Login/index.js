/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import SafeAreaView from 'react-native-safe-area-view';
import Config from 'react-native-config';
import Form from '../../components/form/Form';
import fields from './fields';
import { storeToken, getToken } from '../../utils';
import axios from '../../utils/axios';
import Loading from '../../components/loading/Loading';

const Login = ({ navigation }) => {
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [error, seteError] = useState(false);

  const headerImage = () => (
    <Image
      resizeMode="contain"
      style={{
        flex: 1,
        height: 200,
        width: undefined,
      }}
      source={require('../../assets/Logo/VKC_Logo.jpg')}
    />
  );
  useEffect(() => {
    const checkToken = async () => {
      try {
        setLoading(true);
        const data = await getToken();
        if (data) {
          navigation.navigate('Home');
        }
      } catch (error) {
        seteError(error);
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) {
    <Loading />;
  }

  const login = async (values, actions) => {
    try {
      const res = await axios.post('oauth2/token', null, {
        params: {
          grant_type: 'password',
          client_id: Config.CLIENT_ID,
          client_secret: Config.CLIENT_SECRET,
          ...values,
        },
      });
      await storeToken(res.data);
      navigation.navigate('Home');
    } catch (error) {
      // actions.setStatus({ serverError: error.message });
      actions.setStatus({ serverError: "Invalid Credentials" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never', bottom: 'always' }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} enabled={Platform.OS === 'ios'}>
        <View
          style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {headerImage()}
        </View>
        <View style={{ flex: 3 }}>
          <Form
            initialValues={{
              username: '',
              password: '',
            }}
            fields={fields}
            onSubmit={login}
            disableKAV
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
