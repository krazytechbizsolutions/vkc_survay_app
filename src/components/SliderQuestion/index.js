/* eslint-disable react/prop-types */
import React from 'react';
import { Slider, View } from 'react-native';
import TextEle from '@components/TextEle';

const SliderQuestion = ({ data }) => (
  <View style={{ flex: 1 }}>
    <Slider
      style={{ marginTop: 20 }}
      minimumValue={data.Min_Limit__c}
      maximumValue={data.Max_Limit__c}
      thumbTintColor="red"
      minimumTrackTintColor="red"
      maximumTrackTintColor="#000000"
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
      <TextEle>{data.Min_Limit__c}</TextEle>
      <TextEle>{data.Max_Limit__c}</TextEle>
    </View>
  </View>
);

export default SliderQuestion;
