/* eslint-disable react-native/no-inline-styles */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import Splash from '@screens/Splash';
import SurveyQue from '@screens/SurveyQue';
import AddRetailer from '@screens/AddRetailer';
import UnplannedVisits from '@screens/UnplannedVisits';

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
      <MainStack.Screen name="SurveyQue" component={SurveyQue} />
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
