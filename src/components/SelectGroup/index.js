/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const SelectGroup = ({ data }) => {
  const [value, setValue] = useState();
  return (
    <View>
      <TextEle variant="title">{data.question}</TextEle>
      <For each="item" of={data.options}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 8 }}>{item.text}</Text>
          <For each="ele" of={item.Rating}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8 }}>{ele.rate}</Text>
              <RadioCore
                option={{ value: ele.rate }}
                value={value}
                onPress={() => setValue(ele.rate)}
              />
            </View>
          </For>
        </View>
      </For>
    </View>
  );
};

export default SelectGroup;
