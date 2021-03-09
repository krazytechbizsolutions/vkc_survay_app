import React from 'react';
import { Animated, SafeAreaView, Text, ScrollView, View, Alert, Pressable,Modal,StyleSheet,Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { format } from 'date-fns';
import axios from '@utils/axios';
import TextEle from '@components/TextEle';

const captureSurveyApi = '/services/apexrest/SRVY_SvyCapture_API';
const captureImageApi = '/services/apexrest/SRVY_SvyCaptureImage_API';
const today = format(new Date(), 'yyyy-MM-dd');

class SubmitModal extends React.Component{
    constructor() {
        super();
        this.state={
            outerProgressWidth: 0,
            progressWidth: new Animated.Value(30),
            totalSurvey: 0,
            totalImages: 0,
            imagesErrorCount: 0,
            surveySubmitted: false,
            submitFinished: false,
            Images:[],
            imageCount: 0,
            errorMsg: ""
        }
    }

    componentDidMount()
    {
        this.performSync();
    }

    setProgressBar =(val)=>{
        Animated.timing(this.state.progressWidth,{
            toValue: isNaN(val) ? 30 :val,
            timing: 5000
        }).start();
    }

    removeImages = async()=>{
        let AllKeys = await AsyncStorage.getAllKeys();
            AllKeys.forEach((result,index)=>{
                if(result.includes('IMG'))
                {
                    AsyncStorage.removeItem(result)
                }
            })
    }

    getUnsyncedDataOfCurrentDayFromStorage = async (key) => {
        let unSyncedData = JSON.parse(await AsyncStorage.getItem(key))
        if(!unSyncedData) return [];

        unSyncedData = unSyncedData.filter(ud => ud.surveyDate === today && ud.syncStatus === 0)
        if(unSyncedData.length > 0){
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.map(ud => ud.syncStatus = 1)));
        }
        return unSyncedData;
    }

    updateFailedDataBackToUnSyncedStatusInStorage = async (key) => {
        let unSyncedData = JSON.parse(await AsyncStorage.getItem(key))
        if(unSyncedData && unSyncedData.length > 0){
            // get current day syncStatus = 1, update it to 0 & set it back to storage...
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.map(ud => {
                if(ud.surveyDate === today && ud.syncStatus === 1) {
                    ud.syncStatus = 0;
                }
                return ud;
            })));
        }
    }

    removeUnSyncedStatusSuccessDataInStorage = async (key) => {
        let unSyncedData = JSON.parse(await AsyncStorage.getItem(key))
        if(unSyncedData && unSyncedData.length > 0){
            // get current day syncStatus = 0 & set it back to storage... this will force remove syncStatus = 1...
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.filter(ud => (ud.surveyDate === today && ud.syncStatus === 0))));
        }
    }

    performSync = async () =>{
        // sync the planned visit survey...
        this.uploadUnsyncedSurveys(getUnsyncedDataOfCurrentDayFromStorage('unSyncedQuestions'));

        // sync the planned visit survey images...
        this.uploadUnsyncedImages(getUnsyncedDataOfCurrentDayFromStorage('unSyncedImages'))

        // TODO: sync the existing retailer unplanned visit survey...
        // TODO: sync the existing retailer unplanned visit survey images...

        // TODO: sync the new retailers...
        // TODO: sync the new retailer unplanned visit survey...
        // TODO: sync the new retailer unplanned visit survey images...
        
    }


    uploadUnsyncedSurveys = (unSyncedQuestions) => {
        if(unSyncedQuestions.length > 0){
            axios.post(captureSurveyApi,unSyncedQuestions).then(res=>{
                if(res.data.status === "Success") {
                    removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                } else {
                    updateFailedDataBackToUnSyncedStatusInStorage('unSyncedQuestions');
                }
            }).catch(e=>{
                updateFailedDataBackToUnSyncedStatusInStorage('unSyncedQuestions');
                // TODO: Specific failed unsynced status should be moved to syncStatus = 0 & success ones should be deleted...
            })
        }
    }

    uploadUnsyncedImages = async (unSyncedImages)=>{
        if(unSyncedImages.length > 0) {
            for(let i = 0; i < unSyncedImages.length; i++) {
                let data = unSyncedImages[i];
                data.imageBase64 = await RNFS.readFile(data.uri, 'base64')
                delete data.uri;
                
                axios.post(captureImageApi, data).then(res=>{
                    if(res.data.status === "Success") {
                        removeUnSyncedStatusSuccessDataInStorage('unSyncedQuestions');
                    } else {
                        updateFailedDataBackToUnSyncedStatusInStorage('unSyncedQuestions');
                    }
                }).catch(e=>{
                   
                })
            }
        }      
    }

  

    render()
    {
        const animatedStyle={
            width: this.state.progressWidth
        }
        
        const msgWithButton = (imgSrc, displayText, errorMsg) => {
            imgSrc = './' + imgSrc;
            return <View style={{ width:'100%', height:'100%', alignItems:'center', padding:15 }}>
                <Image style={{width: 125, height: 125}} source={imgSrc}/>
                <TextEle style={{textAlign: 'center', marginTop: 25}}>{displayText}</TextEle>
                <TextEle style={{textAlign:'center',marginTop:25}}>{errorMsg}</TextEle>
                <TouchableOpacity onPress={() => this.props.BackToHome()} style={{ width:'100%', marginTop: 25}}>
                    <View style={{width: '100%', height: 50, borderRadius: 10, backgroundColor: "red", alignItems: 'center', justifyContent: 'center'}}>
                        <TextEle style={{color: 'white', fontSize: 20}}>Proceed</TextEle>
                    </View>
                </TouchableOpacity>
            </View>
        }

        return(
           
            <View style={{width:'100%',height:'100%',backgroundColor:'white',marginTop:200,borderRadius:20,elevation:5,padding:10,alignItems:'center'}}>
            { 
                this.state.submitFinished 
                    ? 
                        this.state.surveySubmitted 
                            ? 
                                this.state.imageCount === this.state.Images.length ?
                                    msgWithButton('checked.png', 'Your Survey Has Been Sucessfully Submitted.', '')
                                :
                                    msgWithButton('warning.png', 'All Your Survey Were Submitted But Some Of Your Image Were Not Able to Upload. Please Try Again', this.state.errorMsg)                            
                            :
                                msgWithButton('close.png', 'Your Survey Was Not Recorded. Please Contact Support', this.state.errorMsg)// Show Error
                    :
                        <>
                           <TextEle style={{marginTop:10}}>Uploading {this.state.totalSurvey} Survey and {this.state.totalImages} Images....</TextEle>
                           <View onLayout={(event)=>{
                                let {width}=event.nativeEvent.layout;
                                this.setState({outerProgressWidth: parseInt(width)})
                            }} style={{marginTop:30,width:'90%',height:25,borderRadius:10,backgroundColor:'#e0e0de'}}>
                                <Animated.View style={[styles.progress, animatedStyle]}/>
                            </View>
                        </>
                }
            </View>
         
        )
    }
}

const styles = StyleSheet.create({
    progress: {
        width:'10%',
        height:25,
        borderRadius:10,
        backgroundColor:'red'
    }
})


export default SubmitModal;
