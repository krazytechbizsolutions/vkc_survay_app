/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Fab from '../../components/Fab';
import SearchItem from '../../components/searchItem/SearchItem';
import PlannedVisits from '../PlannedVisits';
import UnplannedVisits from '../UnplannedVisits';
import VKCLogo from '../../assets/Logo/VKC_Logo.jpg';

const Tab = createMaterialTopTabNavigator();
const date = new Date().getDate();
const month = new Date().getMonth();
const year = new Date().getFullYear();

const Splash = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      <Image style={{ width: 40, height: 40, marginHorizontal: 15 }} source={VKCLogo} />
      <View style={{ flex: 1, marginRight: 10 }}>
        <SearchItem />
      </View>
    </View>
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Text>
        Date :- {date}/{month}/{year}
      </Text>
    </View>
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
