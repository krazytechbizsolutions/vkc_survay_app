/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React from 'react';
import { Pressable, View } from 'react-native';
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
