/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SelectGroup = ({ data }) => {
  const [value, setValue] = useState([]);
  return (
    <ScrollView horizontal>
      <View>
        <TextEle variant="title">{data.question}</TextEle>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 100 }} />
          <For each="ele" of={data.filter(x => x.level === 'Option 2')}>
            <Text style={{ width: 100, textAlign: 'center' }}>{ele.optionName}</Text>
          </For>
        </View>
        <For each="row" index="i" of={data.filter(x => x.level === 'Option 1')}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 100 }}>{row.optionName}</Text>
            <For each="column" of={data.filter(x => x.level === 'Option 2')}>
              <View style={{ width: 100, alignItems: 'center' }}>
                <RadioCore
                  option={{ value: `${row.optionId}_${column.optionId}` }}
                  value={value?.find(x => x.includes(`${row.optionId}`)) || ''}
                  onPress={() => {
                    const index = value.findIndex(x => x.includes(`${row.optionId}`));
                    if (index === -1) {
                      setValue([...value, `${row.optionId}_${column.optionId}`]);
                    } else {
                      setValue([
                        ...value.slice(0, index),
                        `${row.optionId}_${column.optionId}`,
                        ...value.slice(index + 1),
                      ]);
                    }
                  }}
                />
              </View>
            </For>
          </View>
        </For>
      </View>
    </ScrollView>
  );
};

export default SelectGroup;
