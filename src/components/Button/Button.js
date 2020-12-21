import React from 'react';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import Text from '../text/Text';
import styles from './styles';
import commonStyle from '../../commonStyle';

const Button = ({
  title,
  style,
  viewStyle,
  textStyle,
  loading,
  disable,
  onPress,
  iconName,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!(loading || disable)) {
          onPress();
        }
      }}
      {...props}
      style={[style]}
    >
      <View style={[styles.button, viewStyle, { opacity: disable ? 0.6 : 1 }]}>
        {loading && (
          <View style={[commonStyle.hPad10]}>
            <ActivityIndicator size="small" animating color="#fff" />
          </View>
        )}
        <Text variant="button" style={[textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
