/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const VKCDraggableList = ({ data }) => {
  const [stateData, setStateData] = useState(data);
  const [temp, setTemp] = useState([]);

  const onSelect = item => {
    const index = temp.findIndex(x => x.optionId === item.optionId);
    let arr = [];
    if (index === -1) {
      arr = [...temp, item];
    } else {
      arr = [...temp.slice(0, index), ...temp.slice(index + 1)];
    }
    const filteredStateData = stateData.filter(x => !arr.some(y => y.optionId === x.optionId));
    setStateData([...arr, ...filteredStateData]);
    setTemp(arr);
  };

  return (
    <FlatList
      data={stateData}
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
          <TextEle variant="body1">{index + 1}</TextEle>
          <TextEle variant="body1">{item.optionName}</TextEle>
        </RectButton>
      )}
      keyExtractor={item => `draggable-item-${item.optionId}`}
      onDragEnd={({ data: updatedData }) => setStateData(updatedData)}
    />
  );
};

export default VKCDraggableList;
