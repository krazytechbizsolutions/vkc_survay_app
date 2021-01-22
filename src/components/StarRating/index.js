/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import StarOutline from '../../assets/icons/star-outline.svg';
import StarSharp from '../../assets/icons/star-sharp.svg';

const StarRating = ({ data }) => {
  const [state, setstate] = useState();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 30, flexDirection: 'row' }}>
        <For each="item" of={[...Array(data.Max_Limit__c).keys()]}>
          <Pressable style={{ padding: 4 }} onPress={() => setstate(item)}>
            {item <= state ? (
              <StarSharp height={32} width={32} fill="red" />
            ) : (
              <StarOutline height={32} width={32} fill="red" />
            )}
          </Pressable>
        </For>
      </View>
    </View>
  );
};

export default StarRating;
