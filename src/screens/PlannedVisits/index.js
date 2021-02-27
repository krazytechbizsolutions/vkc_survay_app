/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from '@utils/axios';
import VKCButton from '@components/VKCButton';
import { getToken, storeData, getData } from '../../utils';
import {SData} from './TempSurveyData';



const PlannedVisits = ({ navigation }) => {
  const visitsEndpoint = '/services/apexrest/SRVY_DayPlanDataOffline_API';
  const surveyEndpoint = '/services/apexrest/SRVY_SurveyDataOffline_API';
  const accountData = '/services/apexrest/SRVY_AccDataOffline_API';

  const GetAccountData=()=>{
    axios.get(accountData, []).then(response =>{
      console.log("23",response.data.length);
      AsyncStorage.setItem("AccountData",JSON.stringify(response.data));
    })
  }

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
      await storeData(visitsEndpoint, res.data);
      console.log("31",res.data)
      return res.data;
    }
    const data = await getData(visitsEndpoint);
    return data;
  }, []);
  const [unSyncSurveys, setUnSyncSurveys] = useState([]);

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

  
  const { data: plannedVisits, isValidating, mutate } = useSWR(visitsEndpoint, getVisitData);
  console.log("51",mutate)
  const { data: surveys, isValidating: isValidatingSurveys } = useSWR(
    surveyEndpoint,
    getSurveyData,
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadUnSyncSurvey = async () => {
        const data = await AsyncStorage.getItem('unSyncedQuestions');
        if (data) {
          setUnSyncSurveys(JSON.parse(data));
        }
      };
      loadUnSyncSurvey();
      mutate();
    }, [mutate]),
  );

  const syncData = useCallback(async () => {
    const data = await AsyncStorage.getItem('unSyncedQuestions');
    if (data) {
      const unSyncedQuestions = JSON.parse(data);
      if (unSyncedQuestions.length > 0) {
        const unSyncData = [];
        const url = '/services/apexrest/SRVY_SvyCapture_API';
        for (let i = 0; i < unSyncedQuestions.length; i++) {
          try {
            await axios.post(url, unSyncedQuestions[i]);
          } catch (error) {
            unSyncData.push(unSyncedQuestions[i]);
            continue;
          }
        }
        const data = await AsyncStorage.setItem('unSyncedQuestions', JSON.stringify(unSyncData));
        mutate();
      }
    }
  }, []);

  useEffect(() => {
    console.log("104",SData);
    GetAccountData();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncData();
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const { colors } = useTheme();

  if (isValidating) {
    return (
      <Text
        style={{ paddingTop: 30, fontSize: 20, color: '#000', textAlign: 'center' }}
        textBreakStrategy="simple">
        Loading...
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
            {item.surveys.map((x, i) => {
              
              // const srvDetails = surveys.find(y => y.surveyId === x.svyId);
              const srvDetails = SData.find(y => y.surveyId === x.svyId);
              if (srvDetails) {
                return (
                  <VKCButton
                    variant="fill"
                    style={{ marginVertical: 5 }}
                    text={srvDetails.surveyName}
                    disable={unSyncSurveys?.find(
                      z =>
                        z.userId === plannedVisits.UserId &&
                        z.accountId === item.accId &&
                        z.surveyId === srvDetails.surveyId,
                    )}
                    onPress={async () => {
                      navigation.navigate('SurveyQue', {
                        questions: srvDetails.Questions,
                        firstQuestion: true,
                        accId: item.accId,
                        surveyId: srvDetails.surveyId,
                        UserId: plannedVisits.UserId,
                      });
                    }}
                  />
                );
              }
            })}
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