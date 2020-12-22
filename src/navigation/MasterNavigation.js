/* eslint-disable react-native/no-inline-styles */
import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Splash from '../screens/Splash';
import SurveyQue from '../screens/SurveyQue';

const MainStack = createStackNavigator();

const MainStackScreen = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.primary,
        title: false,
      }}>
      <MainStack.Screen name="Splash" component={Splash} />
      <MainStack.Screen name="SurveyQue" component={SurveyQue} />
    </MainStack.Navigator>
  );
};

export default MainStackScreen;
