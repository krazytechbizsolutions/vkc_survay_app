import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, ViewPropTypes } from 'react-native';
import TextEle from '@components/TextEle';
import { getIn } from 'formik';
import Text from '../Text/Text';
import styles from './style';

const index = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  inputStyle,
  innerRef,
  label,
  editable,
  question,
  disable,
  isRequired,
  isSubLoop,
  ...props
}) => {
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorMsg = touch && error ? error : null;

 const resetOtherValues = (currentval) => {
    setFieldValue("subLoopSlider", "");

    if(currentval === "subLoopText")
    {
      setFieldValue("subLoopFeedbackText", "");
      setFieldValue("subLoopIntegerText", "");
    }
    else if(currentval === "subLoopIntegerText")
    {
      setFieldValue("subLoopFeedbackText", "");
      setFieldValue("subLoopText", "");
    }
    else if(currentval === "subLoopFeedbackText")
    {
      setFieldValue("subLoopIntegerText", "");
      setFieldValue("subLoopText", "");
    }
  }

  return (
    <View>
      <TextEle variant="title" style={{ marginBottom: 10 }}>
        {question}
      </TextEle>
      {label && (
        <Text variant="label">
          {label}
          {!!isRequired && <Text variant="error"> * </Text>}
        </Text>
      )}
      {errorMsg && <Text variant="error">{errorMsg}</Text>}
      <TextInput
        {...props}
        ref={innerRef}
        style={[styles.textInput, inputStyle, errorMsg ? styles.errorBorder : {}]}
        onChangeText={itemValue => {
          if(!isSubLoop)
          {
            resetOtherValues(name);
          }
          
          setFieldValue(name, itemValue);
        }}
        onBlur={() => setFieldTouched(name)}
        value={`${value || ''}`}
        editable={editable || !disable}
        autoCapitalize="none"
      />
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
