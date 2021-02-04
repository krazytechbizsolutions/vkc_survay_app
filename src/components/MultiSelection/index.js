/* eslint-disable react/prop-types */
import React from 'react';
import { FlatList, View } from 'react-native';
import { CheckBoxFill } from '@components/CheckBoxField/CheckBoxField';
import TextEle from '@components/TextEle';

const MultiSelection = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  data,
}) => (
  <View>
    <FlatList
      data={data}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
      )}
      renderItem={({ item }) => (
        <CheckBoxFill
          key={item.id}
          option={{ text: item.text, value: item.text }}
          value={value}
          onPress={() => {
            setFieldTouched(name, true);
            if (value && value.some(ele => ele === item.text)) {
              setFieldValue(
                name,
                value.filter(x => x !== item.text),
              );
            } else {
              setFieldValue(name, [...(value || []), item.text]);
            }
          }}
        />
      )}
    />
    {touched[name] && errors[name] && <TextEle>{errors[name]}</TextEle>}
  </View>
);

export default MultiSelection;
