/* eslint-disable react/prop-types */
import React from 'react';
import { TextInput, View } from 'react-native';
import TextEle from '@components/TextEle';

const IntegerInput = ({ data }) => (
  <View style={{ flex: 1 }}>
    <TextEle variant="title">{data.question}</TextEle>
    <TextInput
      placeholder="Enter the integer"
      underlineColorAndroid="transparent"
      style={{
        textAlign: 'center',
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'red',
        marginBottom: 10,
      }}
      keyboardType="numeric"
    />
  </View>
);

export default IntegerInput;
