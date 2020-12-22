/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import styles from './styles';

const Model = () => {
  const [text, setText] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={() => setText()}
        value={text}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
        placeholderTextColor="#A2A2A2"
      />
    </View>
  );
};

export default Model;
