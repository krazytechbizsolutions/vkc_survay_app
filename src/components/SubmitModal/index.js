import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { format } from 'date-fns';
import axios from '@utils/axios';

const captureSurveyApi = '/services/apexrest/SRVY_SvyCapture_API';
const captureImageApi = '/services/apexrest/SRVY_SvyCaptureImage_API';
const today = format(new Date(), 'yyyy-MM-dd');

class SubmitModal extends React.Component{
    constructor() {
        super();
    }

    componentDidMount() {
        this.performSync();
    }

    getUnsyncedDataFromStorage = async (key) => {
        let unSyncedData = await AsyncStorage.getItem(key);
        if(!unSyncedData) return [];

        return JSON.parse(unSyncedData);
    } 

    getUnsyncedDataOfCurrentDayFromStorage = async (key) => {
        let unSyncedData = getUnsyncedDataFromStorage(key);

        unSyncedData = unSyncedData.filter(ud => ud.surveyDate === today && ud.syncStatus === 0)
        if(unSyncedData.length > 0){
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.map(ud => ud.syncStatus = 1)));
        }
        return unSyncedData;
    }

    updateFailedDataBackToUnSyncedStatusInStorage = async (key) => {
        let unSyncedData = getUnsyncedDataFromStorage(key);

        if(unSyncedData.length > 0){
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
        let unSyncedData = getUnsyncedDataFromStorage(key);
        if(unSyncedData && unSyncedData.length > 0){
            // get current day syncStatus = 0 & set it back to storage... this will force remove syncStatus = 1...
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.filter(ud => (ud.surveyDate === today && ud.syncStatus === 0))));
        }
    }

    updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage = async (key, eName, eValue, isRemove) => {
        let unSyncedData = getUnsyncedDataFromStorage(key);

        if(isRemove){
            // get where array[eName] !== eValue & set it back to storage... this will force remove array[eName] === eValue...
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.filter(ud => (ud[eName] !== eValue))));
        } else {
            await AsyncStorage.setItem(key, JSON.stringify(unSyncedData.map(ud => {
                if(ud[eName] === eValue) {
                    ud.syncStatus = 0;
                }
                return ud;
            })));
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
                    updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'imageName', data.imageName, res.data.status === "Success");
                }).catch(e=>{
                    updateOrRemoveSpecificEntryOfUnsyncedDataOfCurrentDayFromStorage('unSyncedImages', 'imageName', data.imageName, false);
                })
            }
        }      
    }

    render() {
        return <></>;
    }
}

export default SubmitModal;
