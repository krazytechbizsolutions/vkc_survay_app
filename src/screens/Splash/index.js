import React from 'react';
import { SafeAreaView } from 'react-native';
import TextEle from '../../components/TextEle';
import Fab from '../../components/Fab';

const Splash = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <TextEle>Splash Screen here</TextEle>
    <Fab />
  </SafeAreaView>
);

export default Splash;
