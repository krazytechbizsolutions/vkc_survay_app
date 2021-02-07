/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const VKCDraggableList = ({ field: { name, value }, form: { setFieldValue }, data, question }) => {
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    setFieldValue(name, data);
  }, []);

  const onSelect = item => {
    const index = temp.findIndex(x => x.optionId === item.optionId);
    let arr = [];
    if (index === -1) {
      arr = [...temp, item];
    } else {
      arr = [...temp.slice(0, index), ...temp.slice(index + 1)];
    }
    const filteredStateData = value.filter(x => !arr.some(y => y.optionId === x.optionId));
    setFieldValue(
      name,
      [...arr, ...filteredStateData].map((x, i) => ({ ...x, seqNo: i + 1 })),
    );
    setTemp(arr);
  };

  return (
    <>
      <View>
        <TextEle>{question}</TextEle>
      </View>
      {!!value && value.length > 0 && (
        <FlatList
          data={value}
          renderItem={({ item, index }) => (
            <RectButton
              onPress={() => onSelect(item)}
              style={{
                backgroundColor: temp.some(x => x.optionId === item.optionId) ? 'red' : '#fff',

                margin: 5,
                padding: 10,
                shadowColor: '#000',
                borderRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
              }}>
              <TextEle
                variant="body1"
                style={{ color: temp.some(x => x.optionId === item.optionId) ? 'white' : 'black' }}>
                {index + 1}
              </TextEle>
              <TextEle
                variant="body1"
                style={{ color: temp.some(x => x.optionId === item.optionId) ? 'white' : 'black' }}>
                {item.optionName}
              </TextEle>
            </RectButton>
          )}
          keyExtractor={item => `draggable-item-${item.optionId}`}
        />
      )}
    </>
  );
};

export default VKCDraggableList;
