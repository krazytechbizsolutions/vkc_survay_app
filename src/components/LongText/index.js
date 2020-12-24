/* eslint-disable */
import TextEle from '@components/TextEle';
import React from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const LongText = ({ data }) => (
  <View style={{ flex: 1, margin: 10 }}>
    <TextEle variant="title">{data.question}</TextEle>
    <TextInput
      multiline={true}
      numberOfLines={5}
      style={{
        textAlignVertical: 'top',
        height: 200,
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 20,
      }}
    />
  </View>
);

export default LongText;
