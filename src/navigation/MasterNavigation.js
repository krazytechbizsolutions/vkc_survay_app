/* eslint-disable react-native/no-inline-styles */
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Home from '@screens/Home';
import SurveyQue from '@screens/SurveyQue';
import AddRetailer from '@screens/AddRetailer';
import UnplannedVisits from '@screens/UnplannedVisits';
import Login from '@screens/Login';
import { AuthContext } from 'src/context/authContext';
import VKCLogo from '../assets/Logo/VKC_Logo.jpg';

const MainStack = createStackNavigator();

const MainStackScreen = () => {
  const { colors } = useTheme();
  const { token } = useContext(AuthContext);
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.text,
        title: false,
      }}>
      {token ? (
        <>
          <MainStack.Screen name="Home" component={Home} />
          <MainStack.Screen
            name="SurveyQue"
            component={SurveyQue}
            options={{
              headerShown: true,
              headerRight: () => <Image style={{ width: 40, height: 40 }} source={VKCLogo} />,
              headerRightContainerStyle: { marginRight: 20 },
            }}
          />
          <MainStack.Screen
            name="AddRetailer"
            component={AddRetailer}
            options={{ headerShown: true, title: 'Add Retailer', headerTitleAlign: 'center' }}
          />
          <MainStack.Screen
            name="UnplannedVisit"
            component={UnplannedVisits}
            options={{ headerShown: true, title: 'Unplanned Visit', headerTitleAlign: 'center' }}
          />
        </>
      ) : (
        <MainStack.Screen name="Login" component={Login} />
      )}
    </MainStack.Navigator>
  );
};

export default MainStackScreen;
