/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { View } from 'react-native';
import Text from '../text/Text';
import CheckCircle from '../../assets/icons/check_circle.svg';

const ConfirmOrder = ({ title, subtitle }) => {
  return (
    <View
      style={{
        backgroundColor: '#f4f6f9',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <CheckCircle width={48} height={48} />
      <Text variant="subtitle1" style={{ marginVertical: 10, lineHeight: 20, color: 'red' }}>
        {title}
      </Text>
      <Text variant="subtitle2" style={{ lineHeight: 20, color: 'rgb(0, 112, 210)' }}>
        {subtitle}
      </Text>
    </View>
  );
};

export default memo(ConfirmOrder);
