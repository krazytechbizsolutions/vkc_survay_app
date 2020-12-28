/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

const SingleSelectRadio = ({ data }) => {
  const [value, setValue] = useState();
  return (
    <View>
      <TextEle variant="title">{data.question}</TextEle>
      <FlatList
        data={data.options}
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
    </View>
  );
};

export default SingleSelectRadio;
