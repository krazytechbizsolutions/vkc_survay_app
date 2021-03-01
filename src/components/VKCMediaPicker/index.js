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
  userId,
  questionId
}) => {
  const [isVisible, setVisible] = useState(false);
  const [ImageData,setImageData] = useState([]);

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

 const StoreImageLocal = (ImgData) =>{
      AsyncStorage.setItem(`IMG-${surveyId}-${accountId}-${userId}-${questionId}`,JSON.stringify(ImgData)).then(res =>{
        AsyncStorage.getItem(`IMG-${surveyId}-${accountId}-${userId}-${questionId}`).then(res => {
          console.log("59",res)
        })
        console.log("Images Stored Successfully");
        }).catch(err => {
          console.log("Error Storing Values",err)
        })
 }

  useEffect(()=>{
    AsyncStorage.getItem(`IMG-${surveyId}-${accountId}-${userId}-${questionId}`).then(res => {
      if(res !== null)
      {
        let Images = JSON.parse(res);
        console.log("70",Images);
        setImageData([...Images])
      }
    })
  },[])

  const SetImage = (ImageObj) => {
      let TempImageData = ImageData;
      TempImageData.push(ImageObj);
      StoreImageLocal(TempImageData);
      setImageData([...TempImageData])
  }

  const onDeleteData=(index)=>{
    let TempImageData = ImageData;
    TempImageData.splice(index, 1);
    StoreImageLocal(TempImageData);
    setImageData([...TempImageData]);
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
        disable={(value || []).length >= 10}
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
                    mediaType: 'photo'
                  },
                  res => {
                    // console.log("78",res);
                    SetImage(res);
                    setFieldValue(name, [...(value || []), res]);
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
      {(ImageData || [])?.map((x,index) => (
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
