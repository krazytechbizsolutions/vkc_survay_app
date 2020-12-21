import React, { useState } from 'react';
import { View, TextInput, DatePickerAndroid } from 'react-native';
import Text from '../text/Text';
import crashlytics from '@react-native-firebase/crashlytics';
import { OS } from '../../utils';
import { format } from 'date-fns';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { getIn } from 'formik';
import DatePickerModal from './DatePickerModal';
import Calendar from '../../assets/icons/calendar.svg';
import styles from './styles';

const Index = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  inputStyle,
  innerRef,
  label,
  disable,
  isRequired,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);

  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorMsg = touch && error ? error : null;

  const renderDatePicker = async () => {
    try {
      const options = {
        date: new Date(),
        minDate: new Date(),
        mode: 'calendar',
      };
      const { action, year, month, day } = await DatePickerAndroid.open(options);
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        setFieldValue(name, new Date(year, month, day));
      }
    } catch (err) {
      crashlytics().recordError(err);
      // eslint-disable-next-line no-alert
      alert(`Cannot open date picker: ${err.message}`);
    }
  };

  const openDatePicker = () => {
    if (!disable) {
      if (OS === 'ios') {
        setShowModal(true);
      } else {
        renderDatePicker();
      }
    }
  };

  return (
    <View style={styles.selectContainer}>
      {label && (
        <Text variant="label">
          {label}
          {!!isRequired && <Text variant="error"> * </Text>}
        </Text>
      )}
      <RectButton onPress={openDatePicker}>
        <View>
          <View pointerEvents="none">
            <TextInput
              {...props}
              ref={innerRef}
              style={[styles.textInput, inputStyle, errorMsg ? styles.errorBorder : {}]}
              value={value ? format(value, 'dd/MM/yyyy') : ''}
              editable={false}
              onFocus={openDatePicker}
              autoCapitalize="none"
            />
          </View>
          <BorderlessButton
            style={[styles.textInputCancelStyle, { top: 8 }]}
            onPress={openDatePicker}
          >
            <Calendar width={24} height={24} />
          </BorderlessButton>
        </View>
      </RectButton>
      {errorMsg && <Text variant="error">{errorMsg}</Text>}
      {OS === 'ios' && (
        <DatePickerModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSelect={val => {
            setShowModal(false);
            setFieldValue(name, val);
          }}
        />
      )}
    </View>
  );
};

export default Index;
