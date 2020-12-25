/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { View } from 'react-native';

const SelectGroup = ({ data }) => {
  const [value, setValue] = useState();
  return (
    <View>
      <TextEle variant="title">{data.question}</TextEle>
      <For each="item" of={data.options}>
        <For each="index" of={data.options}>
          <RadioCore
            option={{ value: item.text }}
            value={value}
            onPress={() => setValue(item.text)}
          />
          <RadioCore
            option={{ value: index.text }}
            value={value}
            onPress={() => {
              // if (value.some(ele => ele === index.text)) {
              //   setValue(value.filter(x => x !== index.text));
              // } else {
              //   setValue([...value, index.text]);
              // }
            }}
          />
        </For>
      </For>
    </View>
  );
};

export default SelectGroup;
