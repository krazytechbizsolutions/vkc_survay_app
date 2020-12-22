import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const Company = [
  {
    id: 1,
    CoName: 'Woodland',
    Address: {
      street1: 'Arjun Greens',
      street2: 'Nilkanth mahadev ',
      Landmark: 'Naranpura',
      PinCode: '380013',
      City: 'Ahmedabad',
    },
  },
  {
    id: 2,
    CoName: 'Nike',
    Address: {
      street1: 'Arjun Greens',
      street2: 'Nilkanth mahadev ',
      Landmark: 'Naranpura',
      PinCode: '380013',
      City: 'Ahmedabad',
    },
  },
  {
    id: 3,
    CoName: 'Adidas',
    Address: {
      street1: 'Arjun Greens',
      street2: 'Nilkanth mahadev ',
      Landmark: 'Naranpura',
      PinCode: '380013',
      City: 'Ahmedabad',
    },
  },
];

const addressString = data => `${data.street1} 
${data.street2} 
${data.Landmark} 
${data.PinCode}`;

const Planned = ({ OnStartPress }) => (
  <View>
    {Company.map(item => (
      <>
        <View
          key={item.id}
          style={{
            marginVertical: 10,
            marginHorizontal: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text>{item.CoName}</Text>
          <RectButton
            rippleColor="#D3D3D3"
            style={{
              borderWidth: 2,
              height: 30,
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: 'rgb(15, 212, 28)',
            }}
            title="start"
            onPress={OnStartPress}>
            <Text style={{ marginHorizontal: 30 }}>Start</Text>
          </RectButton>
        </View>
        <Text style={{ marginHorizontal: 20, opacity: 0.4 }}>{addressString(item.Address)}</Text>
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
