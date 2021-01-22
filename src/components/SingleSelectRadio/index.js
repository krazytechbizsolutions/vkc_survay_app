/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

const SingleSelectRadio = ({ data }) => {
  const [value, setValue] = useState();
  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
      )}
      renderItem={({ item }) => (
        <RadioCore
          key={item.id}
          option={{ text: item.text, value: item.text }}
          value={value}
          onPress={() => setValue(item.text)}
        />
      )}
    />
  );
};

export default SingleSelectRadio;
