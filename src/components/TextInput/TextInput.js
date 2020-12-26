/* eslint-disable */
import TextEle from '@components/TextEle';
import React from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const LongText = ({ data }) => (
  <View style={{ flex: 1, margin: 10 }}>
    <TextEle variant="title">{data.question}</TextEle>
    <TextInput
      style={{
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        marginVertical: 20,
      }}
    />
  </View>
);

export default LongText;
