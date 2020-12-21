/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import CircleWithText from './CircleWithText';
const HeaderCircle = ({ data, onSelect, currentIndex }) => {
  return (
    <ScrollView
      style={{ flexDirection: 'row' }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      {data &&
        data.map((item, key) => {
          return (
            <BorderlessButton
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
              key={key}
              onPress={() => onSelect(key)}
            >
              <CircleWithText item={item} dayFormate="EEEEE" currentIndex={key === currentIndex} />
            </BorderlessButton>
          );
        })}
    </ScrollView>
  );
};
HeaderCircle.propTypes = {
  data: PropTypes.array.isRequired,
};

export default memo(HeaderCircle);
