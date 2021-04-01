/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback, useEffect, useState, useContext } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { Linking,View, Text, FlatList,Modal, RefreshControl, ActivityIndicator } from 'react-native';
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
  let today = format(new Date(), 'yyyy-MM-dd');

  const [visits, setVisits] =useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [surveys, setSurvey] = useState(null);
  const [unSyncSurveys, setUnSyncSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { syncData, setSyncData,isDeepLink,setIsDeepLink,hasDeepLinkDone,setHasDeepLinkDone} = useContext(ScreenContext);

  useFocusEffect(
    React.useCallback(() => {
      const loadUnSyncSurvey = async () => {
        let initialUrl = await Linking.getInitialURL();
        
        getVisitData();
        getUnsyncSurveys();
        if(initialUrl)
        {
          if(!hasDeepLinkDone)
          {
            setIsDeepLink(true)
            initialUrl = initialUrl.split('?').pop();
            let accId = initialUrl.split('&')[0].split('=')[1];
            let survId = initialUrl.split('&')[1].split('=')[1];
            let surveyMaster = await getArrayDataFromStorage('SurveyMaster')
            let surveyVisits = await getArrayDataFromStorage('Visits')
            let offlineSrvDetails = unSyncSurveys?.find((z) => {
              return z.userId === surveyVisits.UserId && z.accountId === accId && z.temp_account_id === null 
                  && z.surveyId === survId && z.surveyDate === today && z.isUnplanned === false
            })
            let surveyItem = surveyVisits.visits?.find((z)=>{
              return z.accId === accId
            })
            
            if((surveyMaster && surveyMaster.data.length > 0) &&
                (surveyVisits) &&
                (surveyItem && Object.keys(surveyItem).length > 0))
            {
              surveyMaster = surveyMaster.data.find(y => y.surveyId === survId)
              setIsDeepLink(false)
              setHasDeepLinkDone(true)
              navigation.navigate('SurveyQue', {
                questions: surveyMaster.Questions,
                firstQuestion: true,
                accId: accId,
                accName: "",
                surveyId: survId,
                UserId: surveyVisits.UserId, 
                surveyObj:surveyItem === undefined ? {} : surveyItem, //Change this Back
                Unplanned : false,
                temp_account_id : null,
                survey: offlineSrvDetails
              });
            }  
          }
        }
      };
      loadUnSyncSurvey();
    }, [syncData]),
  );


  const onRefreshVisits =()=>{
    if(!syncData) {
      setRefreshing(true)
      setSyncData(true);
      getVisitData();
    }
  }

  getArrayDataFromStorage = async (key) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : []
    } catch(e){
      storageData = [];
    }
    return storageData;
  }

  const getVisitData = async() => {
    setIsLoading(true);
    
    setVisits(await getArrayDataFromStorage('Visits'));
    setSurvey(await getArrayDataFromStorage('SurveyMaster'));
    
    setRefreshing(false)
    setIsLoading(false)
  };

  const getUnsyncSurveys = async() => { 
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

  const listFooter = () => {
    if(Object.keys(visits?.visits || []).length !== 0) return null;

    return (
      <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
        <TextEle style={{opacity:0.7,fontSize:20,marginTop:50}}>No planned visits</TextEle>
      </View>
    )
  };


  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
     
      {
        isLoading ? 
        
          <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="large" color="#EF4B4A"/>
            <TextEle style={{opacity:0.7,fontSize:20,marginTop:50}}>Fetching Planned Visits ...</TextEle>
          </View>
        
        :
          <FlatList
            data={visits?.visits || []}
            refreshControl={
              <RefreshControl 
              onRefresh = {()=> onRefreshVisits()}
              refreshing={refreshing}/>
            }
            ListFooterComponent={listFooter}
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
                  // console.log("153",JSON.stringify(srvDetails))
                  // const srvDetails = schema.find(y => y.surveyId === x.svyId);
                  if (srvDetails) {
                    let temp_account_id = item.temp_account_id ? item.temp_account_id : null;
                    
                    let offlineSrvDetails = unSyncSurveys?.find((z) => {
                      return z.userId === visits.UserId && z.accountId === item.accId && z.temp_account_id === temp_account_id 
                        && z.surveyId === srvDetails.surveyId && z.surveyDate === today && z.isUnplanned === false
                    })
                    return (
                      // offlineSrvDetails?.syncStatus == 2 ? null : 
                      offlineSrvDetails?.isCompleted ? null :
                      <VKCButton
                        variant="fill"
                        style={{ marginVertical: 5 }}
                        text={srvDetails.surveyName}
                        disable={offlineSrvDetails?.isCompleted}
                        onPress={async () => {
                          navigation.navigate('SurveyQue', {
                            questions: srvDetails.Questions,
                            firstQuestion: true,
                            accId: item.accId,
                            accName: item.accName,
                            surveyId: srvDetails.surveyId,
                            UserId: visits.UserId, 
                            surveyObj:item, //Change this Back
                            Unplanned : false,
                            temp_account_id : item.hasOwnProperty('temp_account_id') ? item.temp_account_id : null,
                            survey: offlineSrvDetails
                            
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