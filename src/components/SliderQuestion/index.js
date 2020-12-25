/* eslint-disable react/prop-types */
import React from 'react';
import { Slider, View } from 'react-native';
import TextEle from '@components/TextEle';

const SliderQuestion = ({ data }) => (
  <View style={{ flex: 1 }}>
    <TextEle variant="title">{data.question}</TextEle>
    <Slider
      style={{ width: 300, height: 100 }}
      minimumValue={0}
      maximumValue={1}
      thumbTintColor="blue"
      minimumTrackTintColor="blue"
      maximumTrackTintColor="#000000"
    />
  </View>
);

export default SliderQuestion;
