import VKCButton from '@components/VKCButton';
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const MultiText = () => {
  const [textList, setTextList] = useState(['']);

  return (
    <View>
      <For each="ele" of={textList}>
        <View>
          <TextInput
            style={[styles.textInput]}
            // value={value ? value[textField] : ''}
            // placeholder={placeholder}
          />
          <BorderlessButton
            style={{ position: 'absolute', right: 10, top: 18 }}
            onPress={() => {
              const [, ...rest] = textList;
              setTextList(rest);
            }}>
            <Icon name="close" size={24} color="red" />
          </BorderlessButton>
        </View>
      </For>
      <VKCButton variant="fill" text="Add" onPress={() => setTextList([...textList, ''])} />
    </View>
  );
};

export default MultiText;
