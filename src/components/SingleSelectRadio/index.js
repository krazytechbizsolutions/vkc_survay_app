/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const SingleSelectRadio = ({
  data,
  valueField,
  textField,
  value,
  onSelect,
  parentValue,
  placeholder = 'Please select value',
  question,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [childValue, setChildValue] = useState('');

  useEffect(() => {
    onSelect('');
  }, [parentValue?.optionName]);

  const onSelectValue = item => {
    setIsVisible(false);
    onSelect(item);
  };

  return (
    <>
      <TextEle variant="title">{question}</TextEle>
      <RectButton onPress={() => setIsVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            style={styles.textInput}
            value={value[textField]}
            placeholder={placeholder}
            editable={false}
          />
          <Icon
            name="caret-down-outline"
            style={{ position: 'absolute', right: 10, top: 7 }}
            size={24}
            color="red"
          />
        </View>
      </RectButton>
      <Modal
        isVisible={isVisible}
        style={{ backgroundColor: '#fff', margin: 0 }}
        onRequestClose={() => setIsVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
            )}
            renderItem={({ item }) => (
              <RadioCore
                key={item.id}
                option={{ text: item[textField], value: item[valueField] }}
                value={value}
                onPress={() => onSelectValue(item)}
              />
            )}
            keyExtractor={item => `${item.Id}`}
          />
        </SafeAreaView>
      </Modal>
      {value?.subOrLoopingQtnOptions?.length > 1 && (
        <SingleSelectRadio
          data={value.subOrLoopingQtnOptions}
          valueField="Id"
          textField="Detailed_Survey_Option_Name__c"
          parentValue={value}
          value={childValue}
          onSelect={item => setChildValue(item)}
          question={value.loopingQtnName}
        />
      )}
    </>
  );
};

export default SingleSelectRadio;
