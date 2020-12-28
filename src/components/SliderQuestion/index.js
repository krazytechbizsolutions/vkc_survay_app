/* eslint-disable react/prop-types */
import React from 'react';
import { Slider, View } from 'react-native';
import TextEle from '@components/TextEle';

const SliderQuestion = ({ data }) => (
  <View style={{ flex: 1 }}>
    <TextEle variant="title">{data.question}</TextEle>
    <Slider
      style={{ marginTop: 20 }}
      minimumValue={0}
      maximumValue={1}
      thumbTintColor="red"
      minimumTrackTintColor="red"
      maximumTrackTintColor="#000000"
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
      <TextEle>0</TextEle>
      <TextEle>100</TextEle>
    </View>
  </View>
);

export default SliderQuestion;
