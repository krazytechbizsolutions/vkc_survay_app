import React,{ useState, useCallback, useContext } from 'react'
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import VKCButton from '@components/VKCButton';
import { format } from 'date-fns';
import TextEle from '@components/TextEle';
import {plannedVisists,schema} from '../../components/BackgroundSync/tempdata.js'
import { ScreenContext } from 'src/context/screenContext';

const UnplannedVisits =({navigation})=>{
    let today = format(new Date(), 'yyyy-MM-dd');

    const [visits, setVisits] = useState(null);
    const [unplannedVisits, setUnplannedVisits] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [surveys, setSurvey] =useState(null);
    const [unSyncSurveys, setUnSyncSurveys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { syncData, setSyncData } = useContext(ScreenContext);

    useFocusEffect(
      React.useCallback(() => {
        const loadUnSyncSurvey = async () => {
          getUnplannedData();
        };
        loadUnSyncSurvey();
      }, [syncData]),
    );

    const getUnplannedData = async () => {
      setIsLoading(true);

      let unplannedVisitsData = await getArrayFromStorage('UnplannedVisits');
      unplannedVisitsData = unplannedVisitsData.filter((item) => item.dateAdded === format(new Date(), 'yyyy-MM-dd'));
      setUnplannedVisits(unplannedVisitsData);
      setVisits(await getArrayDataFromStorage('Visits'));
      setSurvey(await getArrayDataFromStorage('SurveyMaster'));

      getUnsyncSurveys();

      setRefreshing(false);
      setIsLoading(false);
    };

    const getUnsyncSurveys = async() => { 
      const data = await getArrayFromStorage('unSyncedQuestions');
      setUnSyncSurveys(data.filter((res) => res.surveyDate === format(new Date(), 'yyyy-MM-dd')));
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

    const onRefreshVisits =()=>{
      if(!syncData){
        setRefreshing(true);
        setSyncData(true);
        getUnplannedData();
      }
    }

    const advancedFilter = (filterType,filterValues,item) =>{
      filterValues = filterValues.replace(";", "");
      let searchedFilterType,searchedFilterValue; 
      Object.keys(item).some((e,index) => {
          if(filterType.toLowerCase() === e.toLocaleLowerCase())
          {
              searchedFilterType = e;
              searchedFilterValue = item[e]
              return true       
          }
      })

      return filterValues === searchedFilterValue
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
      if(Object.keys(unplannedVisits || []).length !== 0) return null;

      return (
        <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
          <TextEle style={{opacity:0.7,fontSize:20,marginTop:50}}>No unplanned visits</TextEle>
        </View>
      )
    };
    
    const { colors } = useTheme();

    return(
        
        <View style={{ flex: 1, backgroundColor: colors.background }}>

          {
            isLoading ? 
            
            <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator size="large" color="#EF4B4A"/>
              <TextEle style={{opacity:0.7,fontSize:20,marginTop:10}}>Fetching Unplanned Visits ...</TextEle>
            </View>
            
            :

              <FlatList
                data={unplannedVisits}
                refreshControl={
                  <RefreshControl 
                  onRefresh = {()=> onRefreshVisits()}
                  refreshing={refreshing}/>
                }
                ListFooterComponent={listFooter}
                renderItem={({ item }) => { 
                  let areaName = item.AreaName ? `Area Name: ${item.AreaName}` : '';
                  return(                 
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
                        { areaName ? <Text style={{ paddingVertical: 4 }}>{areaName}</Text> : null }
                        <Text style={{ paddingVertical: 4 }}>{`Account Type: ${item.accType}`}</Text>
                        {
                            surveys?.data.map((x,i)=>{
                                let temp_account_id = item.temp_account_id ? item.temp_account_id : null;
                                let accountId = item.isAddedRetailer ? item.accountId : item.accId;
                                let offlineSrvDetails = unSyncSurveys?.find((z) => {
                                  return z.userId === visits.UserId 
                                    && (!z.accountId || (z.accountId && z.accountId === accountId)) 
                                    && (!z.temp_account_id || (z.temp_account_id && z.temp_account_id === temp_account_id)) 
                                    && z.surveyId === x.surveyId && z.surveyDate === today && z.isUnplanned === true
                                })

                                return(
                                    x.applicableTo && x.applicableTo.includes(item.accType) && advancedFilter(x.filterType,x.filterValues,item) ?
                                      // offlineSrvDetails?.syncStatus == 2 ? null : 
                                      offlineSrvDetails?.isCompleted ? null :
                                        <VKCButton
                                            variant="fill"
                                            style={{ marginVertical: 5 }}
                                            text={x.surveyName}
                                            disable={offlineSrvDetails?.isCompleted}
                                            onPress={async () => {
                                            navigation.navigate('SurveyQue', {
                                                questions: x.Questions,
                                                firstQuestion: true,
                                                accId: accountId,
                                                accName: item.accName,
                                                surveyId: x.surveyId,
                                                UserId: visits?.UserId,  //Change this Back
                                                Unplanned : true,
                                                temp_account_id : temp_account_id,
                                                survey: offlineSrvDetails
                                            });
                                            }}
                                        />
                                    : null
                                )
                            })
                        }
                    </View>
                )}}
                keyExtractor={(item,index) => `${index}`}
            />
          }
        </View>
    )

}


export default UnplannedVisits