import React from 'react';
import { SafeAreaView } from 'react-native';
import TextEle from '../../components/TextEle';
import Fab from '../../components/Fab';
import SearchItem from '../../components/searchItem/SearchItem';

const Splash = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <TextEle>Splash Screen here</TextEle>
    <SearchItem />
    <Fab />
  </SafeAreaView>
);

export default Splash;
