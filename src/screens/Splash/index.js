import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Fab from '../../components/Fab';
import SearchItem from '../../components/searchItem/SearchItem';
import PlannedVisits from '../PlannedVisits';
import UnplannedVisits from '../UnplannedVisits';

const Tab = createMaterialTopTabNavigator();

const Splash = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <SearchItem />
    <Tab.Navigator>
      <Tab.Screen name="Planned Visit" component={PlannedVisits} />
      <Tab.Screen name="Unplanned Visit" component={UnplannedVisits} />
    </Tab.Navigator>
    <Fab onClick={path => navigation.navigate(path)} />
  </SafeAreaView>
);

Splash.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default Splash;
