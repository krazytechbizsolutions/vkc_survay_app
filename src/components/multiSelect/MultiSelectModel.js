import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { RadioCore } from '../../components/radio/Radio';
import Checkbox from '../checkbox/Checkbox';
import Text from '../text/Text';
import styles from './styles';
import Cancel from '../../assets/icons/cancel.svg';
import commonStyle from '../../commonStyle';

const SelectModel = ({ options = [], onSelect, selectedItems }) => {
  const [text, setText] = useState('');
  const [selectList, setSelectList] = useState(selectedItems || []);

  const renderSearchBarInput = () => {
    return (
      <View style={[commonStyle.row, commonStyle.bgColor, commonStyle.hMar10]}>
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
              }}
            >
              <Cancel width={24} height={24} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.cancelButtonStyle, commonStyle.center, commonStyle.pad10]}
          onPress={() => onSelect(selectList)}
        >
          <Text variant="button">{'Select'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = (item, index) => `${item.text}${index}`;

  const renderSeparator = () => {
    return <View style={styles.lineStyle} />;
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const index = selectList.findIndex(x => x.value === item.value);
          if (index === -1) {
            setSelectList([...selectList, item]);
          } else {
            setSelectList(selectList.filter(x => x.value !== item.value));
          }
        }}
      >
        <View style={[styles.menuContainer, commonStyle.hPad10]}>
          <Checkbox checked={selectList.findIndex(x => x.value === item.value) !== -1} />
          <Text variant="subtitle2" style={{ marginHorizontal: 10 }}>
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFlatListItem = () => {
    const filteredOptions = options.filter(x => {
      if (text && x.text) {
        return x.text.toLowerCase().includes(text.toLowerCase());
      }
      return true;
    });
    return (
      <FlatList
        data={filteredOptions}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
        enableEmptySections={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderSearchBarInput()}
      <TouchableOpacity
        onPress={() => {
          if (options.length === selectList.length) {
            setSelectList([]);
          } else {
            setSelectList(options);
          }
        }}
      >
        <View style={[styles.menuContainer, commonStyle.hPad10]}>
          <Checkbox checked={options.length === selectList.length} />
          <Text variant="subtitle2" style={{ marginHorizontal: 10 }}>
            Select All
          </Text>
        </View>
      </TouchableOpacity>
      {renderFlatListItem()}
    </View>
  );
};

export default SelectModel;
