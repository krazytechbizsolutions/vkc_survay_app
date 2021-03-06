import TextEle from '@components/TextEle';
import React from 'react'
import { View,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from '@utils/axios';
import RNFS from 'react-native-fs';
import { getToken } from '@utils/index';
import NetInfo from '@react-native-community/netinfo';

const visitsApi = '/services/apexrest/SRVY_DayPlanDataOffline_API';
const surveyApi = '/services/apexrest/SRVY_SurveyDataOffline_API';
const accountDataApi = '/services/apexrest/SRVY_AccDataOffline_API';
const captureSurveyApi = '/services/apexrest/SRVY_SvyCapture_API';
const captureImageApi = '/services/apexrest/SRVY_SvyCaptureImage_API';
const captureRetailerAPI = '/services/apexrest/SRVY_NewRetailer_API';
const today = format(new Date(), 'yyyy-MM-dd');


class BackgroundSync extends React.Component{
    
    constructor() {
        super();
        this.state={
            status: 0
        }
    }

    componentDidMount() {
        this.performSync();
    }

    moveToLogin = () => {
        this.props.ToLogin()
    }

    performSync = async () =>{

        const netInfo = await NetInfo.fetch();
        if (!netInfo.isInternetReachable) {
            // TODO: If no connectivity, then show no connection error...
            this.setStatusAndReset(4);
            return;
        }

        // download planned visits for the day...
        await this.downloadPlannedVisits();

        // download survey masters for the day...
        await this.downloadSurveyMasters();

        // download multi text account data for the day...
        await this.downloadMultiTextAccountData();

        // new retailer data push to server...
        await this.uploadUnsyncedRetailers();

        // sync surveys --> planned or existing retailer unplanned or new retailer unplanned...
        await this.uploadUnsyncedSurveys();

        // sync survey & retailer images -->  
        await this.uploadUnsyncedImages();

        this.setStatusAndReset(1);        
    }

    downloadPlannedVisits = async () => {
        // return if already synced for today...
        if(await this.isDataDownloadedForToday('Visits')){
            return;
        }
        
        const token = await getToken();
        try {
            const res = await axios.post(visitsApi, { UserId: token.id.split('/').pop(), DateVal: '' });
            if(res.data.status === 'Success') {
                let successResponse = res.data;
                
                // If visits data is available, then only insert into storage with today date...
                if(successResponse.visits && successResponse.visits.length > 0){
                    successResponse.syncedDate = format(new Date(), 'yyyy-MM-dd');
                    await AsyncStorage.setItem('DealerAndRetailers', JSON.stringify(successResponse.dealerAndRetailers))
                    delete successResponse.dealerAndRetailers;
                    await AsyncStorage.setItem('Visits', JSON.stringify(successResponse))
                }
            }
        } catch(e) { 
            if (e.response.status === 401){
                    this.moveToLogin()
            }
            console.log("From Rejection Of Promise",e)
        }  
    }

    downloadSurveyMasters = async () => {
        // return if already synced for today...
        if(await this.isDataDownloadedForToday('SurveyMaster')){
            return;
        }

        try{
            const res = await axios.post(surveyApi);
            await AsyncStorage.setItem('SurveyMaster', JSON.stringify({
                syncedDate: format(new Date(), 'yyyy-MM-dd'),
                data: res.data
            }));
        } catch(e) {
            if (e.response.status === 401){
                this.moveToLogin()
            }
         }
    }

    downloadMultiTextAccountData = async () => {
        // return if already synced for today...
        if(await this.isDataDownloadedForToday('AccountData')){
            return;
        }

        try{
            const res = await axios.get(accountDataApi, []);
            await AsyncStorage.setItem('AccountData', JSON.stringify({
                syncedDate: format(new Date(), 'yyyy-MM-dd'),
                data: res.data
            }));
        } catch(e) { 
            if (e.response.status === 401){
                this.moveToLogin()
            }
        }
    }

    isDataDownloadedForToday = async (key) => {
        let downloadData = await this.getObjectDataFromStorage(key);
        return (downloadData && downloadData.syncedDate === format(new Date(), 'yyyy-MM-dd'));
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

    uploadUnsyncedSurveys = async () => {
        let unSyncedQuestions = await this.getUnsyncedDataOfCurrentDayFromStorage('unSyncedQuestions');
        if(unSyncedQuestions.length > 0){
            try {
                let serveySyncRes = await axios.post(captureSurveyApi,unSyncedQuestions)
                await this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions', serveySyncRes.data.status === "Success");
            } catch (e) {
                if (e.response.status === 401)
                {
                    this.moveToLogin()
                }
                await this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions', false);
            }
        }
    }

    getUnsyncedDataOfCurrentDayFromStorage = async (key) => {
        let unSyncedData = await this.getArrayFromStorage(key);
        
        // clean up of past data...
        unSyncedData = unSyncedData.filter(ud => 
            {
                return ud.surveyDate === today;// && (!ud.syncStatus || ud.syncStatus == 1) 
            }
        )
        
        if(unSyncedData.length > 0){
            let unSyncedImages = await this.getArrayFromStorage('unSyncedImages');
            let unplannedVisitsForRetailerAccId = await this.getArrayFromStorage('UnplannedVisits');
            
            unSyncedData = unSyncedData.map((ud)=>{
                // check if the temp_account_id has account id...
                if(ud.temp_account_id){
                    unplannedVisitsForRetailerAccId.map((visits)=>{
                        if(visits.temp_account_id === ud.temp_account_id) {
                            ud.accountId = visits.accountId;
                        }
                    })
                }

                if(ud.accountId && ud.isCompleted && ud.syncStatus != 2){
                    ud.syncStatus = 1
                    // move the images from surveys to seperate unSyncedImages array...
                    ud.Questions.filter(usq => usq.sQuestion.qtnType === "Upload Image for choosing an Option").map(usq => {
                        usq.selectedOptions && usq.selectedOptions.map(usqmf => {
                            usqmf.accountId = ud.accountId;
                            // delete usqmf.temp_account_id;
                            unSyncedImages.push(usqmf);
                        })
                    })
                    ud.Questions = ud.Questions.filter(usq => usq.sQuestion.qtnType !== "Upload Image for choosing an Option");
                }
                return ud;
            })

            await AsyncStorage.setItem('unSyncedImages', JSON.stringify(unSyncedImages));
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        }
        return unSyncedData.filter(ud => ud.isCompleted && ud.syncStatus == 1);
    }

    removeUnSyncedStatusSuccessDataInStorage = async (key, isRemove) => {
        let unSyncedData = await this.getArrayFromStorage(key);
        if(isRemove){
            // get current day syncStatus = 0 & set it back to storage... this will force remove syncStatus = 1...
            // await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.filter(ud => (ud.surveyDate === today && ud.syncStatus === 0))));

            // COMMENTED ABOVE & ADDED BELOW TO AVOID THE RE-ENABLING THE SURVEY BUTTON AFTER SYNC AS PULL IS ONLY ONCE A DAY...
            unSyncedData = unSyncedData.map(ud => {
                if(ud.isCompleted && ud.syncStatus == 1){
                    ud.syncStatus = 2;
                    delete ud.Questions; // TODO: [LATER] RETAIN THIS TO SHOW SAVED DATA IN OFFLINE
                }
                return ud;
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        } else {
            unSyncedData = unSyncedData.map(ud => {
                if(ud.isCompleted && ud.syncStatus == 1) ud.syncStatus = 0;
                return ud;
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        }
    }

    uploadUnsyncedRetailers = async () =>{   
        let newRetailers = await this.getArrayFromStorage('newRetailers');
        if(newRetailers.length > 0) {
            try {
                let submitRetailersResponse = await axios.post(captureRetailerAPI, newRetailers)
                if(submitRetailersResponse.data.status === 'Success') {
                    let addedRetailers = submitRetailersResponse.data.successIds
                    addedRetailers = Object.fromEntries(addedRetailers.map((f) => [f.temp_account_id, f.Acc_SF_Id]))

                    const updateasfidFortaiInStorage = async (key, addedRetailers) => {
                        let storageData = await this.getArrayFromStorage(key);

                        storageData = storageData.map((visits)=>{
                            if(addedRetailers[visits.temp_account_id]) {
                                visits.accountId = addedRetailers[visits.temp_account_id];
                                // delete visits.temp_account_id;
                            }
                            return visits;
                        })
                        await AsyncStorage.setItem(key, JSON.stringify(storageData))
                    }

                    await updateasfidFortaiInStorage('UnplannedVisits', addedRetailers);
                    await updateasfidFortaiInStorage('unSyncedQuestions', addedRetailers);
                    await updateasfidFortaiInStorage('unSyncedImages', addedRetailers);
                    
                    // remove the ones which is saved...
                    await AsyncStorage.setItem('newRetailers', JSON.stringify(newRetailers.filter(nr => {
                        return !addedRetailers[nr.temp_account_id]
                    })))
                }
                else{
                    console.log(submitRetailersResponse.data.status)
                }

            } catch(e) { 
                if (e.response.status === 401){
                    this.moveToLogin()
                }
            }
        }
    }


    uploadUnsyncedImages = async () =>{
        let unSyncedImages = await this.getUnsyncedImageFromStorage('unSyncedImages')
        for(let i = 0; i < unSyncedImages.length; i++) {
            let data = unSyncedImages[i];
            data.imageBase64 = await RNFS.readFile(data.imageURL, 'base64')
            try
            {
                let imageResponse = await axios.post(captureImageApi, data)
                await this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'imageName', data.imageName, imageResponse.data.status === "Success");
            } catch(e) {
                if (e.response.status === 401){
                    this.moveToLogin()
                }
                await this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'imageName', data.imageName, false);
            }
        }
    }

    getUnsyncedImageFromStorage = async (key) => {
        let unSyncedData = await this.getArrayFromStorage(key);
        if(unSyncedData.length > 0){
            unSyncedData = unSyncedData.map((ud)=>{
                if(ud.accountId && ud.syncStatus != 1) {
                    ud.syncStatus = 1;
                }
                return ud;
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        }
        return unSyncedData.filter(ud => (
            (
                (ud.relatedTo === "Retailer" && ud.dateAdded === today) || 
                (ud.relatedTo === "Survey" && ud.surveyDate === today)
            ) && ud.accountId && ud.syncStatus == 1
        ));
    }

    updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage = async (key, eName, eValue, isRemove) => {
        let unSyncedData = await this.getArrayFromStorage(key);
        if(isRemove){
            // get where array[eName] !== eValue & set it back to storage... this will force remove array[eName] === eValue...
            unSyncedData = unSyncedData.filter(ud=>{
                return ud[eName] !== eValue
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        } else {
            unSyncedData = unSyncedData.forEach(ud => {
                if(ud[eName] === eValue) {
                    ud.syncStatus = 0;
                }
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        }
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

    setStatusAndReset = (status) => {
        this.setState({status},()=>{
            setTimeout(()=>{
                this.props.Reset();
            },3000)
        })
    }


    render()
    {
        return(
            this.state.status === 0 ? 
            <View style={{width:'100%',height:50,backgroundColor:'white',elevation:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
                <ActivityIndicator size="small" color="#0000ff" />
                <TextEle style={{fontSize:17,marginLeft:25,opacity:0.7}}>Syncying Data with the Server...</TextEle>
            </View>
            : 
            this.state.status === 1 ?
                <View style={{width:'100%',height:50,backgroundColor:'#2ab574',elevation:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
                    <Icon
                        name="md-checkmark-circle-sharp"
                        style={{ right: 0, top: 0 }}
                        size={24}
                        color="white"
                      />
                    <TextEle style={{fontSize:17,marginLeft:25,color:'white'}}>Data Successfully Synced.</TextEle>
                </View>:
            this.state.status === 2 ?
                <View style={{width:'100%',height:50,backgroundColor:'#f5bb18',elevation:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
                    <Icon
                        name="md-warning"
                        style={{ right: 0, top: 0 }}
                        size={24}
                        color="white"
                      />
                    <TextEle style={{fontSize:17,marginLeft:25,color:'white'}}>Data Partially Synced.</TextEle>
                    {/* <TouchableOpacity>
                        <View style={{width:100,height:35,borderWidth:1,borderColor:'#fff',marginLeft:15,borderRadius:5,alignItems:'center',justifyContent:'center'}}>
                            <TextEle style={{fontSize:15,color:'white'}}>View Details</TextEle>
                        </View>
                    </TouchableOpacity> */}
                </View>:
            this.state.status === 3 ?
                <View style={{width:'100%',height:50,backgroundColor:'#ed4356',elevation:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
                    <Icon
                        name="md-close"
                        style={{ right: 0, top: 0 }}
                        size={24}
                        color="white"
                      />
                    <TextEle style={{fontSize:17,marginLeft:25,color:'white'}}>Data Sync Failed.</TextEle>
                    {/* <TouchableOpacity>
                        <View style={{width:100,height:35,borderWidth:1,borderColor:'#fff',marginLeft:15,borderRadius:5,alignItems:'center',justifyContent:'center'}}>
                            <TextEle style={{fontSize:15,color:'white'}}>View Details</TextEle>
                        </View>
                    </TouchableOpacity> */}
                </View> :null   
        )
    }
}

export default BackgroundSync;