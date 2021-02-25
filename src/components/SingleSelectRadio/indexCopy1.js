import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import { Field } from 'formik';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const SingleSelectRadio = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched, values },
  data,
  valueField,
  textField,
  placeholder = 'Please select value',
  question,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const onSelectValue = item => {
    setIsVisible(false);
    setFieldValue(name, item);
    if (name !== 'childField') {
      setFieldValue('childField', '');
    }
  };

  const errorStyle = touched[name] && errors[name] ? { borderColor: 'red' } : {};

  return (
    <>
      <TextEle variant="title" style={{ marginBottom: 10 }}>
        {question}
      </TextEle>
      <RectButton
        onPress={() => {
          setIsVisible(true);
          setFieldTouched(name, true);
        }}>
        <View pointerEvents="none">
          <TextInput
            style={[styles.textInput, errorStyle]}
            value={value ? value[textField] : ''}
            placeholder={placeholder}
            editable={false}
          />
          <Icon
            name="caret-down-outline"
            style={{ position: 'absolute', right: 10, top: 7 }}
            size={24}
            color="red"
          />
        </View>
      </RectButton>
      {touched[name] && errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
          {errors[name]}
        </TextEle>
      )}
      <Modal
        isVisible={isVisible}
        style={{ backgroundColor: '#fff', margin: 0 }}
        onRequestClose={() => setIsVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
            )}
            renderItem={({ item }) => (
              <RadioCore
                key={item.id}
                option={{ text: item[textField], value: item[valueField] }}
                value={value[valueField]}
                onPress={() => onSelectValue(item)}
              />
            )}
            keyExtractor={item => `${item.Id}`}
          />
        </SafeAreaView>
      </Modal>
      {value?.subOrLoopingQtnOptions?.length > 1 && !!values[name] && (
        <Field
          name="childField"
          component={SingleSelectRadio}
          data={value.subOrLoopingQtnOptions}
          value={values.childField}
          valueField="Id"
          textField="Detailed_Survey_Option_Name__c"
          question={value.loopingQtnName}
          validate={val => {
            if (!val) {
              return 'Please Enter Field Value';
            }
            return '';
          }}
        />
      )}
      {value?.subOptions?.length > 1 && !!values[name] && (
        <Field
          name="childField"
          component={SingleSelectRadio}
          data={value.subOptions}
          value={values.childField}
          valueField="Id"
          textField="Detailed_Survey_Option_Name__c"
          question={value.loopingQtnName}
          validate={val => {
            if (!val) {
              return 'Please Enter Field Value';
            }
            return '';
          }}
        />
      )}
    </>
  );
};

export default SingleSelectRadio;