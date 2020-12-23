import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const ModalStack = createStackNavigator();

const ModalStackScreen = () => (
  <ModalStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  />
);

export default ModalStackScreen;
