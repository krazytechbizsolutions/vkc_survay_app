/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { View, Text, FlatList,Modal } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from '@utils/axios';
import VKCButton from '@components/VKCButton';
import { getToken, storeData, getData } from '../../utils';
import {SData} from './TempSurveyData';
import SubmitModal from '@components/SubmitModal'
import { format } from 'date-fns';

const PlannedVisits = ({ navigation }) => {
  const visitsEndpoint = '/services/apexrest/SRVY_DayPlanDataOffline_API';
  const surveyEndpoint = '/services/apexrest/SRVY_SurveyDataOffline_API';
  const accountData = '/services/apexrest/SRVY_AccDataOffline_API';

  const [ShowModal,setShowModal] = useState(false);
  
  const GetAccountData=()=>{
    axios.get(accountData, []).then(response =>{
    // console.log("23",response.data.length);
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
     // console.log("31",res.data)
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

  const NavigateToHome=()=>{
    navigation.popToTop();
  }

  
  const { data: plannedVisits, isValidating, mutate } = useSWR(visitsEndpoint, getVisitData);
  //("51",mutate)
  const { data: surveys, isValidating: isValidatingSurveys } = useSWR(
    surveyEndpoint,
    getSurveyData,
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadUnSyncSurvey = async () => {
        const data = await AsyncStorage.getItem('unSyncedQuestions');
        // console.log("78",data)
        // if (data) {
        //   setUnSyncSurveys(JSON.parse(data));
        // }
        // const keys = await AsyncStorage.getAllKeys()
        // await AsyncStorage.multiRemove(keys)
        // let key1 = await AsyncStorage.getAllKeys()
        // console.log('key1',key1);
      };
      // console.log("Focus")
      loadUnSyncSurvey();
      mutate();
    }, [mutate]),
  );

  const syncData = useCallback(async () => {
    
    const data = await AsyncStorage.getItem('unSyncedQuestions');
    // console.log("92",data)
    if (data) {
      const unSyncedQuestions = [];
    
      JSON.parse(data).forEach(res=>{
        if(res.surveyDate === format(new Date(), 'yyyy-MM-dd'))
        {
          unSyncedQuestions.push(res)
        }
      })
      
      console.log("108",JSON.stringify(unSyncedQuestions))
      if (unSyncedQuestions.length > 0) {
        setShowModal(true)
      }
    }
  }, []);

  useEffect(() => {
    // console.log("104",SData);
    // console.log("Effect")

    GetAccountData();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log("Synced")
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
              
              const srvDetails = (surveys || []).find(y => y.surveyId === x.svyId);
              // const srvDetails = SData.find(y => y.surveyId === x.svyId);
              if (srvDetails) {
                return (
                  <VKCButton
                    variant="fill"
                    style={{ marginVertical: 5 }}
                    text={srvDetails.surveyName}
                    disable={unSyncSurveys?.find(
                      z =>
                        z.userId === plannedVisits.UserId && //Change this Back
                        z.accountId === item.accId &&
                        z.surveyId === srvDetails.surveyId,   
                    )}
                    onPress={async () => {
                      navigation.navigate('SurveyQue', {
                        questions: srvDetails.Questions,
                        firstQuestion: true,
                        accId: item.accId,
                        accName: item.accName,
                        surveyId: srvDetails.surveyId,
                        UserId: plannedVisits.UserId,  //Change this Back
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={ShowModal}
        onRequestClose={() => {
        }}
      >
        <SubmitModal
          SurveyId = {""}
          AccId = {""}
          UserId = {""}
          BackToHome = {NavigateToHome}  />
      </Modal>           

    </View>
  );
};

PlannedVisits.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlannedVisits;