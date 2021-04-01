/* eslint-disable react-native/no-inline-styles */
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext,useState,useEffect } from 'react';
import { Image,View,Text } from 'react-native';
import { useTheme,useRoute,useFocusEffect } from '@react-navigation/native';
import Home from '@screens/Home';
import SurveyQue from '@screens/SurveyQue';
import AddRetailer from '@screens/AddRetailer';
import AddUnplannedVisits from '@screens/AddUnplannedVisits';
import UnplannedVisits from '@screens/UnplannedVisits';
import Login from '@screens/Login';
import { AuthContext } from 'src/context/authContext';
import {ScreenContext} from 'src/context/screenContext';
import VKCLogo from '../assets/Logo/VKC_Logo.jpg';
import BackgroundSync from '@components/BackgroundSync'

const MainStack = createStackNavigator();

const MainStackScreen = () => {
  const { token } = useContext(AuthContext);
  const { colors } = useTheme();
  const [syncData,setSyncData] = useState(false);
  const [isDeepLink,setIsDeepLink] = useState(false);
  const [hasDeepLinkDone,setHasDeepLinkDone] = useState(false);
  

  const ResetSyncData = () =>{
    setSyncData(false);
  } 

  return (
    <ScreenContext.Provider value={{syncData,setSyncData,isDeepLink,setIsDeepLink,hasDeepLinkDone,setHasDeepLinkDone}}>
      <View style={{width:'100%',flex:1}}>
        {syncData ? <BackgroundSync Reset={ResetSyncData} /> : null}
        {isDeepLink ?
          <View style={{width:'100%',height:35,alignItems: 'center',justifyContent: 'center',backgroundColor:'#1890ff'}}>
              <Text style={{color:'white'}}>Redirecting To Survey After Sync ...</Text>
          </View> 
        :null}
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
                name="AddUnplannedVisits"
                component={AddUnplannedVisits}
                options={{ headerShown: true, title: 'Add Unplanned Visit', headerTitleAlign: 'center' }}
              />
              <MainStack.Screen
                name="UnplannedVisits"
                component={UnplannedVisits}
                options={{ headerShown: true, title: 'Unplanned Visit', headerTitleAlign: 'center' }}
              />
            </>
          ) : (
            <MainStack.Screen name="Login" component={Login} />
          )}
        </MainStack.Navigator>
        </View>
    </ScreenContext.Provider>
  );
};

export default MainStackScreen;
