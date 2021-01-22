/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Picker, View } from 'react-native';

const SingleSelectList = ({ data }) => {
  const [value, setValue] = useState([]);
  return (
    <View>
      <Picker
        selectedValue={value}
        style={{ height: 50 }}
        onValueChange={itemValue => setValue(itemValue)}>
        <For each="item" of={data}>
          <Picker.Item label={item.text} value={item.text} />
        </For>
      </Picker>
    </View>
  );
};

export default SingleSelectList;
