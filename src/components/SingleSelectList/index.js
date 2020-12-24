/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { View } from 'react-native';
import { CheckBoxFill } from '@components/CheckBoxField/CheckBoxField';

const SingleSelectList = ({ data }) => {
  const [value, setValue] = useState([]);
  return (
    <View>
      <TextEle variant="title">{data.question}</TextEle>
      <For each="item" of={data.options}>
        <CheckBoxFill
          option={{ text: item.text, value: item.text }}
          value={value}
          onPress={() => {
            if (value.some(ele => ele === item.text)) {
              setValue(value.filter(x => x !== item.text));
            } else {
              setValue([...value, item.text]);
            }
          }}
        />
      </For>
    </View>
  );
};

export default SingleSelectList;
