/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { View, Text, FlatList,Modal, RefreshControl,ActivityIndicator } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from '@utils/axios';
import VKCButton from '@components/VKCButton';
import { getToken, storeData, getData } from '../../utils';
import {SData} from './TempSurveyData';
import SubmitModal from '@components/SubmitModal'
import { format } from 'date-fns';
import {plannedVisists,schema} from '../../components/BackgroundSync/tempdata.js'
import TextEle from '@components/TextEle';
// console.log("20",plannedVisists)

const PlannedVisits = ({ navigation }) => {
  const visitsEndpoint = '/services/apexrest/SRVY_DayPlanDataOffline_API';
  const surveyEndpoint = '/services/apexrest/SRVY_SurveyDataOffline_API';
  const accountData = '/services/apexrest/SRVY_AccDataOffline_API';

  const [visits,setVisits] =useState({});
  const [refreshing,setRefreshing] = useState(false);
  const [surveys,setSurvey] =useState([]);
  const [unSyncSurveys, setUnSyncSurveys] = useState([]);
  const [isLoading,setIsLoading] = useState(false);


  const GetAccountData=()=>{
    axios.get(accountData, []).then(response =>{
    console.log("Got The Response For Account");
      AsyncStorage.setItem("AccountData",JSON.stringify(response.data));
    }).catch(e=>{
      console.log("Account Data Error",e)
    })
  }

  const onRefreshVisits =()=>{
    setRefreshing(true)
    getVisitData();
  }

  const getVisitData = async() => {
  
    setIsLoading(true);
    const token = await getToken();
    let userId = '';
    if (token && token.id) {
      const idSplit = token.id.split('/');
      userId = idSplit[idSplit.length - 1];
    }
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      try 
      {
        const res = await axios.post(visitsEndpoint, { UserId: userId, DateVal: '' });
        if(res.data.status === 'Success')
        {
          console.log("Got the Visits")
          await storeData(visitsEndpoint, res.data);
          await AsyncStorage.setItem('Visits',JSON.stringify(res.data))
          setVisits(res.data) 
        }
        else
        {
          setVisits({});
        }
      }
      catch(e)
      {
        setIsLoading(false);
        setRefreshing(false);
        console.log(e);
      }
    }
    else
    {
      let locallyStoredVisits = await AsyncStorage.getItem('Visits');
      if(locallyStoredVisits)
      {
        locallyStoredVisits = JSON.parse(locallyStoredVisits);
        setVisits(locallyStoredVisits);
      }
      else
      {
        setVisits({})
      }
    }
    setRefreshing(false)
    setIsLoading(false)
  };

  
  const getSurveyData = async () => {
    console.log("Getting Surveys")
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      try{
        const res = await axios.post(surveyEndpoint);
        console.log("Got The Surveys Master");
        await AsyncStorage.setItem('SurveyMaster',JSON.stringify(res.data));
        setSurvey([...res.data])
      }
      catch(e)
      {
        console.log(e)
      }
    }
    else
    {
      let locallyStoredSurvey = await AsyncStorage.getItem('SurveyMaster');
      if(locallyStoredSurvey)
      {
        
        locallyStoredSurvey = JSON.parse(locallyStoredSurvey);
        setSurvey(locallyStoredSurvey);
      }
      else
      {
        setSurvey([])
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadUnSyncSurvey = async () => {
        GetAccountData();
        getVisitData();
        syncData();
        getSurveyData();
      };
      loadUnSyncSurvey();
    }, []),
  );

  const syncData = async() => { 
    const data = await AsyncStorage.getItem('unSyncedQuestions');
    if (data) {
      const unSyncedQuestions = JSON.parse(data).filter((res) => res.surveyDate === format(new Date(), 'yyyy-MM-dd'))      
      console.log("108",JSON.stringify(unSyncedQuestions))
      setUnSyncSurveys(unSyncedQuestions);
    }
  }

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {
        isLoading ? 
        
        <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="#EF4B4A"/>
          <TextEle style={{opacity:0.7,fontSize:20,marginTop:10}}>Fetching Planned Visits ...</TextEle>
        </View>
        
        :

      <FlatList
        data={visits?.visits || []}
        refreshControl={
          <RefreshControl 
          onRefresh = {()=> onRefreshVisits()}
          refreshing={refreshing}/>
        }
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
              // const srvDetails = schema.find(y => y.surveyId === x.svyId);
              if (srvDetails) {
                return (
                  <VKCButton
                    variant="fill"
                    style={{ marginVertical: 5 }}
                    text={srvDetails.surveyName}
                    disable={unSyncSurveys?.find(
                      z =>
                        z.userId === visits.UserId && //Change this Back
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
                        UserId: visits.UserId,  //Change this Back
                        Unplanned : false,
                        temp_account_id : item.hasOwnProperty('temp_account_id') ? item.temp_account_id : null
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
    }
  </View>
  );
};

PlannedVisits.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlannedVisits;