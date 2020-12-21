/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Text from '../Text/Text';
import styles from './styles';

const data = [
  {
    id: '1',
    fruit_name: 'Apple',
  },
  {
    id: '2',
    fruit_name: 'Apricot',
  },
  {
    id: '3',
    fruit_name: 'Avocado',
  },
  {
    id: '4',
    fruit_name: 'Banana',
  },
  {
    id: '5',
    fruit_name: 'Bilberry',
  },
  {
    id: '6',
    fruit_name: 'Blackberry',
  },
  {
    id: '7',
    fruit_name: 'Blackcurrant',
  },
  {
    id: '8',
    fruit_name: 'Blueberry',
  },
];

const Model = ({ onSelect }) => {
  const [text, setText] = useState('');

  const renderSearchBarInput = () => (
    <TextInput
      style={styles.textInputStyle}
      onChangeText={item => setText(item)}
      value={text}
      underlineColorAndroid="transparent"
      placeholder="Search Here"
      placeholderTextColor="#A2A2A2"
    />
  );

  const keyExtractor = item => item.fruit_name.toString();

  const renderSeparator = () => <View style={styles.lineStyle} />;

  const renderItem = ({ item }) => (
    <RectButton onPress={() => onSelect(item)}>
      <View style={styles.menuContainer}>
        <Text variant="subtitle2">{item.fruit_name}</Text>
      </View>
    </RectButton>
  );

  const renderFlatListItem = () => {
    const filteredData = data.filter(x => {
      if (text) {
        return x.fruit_name.includes(text);
      }
      return true;
    });
    return (
      <FlatList
        style={styles.listStyle}
        data={filteredData}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
        enableEmptySections
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderSearchBarInput()}
      {renderFlatListItem()}
    </View>
  );
};

export default Model;
