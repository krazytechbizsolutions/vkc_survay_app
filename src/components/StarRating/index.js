/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import StarOutline from '../../assets/icons/star-outline.svg';
import StarSharp from '../../assets/icons/star-sharp.svg';

const StarRating = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  data,
}) => (
  <View style={{ flex: 1 }}>
    <View style={{ marginTop: 30, flexDirection: 'row' }}>
      <For each="item" of={[...Array(data.Max_Limit__c).keys()]}>
        <Pressable
          style={{ padding: 4 }}
          onPress={() => {
            setFieldValue(name, item + 1);
            setFieldTouched(name, true);
          }}>
          {item < value ? (
            <StarSharp height={32} width={32} fill="red" />
          ) : (
            <StarOutline height={32} width={32} fill="red" />
          )}
        </Pressable>
      </For>
      {touched[name] && errors[name] && <TextEle>{errors[name]}</TextEle>}
    </View>
  </View>
);

export default StarRating;
