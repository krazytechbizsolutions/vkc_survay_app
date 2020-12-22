import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const Company = [
  {
    id: 1,
    CoName: 'Woodland',
  },
  {
    id: 2,
    CoName: 'Nike',
  },
  {
    id: 3,
    CoName: 'Adidas',
  },
];

const Planned = ({ OnStartPress }) => (
  <View>
    {Company.map(item => (
      <>
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text>{item.CoName}</Text>
          <RectButton
            style={{ borderColor: 'black', borderWidth: 1, alignItems: 'center' }}
            title="start"
            onPress={OnStartPress}>
            <Text>Start</Text>
          </RectButton>
        </View>
      </>
    ))}
    <View style={{ marginTop: 40, alignItems: 'center' }}>
      <Text>Completed</Text>
    </View>
  </View>
);

Planned.propTypes = {
  OnStartPress: PropTypes.func.isRequired,
};

export default Planned;
