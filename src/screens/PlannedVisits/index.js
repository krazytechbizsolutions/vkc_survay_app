/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import axios from '@utils/axios';
import NetInfo from '@react-native-community/netinfo';
import VKCButton from '@components/VKCButton';
import { getToken, storeData, getData } from '../../utils';

const PlannedVisits = ({ navigation }) => {
  const visitsEndpoint = '/services/apexrest/SRVY_DayPlanDataOffline_API';
  const surveyEndpoint = '/services/apexrest/SRVY_SurveyDataOffline_API';
  const getVisitData = useCallback(async () => {
    const token = await getToken();
    let userId = '';
    if (token && token.id) {
      const idSplit = token.id.split('/');
      userId = idSplit[idSplit.length - 1];
    }
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const res = await axios.post(visitsEndpoint, { UserId: userId, DateVal: '' });
      console.log(res.data);
      await storeData(visitsEndpoint, res.data);
      return res.data;
    }
    const data = await getData(visitsEndpoint);
    return data;
  }, []);

  const getSurveyData = useCallback(async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const res = await axios.post(surveyEndpoint);
      await storeData(surveyEndpoint, res.data);
      return res.data;
    }
    const data = await getData(surveyEndpoint);
    return data;
  }, []);

  const { data: plannedVisits, isValidating } = useSWR(visitsEndpoint, getVisitData);
  const { data: surveys, isValidating: isValidatingSurveys } = useSWR(
    surveyEndpoint,
    getSurveyData,
  );

  if (isValidating) {
    return (
      <Text
        style={{ paddingTop: 30, fontSize: 20, color: '#000', textAlign: 'center' }}
        textBreakStrategy="simple">
        {' '}
        Loading...{' '}
      </Text>
    );
  }
  if (plannedVisits?.visits.length == 0) {
    return (
      <Text
        style={{ paddingTop: 30, fontSize: 20, color: '#000', textAlign: 'center' }}
        textBreakStrategy="simple">
        No Planned Visits
      </Text>
    );
  }

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={plannedVisits?.visits || []}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#fff',
              margin: 10,
              padding: 10,
              shadowColor: '#000',
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,

              elevation: 4,
            }}>
            <Text style={{ paddingVertical: 4 }}>{`Account Name: ${item.accName}`}</Text>
            <Text style={{ paddingVertical: 4 }}>{`Area Name: ${item.AreaName}`}</Text>
            <Text style={{ paddingVertical: 4 }}>{`Account Type: ${item.accType}`}</Text>
            {item.surveys.map((x, i) => (
              <VKCButton
                variant="fill"
                style={{ marginVertical: 5 }}
                text={`Survey ${i + 1}`}
                onPress={async () => {
                  // surveys.find(y => y.surveyId === x.svyId).Questions
                  navigation.navigate('SurveyQue', {
                    questions: surveys[0].Questions,
                    firstQuestion: true,
                  });
                }}
              />
            ))}
          </View>
        )}
        keyExtractor={item => `${item.accId}`}
      />
    </View>
  );
};

PlannedVisits.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlannedVisits;
