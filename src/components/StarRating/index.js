/* eslint-disable react/prop-types */
import React from 'react';
import { View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import TextEle from '@components/TextEle';

const StarRating = ({ data }) => (
  <View style={{ flex: 1 }}>
    <TextEle variant="title">{data.question}</TextEle>
    <AirbnbRating
      count={5}
      reviews={['Very Bad', 'Bad', 'OK', 'Good', 'Very Good']}
      defaultRating={5}
      size={20}
    />
  </View>
);

export default StarRating;
