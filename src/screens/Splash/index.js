import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import TextEle from '../../components/TextEle';
import Fab from '../../components/Fab';
import SearchItem from '../../components/searchItem/SearchItem';
import Planned from '../../components/Planned';

const Splash = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <TextEle>Splash Screen here</TextEle>
    <SearchItem />
    <Planned
      OnStartPress={() => {
        navigation.navigate('SurveyQue');
      }}
    />
    <Fab onClick={path => navigation.navigate(path)} />
  </SafeAreaView>
);

Splash.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default Splash;
