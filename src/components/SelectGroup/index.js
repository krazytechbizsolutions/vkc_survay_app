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
        <For each="ele" of={data.column}>
          <Text style={{ width: 60 }}>{ele.rate}</Text>
        </For>
      </View>
      <For each="row" index="i" of={data.row}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ width: 60 }}>{row.text}</Text>
          <For each="column" of={data.column}>
            <View style={{ width: 60, alignItems: 'center' }}>
              <RadioCore
                option={{ value: `${row.id}_${column.id}` }}
                value={value}
                onPress={() => setValue(`${row.id}_${column.id}`)}
              />
            </View>
          </For>
        </View>
      </For>
    </View>
  );
};

export default SelectGroup;
