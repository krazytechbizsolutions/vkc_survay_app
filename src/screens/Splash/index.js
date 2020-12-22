import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import TextEle from '../../components/TextEle';
import Fab from '../../components/Fab';
import SearchItem from '../../components/searchItem/SearchItem';

const Splash = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <TextEle>Splash Screen here</TextEle>
    <SearchItem />
    <Fab onClick={path => navigation.navigate(path)} />
  </SafeAreaView>
);
Splash.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default Splash;
