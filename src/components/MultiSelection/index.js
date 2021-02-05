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
}) => (
  <View>
    {touched[name] && errors[name] && (
      <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
        {errors[name]}
      </TextEle>
    )}
    <View style={{ marginVertical: 10 }}>
      <TextEle>{question}</TextEle>
    </View>
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
  </View>
);

export default MultiSelection;
