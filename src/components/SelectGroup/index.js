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
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 60 }} />
        <For each="ele" of={data.filter(x => x.level === 'Option 2')}>
          <Text style={{ width: 60 }}>{ele.optionName}</Text>
        </For>
      </View>
      <For each="row" index="i" of={data.filter(x => x.level === 'Option 1')}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ width: 60 }}>{row.optionName}</Text>
          <For each="column" of={data.filter(x => x.level === 'Option 2')}>
            <View style={{ width: 60, alignItems: 'center' }}>
              <RadioCore
                option={{ value: `${row.optionId}_${column.optionId}` }}
                value={value}
                onPress={() => setValue(`${row.optionId}_${column.optionId}`)}
              />
            </View>
          </For>
        </View>
      </For>
    </View>
  );
};

export default SelectGroup;
