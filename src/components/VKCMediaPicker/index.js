import VKCButton from '@components/VKCButton';
import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { ActionSheetIOS, View } from 'react-native';

const VKCMediaPicker = () => {
  const [response, setResponse] = useState(null);

  const selectImage = () => {
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
  };
  return (
    <View>
      <VKCButton variant="fill" text="Select Image" onPress={selectImage} />
    </View>
  );
};

export default VKCMediaPicker;
