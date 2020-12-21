import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import Checkbox from '../checkbox/Checkbox';

const CheckboxField = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
}) => {
  return (
    <BorderlessButton onPress={() => setFieldValue(name, !value)}>
      <Checkbox checked={value} />
    </BorderlessButton>
  );
};

export default CheckboxField;
