/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import VKCButton from '@components/VKCButton';
import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const MultiText = ({ question }) => {
  const [textList, setTextList] = useState(['']);

  return (
    <View>
      <TextEle>{question}</TextEle>
      <For each="ele" of={textList}>
        <View>
          <TextInput
            style={[styles.textInput]}
            // value={value ? value[textField] : ''}
            // placeholder={placeholder}
          />
          <Pressable
            style={{ position: 'absolute', right: 10, top: 18 }}
            onPress={() => {
              const [, ...rest] = textList;
              setTextList(rest);
            }}>
            <Icon name="close" size={24} color="red" />
          </Pressable>
        </View>
      </For>
      <VKCButton variant="fill" text="Add" onPress={() => setTextList([...textList, ''])} />
    </View>
  );
};

export default MultiText;
