/* eslint-disable react/forbid-prop-types */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, ViewPropTypes } from 'react-native';
import { getIn } from 'formik';
import Text from '../Text/Text';
import styles from './style';

const index = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  inputStyle,
  innerRef,
  label,
  editable,
  disable,
  isRequired,
  ...props
}) => {
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorMsg = touch && error ? error : null;
  return (
    <View>
      {label && (
        <Text variant="label">
          {label}
          {!!isRequired && <Text variant="error"> * </Text>}
        </Text>
      )}
      <TextInput
        {...props}
        ref={innerRef}
        style={[styles.textInput, inputStyle, errorMsg ? styles.errorBorder : {}]}
        onChangeText={itemValue => {
          setFieldValue(name, itemValue);
        }}
        onBlur={() => setFieldTouched(name)}
        value={`${value || ''}`}
        editable={editable || !disable}
        autoCapitalize="none"
      />
      {errorMsg && <Text variant="error">{errorMsg}</Text>}
    </View>
  );
};

index.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  inputRef: PropTypes.func,
  inputStyle: ViewPropTypes.style,
};

index.defaultProps = {
  inputStyle: {},
  inputRef: () => {},
};

export default memo(index);
