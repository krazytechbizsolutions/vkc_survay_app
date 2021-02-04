import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, ViewPropTypes } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { getIn } from 'formik';

import Text from '../Text/Text';
import styles from './styles';
import Cancel from '../../assets/icons/cancel.svg';
import commonStyle from '../../commonStyle';
import SelectModel from './SelectModel';

function getValue(obj, path) {
  if (!path) {
    return obj;
  }
  const properties = path.split('.');
  return getValue(obj[properties.shift()], properties.join('.'));
}
const Select = ({
  field: { name, value },
  form: { values, touched, errors, setFieldValue, setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  inputStyle,
  innerRef,
  options,
  label,
  mapField,
  disable,
  containerStyle = {},
  isRequired,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [selectList, setSelectList] = useState([]);

  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorMsg = touch && error ? error : null;

  const onSelect = item => {
    setFieldTouched(name);
    setFieldValue(name, item.value);
    setText(item.text);
    setOpen(!open);
  };
  const closeModal = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (mapField) {
      console.warn(name, value);
      const selectedValue = options.find(
        x => x.value === value && x.mapField === getValue(values, mapField),
      );
      if (!getValue(values, mapField) || !selectedValue) {
        setFieldValue(name, '');
        setText('');
      }
      if (selectedValue) {
        setText(selectedValue.text);
      }
    } else {
      const selectedValue = options.find(x => x.value === value);
      if (selectedValue) {
        // setFieldValue(name, value);
        setText(selectedValue.text);
      }
    }
  }, [mapField, name, options, setFieldValue, value, values]);

  useEffect(() => {
    if (mapField === undefined) {
      setSelectList(options);
    } else {
      setSelectList(options.filter(x => x.mapField === getValue(values, mapField)));
    }
  }, [mapField, options, values]);

  return (
    <View style={[styles.selectContainer, containerStyle]}>
      {label && (
        <Text variant="label">
          {label}
          {!!isRequired && <Text variant="error"> * </Text>}
        </Text>
      )}
      <RectButton onPress={() => !disable && setOpen(!open)}>
        <>
          <View pointerEvents="none">
            <TextInput
              {...props}
              ref={innerRef}
              style={[styles.textInput, inputStyle, errorMsg ? styles.errorBorder : {}]}
              value={text}
              editable={false}
              onFocus={() => setOpen(!open)}
              autoCapitalize="none"
            />
          </View>
          {!!text && !disable && (
            <BorderlessButton
              style={[styles.textInputCancelStyle, { top: 8 }]}
              onPress={() => {
                setFieldValue(name, '');
                setText('');
              }}>
              <Cancel width={24} height={24} />
            </BorderlessButton>
          )}
        </>
      </RectButton>
      <Modal
        isVisible={open}
        style={styles.modal}
        animationIn="slideInRight"
        animationOut="slideOutRight">
        <SafeAreaView style={[commonStyle.flex, commonStyle.bgColor]}>
          <SelectModel options={selectList} onSelect={onSelect} closeModal={closeModal} />
        </SafeAreaView>
      </Modal>
      {errorMsg && <Text variant="error">{errorMsg}</Text>}
    </View>
  );
};

Select.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  inputRef: PropTypes.func,
  inputStyle: ViewPropTypes.style,
};

Select.defaultProps = {
  inputStyle: {},
  inputRef: () => {},
};

export default memo(Select);
