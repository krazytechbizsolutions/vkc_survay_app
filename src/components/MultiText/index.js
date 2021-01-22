import VKCButton from '@components/VKCButton';
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

const MultiText = () => {
  const [textList, setTextList] = useState(['']);

  return (
    <View>
      <For each="ele" of={textList}>
        <TextInput
          style={{
            height: 56,
            paddingHorizontal: 24,
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 32,
            fontWeight: '500',
            fontFamily: 'Inter-Medium',
            fontSize: 15,
            fontStyle: 'normal',
            lineHeight: 18,
            letterSpacing: 0.7,
            textAlign: 'left',
            marginVertical: 10,
          }}
        />
      </For>
      <VKCButton variant="fill" text="Add" onPress={() => setTextList([...textList, ''])} />
    </View>
  );
};

export default MultiText;
