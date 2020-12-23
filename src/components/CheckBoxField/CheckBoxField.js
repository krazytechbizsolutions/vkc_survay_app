/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import Checkbox from '../CheckBox/CheckBox';

const CheckboxField = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
}) => (
  <BorderlessButton onPress={() => setFieldValue(name, !value)}>
    <Checkbox checked={value} />
  </BorderlessButton>
);

export default CheckboxField;
