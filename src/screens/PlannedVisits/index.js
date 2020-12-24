/* eslint-disable */
import React from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const addressString = data => `${data.street1} 
${data.street2} 
${data.Landmark} 
${data.PinCode}`;

const PlannedVisits = ({ navigation }) => {
  const { data: plannedVisits, isValidating } = useSWR('/plannedVisits');

  const displayRecords = arr => (
    <>
      {arr.map(item => (
        <>
          <View
            key={item.id}
            style={{
              marginVertical: 10,
              marginHorizontal: 20,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text>{item.companyName}</Text>
            <RectButton
              rippleColor="#D3D3D3"
              style={{
                height: 30,
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: 'rgb(15, 212, 28)',
              }}
              title="start"
              onPress={() =>
                navigation.navigate('SurveyQue', {
                  questionId: 1,
                })
              }>
              <Text style={{ marginHorizontal: 30 }}>Start</Text>
            </RectButton>
          </View>
          <Text style={{ marginHorizontal: 20, opacity: 0.4 }}>{addressString(item.Address)}</Text>
        </>
      ))}
    </>
  );

  if (isValidating) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 40 }}>
        {displayRecords(plannedVisits?.filter(x => !x.isCompleted) || [])}
        <Text style={{ textAlign: 'center' }}>Completed</Text>
        {displayRecords(plannedVisits?.filter(x => x.isCompleted) || [])}
      </View>
    </View>
  );
};

PlannedVisits.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlannedVisits;
