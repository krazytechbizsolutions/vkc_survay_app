/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, Switch as RNSwitch } from 'react-native';
import Text from '../Text/Text';

const Switch = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  inputStyle,
  innerRef,
  label,
  ...props
}) => (
  <View
    style={{
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 5,
    }}>
    <Text style={{ flex: 1 }} variant="label">
      {label}
    </Text>
    <RNSwitch
      {...props}
      value={value}
      onValueChange={itemValue => {
        setFieldValue(name, itemValue);
      }}
    />
  </View>
);

Switch.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  inputRef: PropTypes.func,
  inputStyle: ViewPropTypes.style,
};

Switch.defaultProps = {
  inputStyle: {},
  inputRef: () => {},
};

export default memo(Switch);
