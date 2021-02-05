/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import StarOutline from '../../assets/icons/star-outline.svg';
import StarSharp from '../../assets/icons/star-sharp.svg';

const StarRating = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  data,
  question,
}) => (
  <View style={{ flex: 1 }}>
    <TextEle variant="title" style={{ marginBottom: 10 }}>
      {question}
    </TextEle>
    <View style={{ marginTop: 30, margin: 10, flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Rating
          type="custom"
          ratingImage={require('../../assets/Logo/star.png')}
          ratingColor="red"
          ratingBackgroundColor="#fff"
          onFinishRating={rating => setFieldValue(name, rating)}
          showRating={false}
          fractions={2}
          startingValue={value || 0}
          style={{ paddingVertical: 10 }}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
        {touched[name] && errors[name] && (
          <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
            {errors[name]}
          </TextEle>
        )}
      </View>
    </View>
  </View>
);

export default StarRating;
