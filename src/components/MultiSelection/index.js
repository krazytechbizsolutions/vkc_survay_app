/* eslint-disable react/prop-types */
import React from 'react';
import { FlatList, View } from 'react-native';
import { CheckBoxFill } from '@components/CheckBoxField/CheckBoxField';
import TextEle from '@components/TextEle';

const MultiSelection = ({
  field: { name, value },
  form: { touched, errors, setFieldValue },
  data,
  question,
  textField,
  valueField,
  isSubLoop
}) => (
  <View>
    <View style={{ marginVertical: 10 }}>
      <TextEle>{question}</TextEle>
    </View>
    {touched[name] && errors[name] && (
      <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
        {errors[name]}
      </TextEle>
    )}
    <FlatList
      data={data}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
      )}
      renderItem={({ item }) => (
        <CheckBoxFill
          key={item.id}
          option={{ text: item[textField], value: item[valueField] }}
          value={value && value.map(x => x[valueField])}
          onPress={() => {
            if (value && value.some(x => x[valueField] === item[valueField])) {
              
              value = value.filter(x => x[valueField]  !== item[valueField])
              console.log("37",value)
              setFieldValue(name,value);
            } else {
              console.log("40",[...(value || []), item])
              setFieldValue(name, [...(value || []), item]);
            }
          }}
        />
      )}
    />
  </View>
);

export default MultiSelection;
