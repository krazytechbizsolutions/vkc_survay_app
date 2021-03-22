import VKCButton from '@components/VKCButton';
import React, { useState,useEffect } from 'react';
import { launchCamera } from 'react-native-image-picker';
import {
  ActionSheetIOS,
  View,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import TextEle from '@components/TextEle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VKCMediaPicker = ({
  field: { name, value },
  form: { touched, errors, setFieldValue },
  question,
  surveyId,
  accountId,
  temp_account_id,
  accName,
  userId,
  questionId,
  surveyDate,
  seqNo
}) => {

  let today = format(new Date(), 'yyyy-MM-dd');

  const [isVisible, setVisible] = useState(false);
  const [imageData, setImageData] = useState([]);

  useEffect(()=>{
    const loadSavedImages = async () => {
      let images = await getSurveyQuestionImagesFromStorage();
      setImageData(images)
      setFieldValue('mainField', images.length > 0 ? images : "")
    }
    loadSavedImages();
  },[])

  const setImage = async (imageObj) => {
      let imageName = accName + "_" + today + questionId + "_" + (imageData.length + 1);
      let imgData = {
        surveyId,
        surveyDate: today,
        temp_account_id,
        accountId: accId,
        userId: UserId,
        qtnId: questionId,
        Sequence_No: imageData.length + 1,
        imageName: imageName,
        imageType: 'JPG',
        imageURL: imageObj.uri,
        relatedTo: 'Survey'
      }

      imageData.push(imgData);

      setImageData(imageData);
      setFieldValue('mainField', imageData);
      // setFieldValue(name, [...(value || []), res]);
      await upsertSurveyQuestionImagesFromStorage(imageData);
  }

  const onDeleteData = async (index) => {
    imageData.splice(index, 1);

    setImageData(imageData);
    await upsertSurveyQuestionImagesFromStorage(imageData);
    setFieldValue('mainField', imageData);
    // setFieldValue(name, [...(value || []), res]);
  }

  const selectImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo...'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            //
          } else if (buttonIndex === 1) {
            launchCamera(
              {
                mediaType: 'photo',
              },
              res => {
                setFieldValue(name, [...(value || []), res]);
              },
            );
          }
        },
      );
    } else {
      setVisible(true);
    }
  };


  const saveObjectInArrayOfStorage = async (key, obj) => {
    let storageData = await getArrayFromStorage(key);
    storageData.push(obj);
    await AsyncStorage.setItem(key, JSON.stringify(storageData))
  }
  
  const getArrayFromStorage = async (key) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : []
    } catch(e){
      storageData = [];
    }
    return storageData;
  }

  const getSurveyQuestionImagesFromStorage = async () => {
    let savedUnSyncedQuestions = await getArrayFromStorage('unSyncedQuestions');
    return savedUnSyncedQuestions.filter(function(c) { 
      return (c.surveyId === surveyId && c.accountId === accountId 
        && c.temp_account_id === temp_account_id && c.UserId === userId 
        && c.qtnId === questionId && c.surveyDate === today);
    });
  }

  const upsertSurveyQuestionImagesFromStorage = async (imgData) => {
    let savedUnSyncedQuestions = await getArrayFromStorage('unSyncedQuestions');
    savedUnSyncedQuestions = savedUnSyncedQuestions.filter(function(c) { 
      return !(c.surveyId === surveyId && c.accountId === accountId 
        && c.temp_account_id === temp_account_id && c.UserId === userId 
        && c.qtnId === questionId && c.surveyDate === today);
    });
    savedUnSyncedQuestions.push(...imgData);
    saveObjectInArrayOfStorage('unSyncedQuestions', imgData);
  }

  return (
    <View style={{ margin: 20 }}>
      {touched[name] && errors[name] && (
        <TextEle variant="error" style={{ textAlign: 'center', marginVertical: 10 }}>
          {errors[name]}
        </TextEle>
      )}
      <TextEle variant="title" style={{ marginBottom: 10 }}>
        {question}
      </TextEle>
      <VKCButton
        disable={imageData.length >= 10}
        variant="fill"
        text="Select Image"
        onPress={selectImage}
      />
      {Platform.OS === 'android' && (
        <Modal isVisible={isVisible} onRequestClose={() => setVisible(false)}>
          <View style={{ backgroundColor: '#fff' }}>
            <Text style={{ padding: 20 }}>Select Image</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                launchCamera(
                  {
                    mediaType: 'photo',
                    maxWidth:500,
                    maxHeight:500
                  },
                  res => {
                    setImage(res);
                  },
                );
                setVisible(false);
              }}>
              <RectButton style={{ padding: 20 }}>
                <Text>Take Photo...</Text>
              </RectButton>
            </TouchableWithoutFeedback>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
              <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                <RectButton style={{ padding: 10 }}>
                  <Text style={{ color: 'red' }}>Cancel</Text>
                </RectButton>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
      )}
      {(imageData || [])?.map((x,index) => (
        <View style={{ margin: 40, alignItems: 'center' }}>
          {x?.uri && (
            <View>
              <BorderlessButton
                onPress={() =>{
                  onDeleteData(index);}
                }
                style={{
                  position: 'absolute',
                  right: -18,
                  top: -18,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: 18,
                  padding: 6,
                  zIndex: 10,
                }}>
                <Icon name="close" size={24} color="red" />
              </BorderlessButton>
              <Image source={{ uri: x.uri }} style={{ height: 200, width: 200 }} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default VKCMediaPicker;
