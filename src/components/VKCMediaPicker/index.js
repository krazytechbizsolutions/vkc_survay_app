import VKCButton from '@components/VKCButton';
import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
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

const VKCMediaPicker = () => {
  const [response, setResponse] = useState(null);
  const [isVisible, setVisible] = useState(false);

  const selectImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo...', 'Choose From Library...'],
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
                setResponse(res);
              },
            );
          } else if (buttonIndex === 2) {
            launchImageLibrary(
              {
                mediaType: 'photo',
              },
              res => {
                setResponse(res);
              },
            );
          }
        },
      );
    } else {
      setVisible(true);
    }
  };

  return (
    <View style={{ margin: 20 }}>
      <VKCButton variant="fill" text="Select Image" onPress={selectImage} />
      {Platform.OS === 'android' && (
        <Modal isVisible={isVisible} onRequestClose={() => setVisible(false)}>
          <View style={{ backgroundColor: '#fff' }}>
            <Text style={{ padding: 20 }}>Select Image</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                launchCamera(
                  {
                    mediaType: 'photo',
                  },
                  res => {
                    setResponse(res);
                  },
                );
                setVisible(false);
              }}>
              <RectButton style={{ padding: 20 }}>
                <Text>Take Photo...</Text>
              </RectButton>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                launchImageLibrary(
                  {
                    mediaType: 'photo',
                  },
                  res => {
                    setResponse(res);
                  },
                );
                setVisible(false);
              }}>
              <RectButton style={{ padding: 20 }}>
                <Text>Choose From Library...</Text>
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
      <View style={{ margin: 40, alignItems: 'center' }}>
        {response?.uri && (
          <View>
            <BorderlessButton
              onPress={() => setResponse(null)}
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
            <Image source={{ uri: response.uri }} style={{ height: 200, width: 200 }} />
          </View>
        )}
      </View>
    </View>
  );
};

export default VKCMediaPicker;
