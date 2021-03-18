/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback, useEffect, useState, useContext } from 'react';
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
import { ScreenContext } from 'src/context/screenContext';

const PlannedVisits = ({ navigation }) => {
  const [visits, setVisits] =useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [surveys, setSurvey] = useState(null);
  const [unSyncSurveys, setUnSyncSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setSyncData } = useContext(ScreenContext);

  useFocusEffect(
    React.useCallback(() => {
      const loadUnSyncSurvey = async () => {
        getVisitData();
        syncData();
      };
      loadUnSyncSurvey();
    }, []),
  );


  const onRefreshVisits =()=>{
    setRefreshing(true)
    setSyncData(true);
    getVisitData();
  }

  getObjectDataFromStorage = async (key) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : null
    } catch(e){
      storageData = null;
    }
    return storageData;
  }

  const getVisitData = async() => {
    setIsLoading(true);
    
    setVisits(await getObjectDataFromStorage('Visits'));
    setSurvey(await getObjectDataFromStorage('SurveyMaster'));
    
    setRefreshing(false)
    setIsLoading(false)
  };

  const syncData = async() => { 
    const data = await getArrayFromStorage('unSyncedQuestions');
    setUnSyncSurveys(data.filter((res) => res.surveyDate === format(new Date(), 'yyyy-MM-dd')));
  }
  

  getArrayFromStorage = async (key) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : []
    } catch(e){
      storageData = [];
    }
    return storageData;
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
              
              const srvDetails = (surveys?.data || []).find(y => y.surveyId === x.svyId);
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