/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';

import Text from '../Text/Text';
import styles from './styles';
import Cancel from '../../assets/icons/cancel.svg';
import commonStyle from '../../commonStyle';

const SelectModel = ({ options = [], onSelect, closeModal }) => {
  const [text, setText] = useState('');

  const renderSearchBarInput = () => (
    <View style={[commonStyle.row, commonStyle.bgColor]}>
      <View style={[commonStyle.flex, commonStyle.row, commonStyle.center]}>
        <TextInput
          style={[styles.textInput, commonStyle.flex]}
          ref={ref => {
            this.inputRef = ref;
          }}
          onChangeText={item => setText(item)}
          value={text}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
          placeholderTextColor="#A2A2A2"
        />
        {!!text && (
          <TouchableOpacity
            style={styles.textInputCancelStyle}
            onPress={() => {
              this.inputRef.clear();
              this.inputRef.focus();
              setText('');
            }}>
            <Cancel width={24} height={24} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.cancelButtonStyle, commonStyle.center, commonStyle.pad10]}
        onPress={() => closeModal()}>
        <Text variant="button">Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = (item, index) => `${item.text}${index}`;

  const renderSeparator = () => <View style={styles.lineStyle} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.disabled) {
          Alert.alert(item.errorMessage);
        } else {
          onSelect(item);
        }
      }}>
      <View style={styles.menuContainer}>
        <Text variant="subtitle2">{item.text}</Text>
        {item.caption && <Text variant="subtitle2">{item.caption}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderFlatListItem = () => {
    const filteredOptions = options.filter(x => {
      if (text && x.text) {
        return x.text.toLowerCase().includes(text.toLowerCase());
      }
      return true;
    });
    return (
      <FlatList
        style={styles.listStyle}
        data={filteredOptions}
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

export default SelectModel;
