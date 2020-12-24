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
        {/* <For> */}
        <RadioCore
          option={{ text: item.text, value: item.text }}
          value={value}
          onPress={() => setValue(item.text)}
        />
        {/* </For> */}
      </For>
    </View>
  );
};

export default SelectGroup;
