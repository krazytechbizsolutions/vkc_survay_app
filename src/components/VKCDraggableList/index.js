/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

const VKCDraggableList = ({ data }) => {
  const [stateData, setStateData] = useState(data);
  return (
    <DraggableFlatList
      data={stateData}
      renderItem={({ item, drag, isActive }) => (
        <TouchableOpacity
          style={{
            backgroundColor: isActive ? 'gray' : '#fff',
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
          }}
          onLongPress={drag}>
          <TextEle variant="body1">{item.optionName}</TextEle>
        </TouchableOpacity>
      )}
      keyExtractor={item => `draggable-item-${item.optionId}`}
      onDragEnd={({ data: updatedData }) => setStateData(updatedData)}
    />
  );
};

export default VKCDraggableList;
