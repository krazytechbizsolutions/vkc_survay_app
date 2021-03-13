import { useFocusEffect } from '@react-navigation/core';
import React,{useState,useCallback} from 'react'
import {View,Text,TouchableOpacity,FlatList,RefreshControl} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import VKCButton from '@components/VKCButton';
import { format } from 'date-fns';
import TextEle from '@components/TextEle';

const ShowUnplanned =({navigation})=>{
    const [visits,setVisits] = useState({});
    const [unplannedVisits,setUnplannedVisits] = useState([]);
    const [refreshing,setRefreshing] = useState(false);
    const [surveys,setSurvey] =useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          const loadUnplannedVisists = async () => {
                let getUnplannedVisitsFromStorage =await AsyncStorage.getItem('UnplannedVisits');
                let getVisits = await AsyncStorage.getItem('Visits')
                if(getUnplannedVisitsFromStorage && getVisits)
                {
                    console.log("19",getUnplannedVisitsFromStorage)
                    setUnplannedVisits(JSON.parse(getUnplannedVisitsFromStorage));
                    setVisits(JSON.parse(getVisits));
                }
          };
          loadUnplannedVisists();
          loadSurvey();
          
        }, []),
      );

      const onRefreshVisits =()=>{
        setRefreshing(true)
      }

      const loadSurvey = async() => {
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
        
    return(
        
        <View style={{ flex: 1 }}>
            {Object.keys(visits).length !== 0 ? 
              <FlatList
                data={unplannedVisits}
                refreshControl={
                <RefreshControl 
                onRefresh = {()=> onRefreshVisits()}
                refreshing={refreshing}/>
                }
                renderItem={({ item }) => (
                item.dateAdded === format(new Date(), 'yyyy-MM-dd') ? 
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
                    {
                        surveys.map((x,i)=>{
                            // console.log("76",x.applicableTo);
                            return(
                                x.applicableTo && x.applicableTo.includes(item.accType) ?
                                    <VKCButton
                                        variant="fill"
                                        style={{ marginVertical: 5 }}
                                        text={x.surveyName}
                                        onPress={async () => {
                                        navigation.navigate('SurveyQue', {
                                            questions: x.Questions,
                                            firstQuestion: true,
                                            accId: item.accId,
                                            accName: item.accName,
                                            surveyId: x.surveyId,
                                            UserId: visits.UserId,  //Change this Back
                                            Unplanned : true
                                        });
                                        }}
                                    />
                                : null
                            )
                        })
                    }
                
                    {/* {item.surveys.map((x, i) => {
                    
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
                            });
                            }}
                        />
                        );
                    }
                    })} */}
                </View>:null
                )}
                keyExtractor={item => `${item.accId}`}
            />:
            <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
                <TextEle>Visit Data Not Yet Loaded</TextEle>
            </View>}
        </View>
    )

}


export default ShowUnplanned