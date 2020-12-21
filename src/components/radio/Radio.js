import React from 'react';
import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { getIn } from 'formik';
import Text from '../text/Text';
import RadioCheckedIcon from '../../assets/icons/radio_button_checked.svg';
import RadioUncheckedIcon from '../../assets/icons/radio_button_unchecked.svg';

export const RadioCore = ({ option, value, onPress }) => {
  return (
    <RectButton onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        {value !== '' && value === option.value ? (
          <RadioCheckedIcon width={24} height={24} />
        ) : (
          <RadioUncheckedIcon width={24} height={24} />
        )}
        <Text variant="label" style={{ marginHorizontal: 10 }}>
          {option.text}
        </Text>
      </View>
    </RectButton>
  );
};

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
