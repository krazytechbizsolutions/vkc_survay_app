import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SWRConfig } from 'swr';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from '@utils/axios';
import SplashScreen from 'react-native-splash-screen';
import MasterNavigation from './src/navigation/MasterNavigation';
// import ModalNavigation from './src/navigation/ModalNavigation';

const MyDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F6552E',
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#F6552E',
  },
};

const RootStack = createStackNavigator();

const App = () => {
  const scheme = useColorScheme();
  const currentTheme = scheme === 'dark' ? MyDarkTheme : MyDefaultTheme;

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={currentTheme.colors.card}
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <SWRConfig
        value={{
          fetcher: (url, params) => axios.request({ url, ...params }).then(res => res.data),
        }}>
        <NavigationContainer theme={currentTheme}>
          <RootStack.Navigator mode="modal" headerMode="none">
            <RootStack.Screen name="Main" component={MasterNavigation} />
            {/* <RootStack.Screen
            name="Modal"
            component={ModalNavigation}
            options={{
              headerShown: true,
              headerTransparent: 1,
              headerTintColor: currentTheme.colors.primary,
            }}
          /> */}
          </RootStack.Navigator>
        </NavigationContainer>
      </SWRConfig>
    </SafeAreaProvider>
  );
};

export default App;
