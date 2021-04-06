/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SpecialEfforts = ({
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
          <For each="ele" of={data[0].subOrLoopingQtnOptions}>
            <Text style={{ width: 65, textAlign: 'center' }}>{ele.Detailed_Survey_Option_Name__c}</Text>
          </For>
        </View>
        <For each="row" index="i" of={data}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 65 }}>{row.optionName}</Text>
            <For each="column" of={row.subOrLoopingQtnOptions}>
                
              <View style={{ width: 65, alignItems: 'center' }}>
                  {
                    //   console.log("Column",column.Id)
                  }
                <RadioCore
                  option={{ value: row.optionId + '_' + column.Id}}
                  value={value && value.find(x => x.value.includes(`${row.optionId}`))?.value}
                  
                  onPress={() => {
                    const index =
                      (value && value.findIndex(x => x.value.includes(`${row.optionId}`)));
                      console.log("Value1:" + JSON.stringify(value));
                      console.log("Value:" + JSON.stringify(column.Id));
                      
                    if (index === -1) {
                      setFieldValue(name, [
                        ...value,
                        {
                          value: `${row.optionId}_${column.Id}`,
                          selectedOptions: [row, column],
                        },
                      ]);
                    } else {
                      setFieldValue(name, [
                        ...value.slice(0, index),
                        {
                          value: `${row.optionId}_${column.Id}`,
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

export default SpecialEfforts;
