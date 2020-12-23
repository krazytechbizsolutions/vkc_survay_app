/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, ViewPropTypes, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Text from '../Text/Text';
import styles from './styles';
import commonStyle from '../../commonStyle';
import Cancel from '../../assets/icons/cancel.svg';
import MultiSelectModel from './MultiSelectModel';

const Select = ({
  field: { name, value },
  form: { values, touched, errors, setFieldValue, setFieldTouched },
  // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  inputStyle,
  innerRef,
  options,
  label,
  mapField,
  disable,
  isRequired,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [selectList, setSelectList] = useState([]);
  const errorMsg = touched[name] && errors[name];

  const onSelect = item => {
    setFieldValue(name, item);
    setOpen(!open);
  };
  const closeModal = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (mapField && !values[mapField]) {
      setFieldValue(name, '');
    } else if (value && value.length > 0 && values[mapField] === value[0].mapField) {
      setFieldValue(name, value);
    } else {
      setFieldValue(name, '');
    }
    // setFieldValue(name, value);
    if (mapField === undefined) {
      setSelectList(options);
    } else {
      setSelectList(options.filter(x => x.mapField === values[mapField]));
    }
  }, [mapField, name, options, setFieldValue, value, values]);

  return (
    <View style={styles.selectContainer}>
      {label && (
        <Text variant="label">
          {label}
          {!!isRequired && <Text variant="error"> * </Text>}
        </Text>
      )}
      <RectButton onPress={() => !disable && setOpen(!open)}>
        <View pointerEvents="none">
          <TextInput
            {...props}
            ref={innerRef}
            style={[styles.textInput, inputStyle, errorMsg ? styles.errorBorder : {}]}
            value=""
            editable={false}
            onFocus={() => setOpen(!open)}
            autoCapitalize="none"
          />
          {errorMsg && <Text variant="error">{errorMsg}</Text>}
        </View>
      </RectButton>
      {!!value && value.length > 0 && (
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            marginVertical: 4,
          }}>
          {value.map(x => (
            <View
              key={x.value}
              style={{
                flexShrink: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#777777',
                borderRadius: 20,
                marginVertical: 4,
                marginRight: 2,
                paddingHorizontal: 5,
                paddingVertical: 4,
              }}>
              <Text style={{ flexShrink: 1 }}>{x.text}</Text>
              {!disable && (
                <BorderlessButton
                  style={{ marginLeft: 10 }}
                  onPress={() =>
                    setFieldValue(
                      name,
                      value.filter(item => item.value !== x.value),
                    )
                  }>
                  <Cancel width={24} height={24} />
                </BorderlessButton>
              )}
            </View>
          ))}
        </View>
      )}
      <Modal
        isVisible={open}
        style={styles.modal}
        animationIn="slideInRight"
        animationOut="slideOutRight">
        <SafeAreaView style={[commonStyle.flex, commonStyle.bgColor]}>
          <MultiSelectModel
            options={selectList}
            selectedItems={value}
            onSelect={onSelect}
            closeModal={closeModal}
          />
        </SafeAreaView>
      </Modal>
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
