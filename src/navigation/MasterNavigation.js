/* eslint-disable react-native/no-inline-styles */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Splash from '@screens/Splash';
import SurveyQue from '@screens/SurveyQue';
import AddRetailer from '@screens/AddRetailer';
import UnplannedVisits from '@screens/UnplannedVisits';
import VKCLogo from '../assets/Logo/VKC_Logo.jpg';

const MainStack = createStackNavigator();

const MainStackScreen = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.text,
        title: false,
      }}>
      <MainStack.Screen name="Splash" component={Splash} />
      <MainStack.Screen
        name="SurveyQue"
        component={SurveyQue}
        options={{
          headerShown: true,
          headerRight: () => <Image style={{ width: 50, height: 50 }} source={VKCLogo} />,
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
    </MainStack.Navigator>
  );
};

export default MainStackScreen;
