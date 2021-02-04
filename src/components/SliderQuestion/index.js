/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Slider, View, Dimensions } from 'react-native';
import TextEle from '@components/TextEle';

const { width: screenWidth } = Dimensions.get('window');

const SliderQuestion = ({ data }) => {
  const [value, setValue] = useState(data.Min_Limit__c);
  const left = (value * (screenWidth - 60)) / 100 - 8;

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <TextEle style={{ width: 40, textAlign: 'center', left: left }}>{Math.floor(value)}</TextEle>
      <Slider
        style={{ marginTop: 20 }}
        minimumValue={data.Min_Limit__c}
        maximumValue={data.Max_Limit__c}
        thumbTintColor="red"
        minimumTrackTintColor="red"
        maximumTrackTintColor="#000000"
        onValueChange={val => setValue(val)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
        <TextEle>{data.Min_Limit__c}</TextEle>
        <TextEle>{data.Max_Limit__c}</TextEle>
      </View>
    </View>
  );
};

export default SliderQuestion;
