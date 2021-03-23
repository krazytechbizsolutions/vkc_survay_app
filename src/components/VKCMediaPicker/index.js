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
import { format } from 'date-fns';

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
    
  const setImage = async (imageObj) => {
      let imgData = {
        surveyId,
        surveyDate: today,
        temp_account_id,
        accountId: accountId,
        userId: userId,
        qtnId: questionId,
        Sequence_No: (value || []).length + 1,
        imageName: accName + "_" + today + questionId + "_" + ((value || []).length + 1),
        imageType: 'JPG',
        imageURL: imageObj.uri,
        relatedTo: 'Survey'
      }

      setFieldValue(name, [...value, imgData]);
  }

  const onDeleteData = async (index) => {
    value.splice(index, 1);
    setFieldValue('mainField', [...value]);
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
        disable={value.length >= 10}
        variant="fill"
        text="Select Image"
        onPress={() => setVisible(true)}
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
      {(value || [])?.map((x,index) => (
        <View style={{ margin: 40, alignItems: 'center' }}>
          {x?.imageURL && (
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
              <Image source={{ uri: x.imageURL }} style={{ height: 200, width: 200 }} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default VKCMediaPicker;
