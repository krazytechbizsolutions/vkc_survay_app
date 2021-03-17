import TextEle from '@components/TextEle';
import React from 'react'
import { View,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from '@utils/axios';
import RNFS from 'react-native-fs';


const captureSurveyApi = '/services/apexrest/SRVY_SvyCapture_API';
const captureImageApi = '/services/apexrest/SRVY_SvyCaptureImage_API';
const captureRetailerAPI = '/services/apexrest/SRVY_NewRetailer_API';
const today = format(new Date(), 'yyyy-MM-dd');


class BackgroundSync extends React.Component{
    constructor()
    {
        super();
        this.state={
            status:0
        }
    }


    componentDidMount()
    {
        this.performSync();
        // AsyncStorage.removeItem('unSyncedQuestions');
    }

    getUnsyncedDataFromStorage = async (key) => {
        let unSyncedData = await AsyncStorage.getItem(key);
        // console.log("31 34",unSyncedData);
        if(!unSyncedData) return [];

        return JSON.parse(unSyncedData);
    } 

    getUnsyncedDataOfCurrentDayFromStorage = async (key) => {
        let unSyncedData = await this.getUnsyncedDataFromStorage(key);
        
        unSyncedData = unSyncedData.filter(ud => 
            {
                // console.log("36",ud.surveyDate,ud.syncStatus)
                return ud.surveyDate === today   // temp soln. will change later.....  
            }
        )
        // console.log("31 24",unSyncedData);
        if(unSyncedData.length > 0){
            unSyncedData.forEach((ud)=>{
                ud.syncStatus = 1
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        }
        return unSyncedData;
    }

    getUnsyncedImageFromStorage = async (key) => {
        let unSyncedData = await this.getUnsyncedDataFromStorage(key);
        if(unSyncedData.length > 0){
            unSyncedData.forEach((ud)=>{
                ud.syncStatus = 1
            })
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData));
        }
        console.log("31 24",unSyncedData);
        return unSyncedData;
    }

    performSync = async () =>{

        if(await this.uploadUnsyncedRetailers())
        {

            console.log("Successfully Uploaded Retailers")
            if(await this.uploadUnsyncedSurveys(await this.getUnsyncedDataOfCurrentDayFromStorage('unSyncedQuestions')))
            {
                console.log("Successfully Uploaded Surveys")
                let Images = await this.getUnsyncedImageFromStorage('unSyncedImages')
                if(Images.length > 0)
                {
                    console.log("In Image Upload")
                        if(await this.uploadUnsyncedImages(Images))
                        {
                            console.log("Successfull Image Uploads")
                            console.log("Successfully Uploaded Images");
                            this.setState({status:1},()=>{
                                setTimeout(()=>{
                                    this.props.Reset();
                                },3000)
                            })
                        }
                        else
                        {
                            console.log("Images Not Uploaded")
                            this.setState({status:2},()=>{
                                setTimeout(()=>{
                                    this.props.Reset();
                                },3000)
                            })
                        }
                }
                else
                {
                    console.log("No Images To Upload")
                    this.setState({status:1},()=>{
                        setTimeout(()=>{
                            this.props.Reset();
                        },3000)
                    })
                }
                
            }
            else
            {
                this.setState({status:3},()=>{
                    setTimeout(()=>{
                        this.props.Reset();
                    },3000)
                })
            }
        }
        else
        {
            this.setState({status:3},()=>{
                setTimeout(()=>{
                    this.props.Reset();
                },3000)
            })
        }  
    }


    removeUnSyncedStatusSuccessDataInStorage = async (key) => {
        let unSyncedData =await this.getUnsyncedDataFromStorage(key);
        if(unSyncedData && unSyncedData.length > 0){
            // get current day syncStatus = 0 & set it back to storage... this will force remove syncStatus = 1...
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.filter(ud => (ud.surveyDate === today && ud.syncStatus !== 1))));
        }
    }

    updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage = async (key, eName, eValue, isRemove) => {
        let unSyncedData = await this.getUnsyncedDataFromStorage(key);
        console.log("128",JSON.stringify(unSyncedData))
        if(isRemove){
            // get where array[eName] !== eValue & set it back to storage... this will force remove array[eName] === eValue...
           unSyncedData = unSyncedData.filter(ud=>{
                console.log("102",ud[eName],eValue)
                return ud[eName] !== eValue
            })
            console.log("105",unSyncedData);
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

    uploadUnsyncedSurveys=async (unSyncedQuestions)=>{
        
        if(unSyncedQuestions.length > 0){
            // console.log("Before Capture",JSON.stringify(unSyncedQuestions))
            try {
                let serveySyncRes = await axios.post(captureSurveyApi,unSyncedQuestions)
                if(serveySyncRes.data.status === "Success")
                {
                    await this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                    return true
                }
                await this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                return false;
            }
            catch (e)
            {
                console.log("Inside Catch",e)
                return false
            }
        }
        return true;
    }

    uploadUnsyncedRetailers = async () =>{

        let newRetailers = await AsyncStorage.getItem('newRetailers');
        if(newRetailers && newRetailers.length > 0)
        {
            newRetailers = JSON.parse(newRetailers);
            console.log("195",newRetailers)
            try
            {
                let submitRetailersResponse = await axios.post(captureRetailerAPI,newRetailers)
                if(submitRetailersResponse.data.status === 'Success')
                {
                    console.log("In Retailer Success")
                    await this.removeFromAddRetailer(submitRetailersResponse.data)
                    await this.editUnsyncedImages(submitRetailersResponse.data)
                    return true;
                }
                else
                {
                    console.log("In Retailer Fail",submitRetailersResponse.data)
                    return false;
                }
            }
            catch(e)
            {
                console.log("In Retailer Catch",e)
                return false
            }
        }
        else
        {
            return true;
        }
        //  AsyncStorage.setItem('newRetailers',JSON.stringify([]))       
    }


    removeFromAddRetailer = async (responseData) => {
        let addedRetailers = responseData.successIds;
        console.log("222",addedRetailers)
        await AsyncStorage.setItem('newRetailers',JSON.stringify([]));
        for(let i = 0 ; i < addedRetailers.length ; i++ )
        {
            let unplannedVisits = await AsyncStorage.getItem('UnplannedVisits');
            unplannedVisits = JSON.parse(unplannedVisits)
            unplannedVisits = unplannedVisits.map((visits)=>{
                console.log("229",visits.temp_account_id,addedRetailers[i].temp_account_id)
                if(visits.temp_account_id === addedRetailers[i].temp_account_id)
                {
                    visits.accId = addedRetailers[i].Acc_SF_Id
                    return visits;
                }
                else
                {
                    return visits;
                }
            })
            
            await AsyncStorage.setItem('UnplannedVisits',JSON.stringify(unplannedVisits))
        }
    } 

    editUnsyncedImages = async(responseData) => {
        let addedRetailers = responseData.successIds;
        for(let i = 0 ; i < addedRetailers.length ; i++ )
        {
            let unSyncedImages = await AsyncStorage.getItem('unSyncedImages');
            unSyncedImages = JSON.parse(unSyncedImages)
            unSyncedImages = unSyncedImages.map((visits)=>{
                console.log("229",visits.temp_account_id,addedRetailers[i].temp_account_id)
                if(visits.temp_account_id === addedRetailers[i].temp_account_id)
                {
                    visits.accId = addedRetailers[i].Acc_SF_Id
                    return visits;
                }
                else
                {
                    return visits;
                }
            })
            
            await AsyncStorage.setItem('unSyncedImages',JSON.stringify(unSyncedImages))
        }
    }

    uploadUnsyncedImages = async (unSyncedImages) =>{
        let imageUploadError = true
        if(unSyncedImages.length > 0) {
            for(let i = 0; i < unSyncedImages.length; i++) {
                let data = unSyncedImages[i];
                data.imageBase64 = await RNFS.readFile(data.imageURL, 'base64')
               
                try
                {
                    let ImageResponse = await axios.post(captureImageApi,data)
                    if(ImageResponse.data.status === "Success")
                    {
                        console.log("In Success")
                        imageUploadError=false;
                    //    await this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'fileName', data.imageName, true);
                    }
                    else
                    {
                        console.log("In Error")
                        imageUploadError=true;
                      //  await this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'fileName', data.fileName, false);
                    }
                }
                catch(e)
                {
                    console.log("In Catch",e)
                    imageUploadError=true;
                   // await this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'fileName', data.fileName, false);
                }
            }

            if(!imageUploadError)
            {
               return true ;
            }
            else
            {
              return false ;
            }
        } 
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
                    <TextEle style={{fontSize:17,marginLeft:25,color:'white'}}>Data Partly Synced.</TextEle>
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