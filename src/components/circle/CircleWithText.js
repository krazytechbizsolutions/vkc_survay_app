/* eslint-disable indent */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { format, isToday } from 'date-fns';
import Text from '../Text/Text';
import styles from './styles';

const CircleWithText = ({ item, dayFormate, currentIndex }) => (
  <>
    <Text
      variant="title"
      style={[
        {
          fontWeight: '300',
          color: dayFormate === 'E' ? '#000' : '#fff',
          backgroundColor: dayFormate === 'E' ? '#fff' : '#007ac3',
        },
      ]}>
      {format(item, dayFormate)}
    </Text>
    <View
      style={[
        styles.circleContainer,
        {
          backgroundColor: currentIndex
            ? '#E74C3C'
            : isToday(item) || dayFormate === 'E'
            ? '#fff'
            : '#007ac3',
          borderRadius: isToday(item) || currentIndex ? 15 : 0,
        },
      ]}>
      <Text
        style={[
          styles.textStyle,
          {
            color: currentIndex ? '#fff' : isToday(item) || dayFormate === 'E' ? '#000' : '#fff',
          },
        ]}>
        {format(item, 'dd')}
      </Text>
    </View>
  </>
);
CircleWithText.propTypes = {
  item: PropTypes.instanceOf(Date).isRequired,
};

export default memo(CircleWithText);
