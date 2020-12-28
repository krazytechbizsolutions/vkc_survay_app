/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import React from 'react';
import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { getIn } from 'formik';
import Text from '../Text/Text';
import RadioCheckedIcon from '../../assets/icons/radio_button_checked.svg';
import RadioUncheckedIcon from '../../assets/icons/radio_button_unchecked.svg';

export const RadioCore = ({ option, value, onPress }) => (
  <RectButton onPress={onPress}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
      {option.text && (
        <Text variant="label" style={{ marginHorizontal: 10 }}>
          {option.text}
        </Text>
      )}
      {value !== '' && value === option.value ? (
        <RadioCheckedIcon fill="red" width={24} height={24} />
      ) : (
        <RadioUncheckedIcon fill="red" width={24} height={24} />
      )}
    </View>
  </RectButton>
);

const Radio = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  options,
  label,
}) => {
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorMsg = touch && error ? error : null;
  return (
    <View>
      {label && <Text variant="label">{label}</Text>}
      <View style={{ flexDirection: 'row' }}>
        {options &&
          options.map(option => (
            <RadioCore
              key={option.value}
              option={option}
              value={value}
              onPress={() => {
                setFieldTouched(name);
                setFieldValue(name, option.value);
              }}
            />
          ))}
      </View>
      {errorMsg && <Text variant="error">{errorMsg}</Text>}
    </View>
  );
};

export default Radio;
