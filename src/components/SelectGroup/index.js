/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SelectGroup = ({
  field: { name, value },
  form: { touched, errors, setFieldValue },
  question,
  data,
}) => (
  <View>
    <TextEle>{question}</TextEle>
    {touched[name] && errors[name] && (
      <TextEle variant="error" style={{ textAlign: 'center', marginVertical: 10 }}>
        {errors[name]}
      </TextEle>
    )}
    <ScrollView horizontal>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 65 }} />
          <For each="ele" of={data.filter(x => x.level === 'Option 2')}>
            <Text style={{ width: 65, textAlign: 'center' }}>{ele.optionName}</Text>
          </For>
        </View>
        <For each="row" index="i" of={data.filter(x => x.level === 'Option 1')}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 65 }}>{row.optionName}</Text>
            <For each="column" of={data.filter(x => x.level === 'Option 2')}>
              <View style={{ width: 65, alignItems: 'center' }}>
                <RadioCore
                  option={{ value: `${row.optionId}_${column.optionId}` }}
                  value={value && value.find(x => x.value.includes(`${row.optionId}`))?.value}
                  
                  onPress={() => {
                    const index =
                      (value && value.findIndex(x => x.value.includes(`${row.optionId}`)));
                      
                    if (index === -1) {
                      setFieldValue(name, [
                        ...value,
                        {
                          value: `${row.optionId}_${column.optionId}`,
                          selectedOptions: [row, column],
                        },
                      ]);
                    } else {
                      setFieldValue(name, [
                        ...value.slice(0, index),
                        {
                          value: `${row.optionId}_${column.optionId}`,
                          selectedOptions: [row, column],
                        },
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
  </View>
);

export default SelectGroup;
