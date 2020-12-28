/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

const addressString = data => `${data.Landmark}`;

const PlannedVisits = ({ navigation }) => {
  const { data: plannedVisits, isValidating } = useSWR('/plannedVisits');

  const displayRecords = arr => (
    <View>
      {arr.map(item => (
        <>
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 20,
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderColor: 'green',
              borderWidth: 1,
              borderRadius: 20,
            }}>
            <RectButton
              rippleColor="#D3D3D3"
              style={{
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: 10,
                marginVertical: 10,
              }}
              title="start"
              onPress={() =>
                navigation.navigate('SurveyQue', {
                  questionId: 1,
                })
              }>
              <Text>Retailer Name :{item.companyName}</Text>
              <Text style={{ opacity: 0.4 }}>Beat Name : {addressString(item.Address)}</Text>
              <Text style={{ opacity: 0.4 }}>Status : {item.status}</Text>
            </RectButton>
          </View>
        </>
      ))}
    </View>
  );

  if (isValidating) {
    return <Text>Loading...</Text>;
  }
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
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
