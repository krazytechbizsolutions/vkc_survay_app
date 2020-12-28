/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Text, View } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import Checkbox from '../CheckBox/CheckBox';
import CheckboxIcon from '../../assets/icons/check_box.svg';
import CheckboxOutline from '../../assets/icons/check_box_outline.svg';

export const CheckBoxFill = ({ option, value, onPress }) => (
  <RectButton onPress={onPress}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
      <Text variant="label" style={{ marginHorizontal: 10 }}>
        {option.text}
      </Text>
      {value !== '' && value.includes(option.value) ? (
        <CheckboxIcon width={24} height={24} fill="red" />
      ) : (
        <CheckboxOutline width={24} height={24} fill="red" />
      )}
    </View>
  </RectButton>
);

const CheckboxField = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
}) => (
  <BorderlessButton onPress={() => setFieldValue(name, !value)}>
    <Checkbox checked={value} />
  </BorderlessButton>
);

export default CheckboxField;
