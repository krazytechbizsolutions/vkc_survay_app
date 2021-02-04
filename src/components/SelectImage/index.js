import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const ImageRadio = ({ option, value, onPress }) => (
  <RectButton onPress={onPress}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      {value !== '' && value === option.value ? (
        <RadioCheckedIcon fill="red" width={24} height={24} />
      ) : (
        <RadioUncheckedIcon fill="red" width={24} height={24} />
      )}
      {option.uri && <Image source={{ uri: option.uri }} style={{ height: 100, width: 100 }} />}
    </View>
  </RectButton>
);

const SelectImage = ({ data }) => {
  const [value, setValue] = useState();
  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
      )}
      renderItem={({ item }) => (
        <ImageRadio
          key={item.id}
          option={{ uri: item.uri, value: item.text }}
          value={value}
          onPress={() => setValue(item.text)}
        />
      )}
    />
  );
};

export default SelectImage;
