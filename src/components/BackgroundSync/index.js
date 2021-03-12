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
        // sync the planned visit survey...
        this.uploadUnsyncedSurveys(await this.getUnsyncedDataOfCurrentDayFromStorage('unSyncedQuestions'));

        // sync the planned visit survey images...
        

        // TODO: sync the existing retailer unplanned visit survey...
        // TODO: sync the existing retailer unplanned visit survey images...

        // TODO: sync the new retailers...
        // TODO: sync the new retailer unplanned visit survey...
        // TODO: sync the new retailer unplanned visit survey images...
        
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
        console.log("Upload Function",unSyncedQuestions)
        if(unSyncedQuestions.length > 0){
            console.log("Before Capture",JSON.stringify(unSyncedQuestions))
            axios.post(captureSurveyApi,unSyncedQuestions).then(res=>{
                if(res.data.status === "Success") {
                    // removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                    this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                    this.setState({status:1},()=>{
                        setTimeout(()=>{
                            this.props.Reset();
                        },3000)
                    })
                } else {
                    console.log("Not Returned Success",res.data)
                    this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                    this.setState({status:3},()=>{
                        setTimeout(()=>{
                            this.props.Reset();
                        },3000)
                    })
                }
            }).catch(e=>{
                console.log("Inside Catch",e)
                // updateFailedDataBackToUnSyncedStatusInStorage('unSyncedQuestions');
                this.removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                this.setState({status:3},()=>{
                    setTimeout(()=>{
                        this.props.Reset();
                    },3000)
                })

                // this.getUnsyncedImageFromStorage('unSyncedImages').then(res => {
                //     console.log("Images",res);
                //     if(res.length > 0)
                //     {
                //         this.uploadUnsyncedImages(res);
                //     }
                //     else
                //     {
                //         this.setState({status:1},()=>{
                //             setTimeout(()=>{
                //                 this.props.Reset();
                //             },3000)
                //         })
                //     } 
                // })

                 //change this later
                // TODO: Specific failed unsynced status should be moved to syncStatus = 0 & success ones should be deleted...
            })
        }
    }

    uploadUnsyncedImages = async (unSyncedImages) =>{
        let imageUploadError = false
        // console.log("Images",unSyncedImages)
        if(unSyncedImages.length > 0) {
            for(let i = 0; i < unSyncedImages.length; i++) {
                let data = unSyncedImages[i];
                // console.log("Images",data)
                data.imageBase64 = await RNFS.readFile(data.uri, 'base64')
                delete data.uri;
                
                axios.post(captureImageApi, data).then(res=>{
                    imageUploadError=true; //change this
                    this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'fileName', data.fileName, res.data.status === "Success");
                }).catch(e=>{
                    imageUploadError=false;
                    this.updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'fileName', data.fileName, true); //change true to false
                })
            }

            if(!imageUploadError)
            {
                this.setState({status:1},()=>{
                    setTimeout(()=>{
                        this.props.Reset();
                    },3000)
                })
            }
            else
            {
                this.setState({status:2},()=>{
                    setTimeout(()=>{
                        this.props.Reset();
                    },3000)
                })
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