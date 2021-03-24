/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect, useRef } from 'react';
import { FlatList, Image, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import RadioCheckedIcon from '../../assets/icons/radio_button_checked.svg';
import RadioUncheckedIcon from '../../assets/icons/radio_button_unchecked.svg';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableLoop from '@components/VKCDraggableList';
import TextInput from '../../components/TextInput/TextInput';
import SliderQuestion from '@components/SliderQuestion';
import SingleSelectRadio from '@components/SingleSelectRadio';
import { Field } from 'formik';

const SelectImage = ({
  field: { name, value },
  form: { touched, errors, setFieldValue,values },
  data,
  valueField,
  imageField,
  textField,
  question,
  extraData
}) => {
  const flastListRef = useRef();
  const onSelectValue = item => {
    // setFieldTouched(name, true);
    setFieldValue(name, item);
  };

  useEffect(() => {
    if (!!(touched[name] && errors[name]) && flastListRef.current) {
      flastListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [touched, errors, name]);

  return (
    <>
      <TextEle variant="title">{question}</TextEle>
      {touched[name] && errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
          {errors[name]}
        </TextEle>
      )}
      <FlatList
        ref={flastListRef}
        style={{ flex: 1 }}
        data={data}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
        )}
        renderItem={({ item }) => (
          <RectButton onPress={() => onSelectValue(item)}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
              {value && value[valueField] && value[valueField] === item[valueField] ? (
                <RadioCheckedIcon fill="red" width={24} height={24} />
              ) : (
                <RadioUncheckedIcon fill="red" width={24} height={24} />
              )}
              <View style={{ paddingHorizontal: 20 }}>
                {item[imageField] && (
                  <Image
                    style={{ height: 150, width: 150 }}
                    source={{
                      uri: item[imageField],
                    }}
                  />
                )}
                {item[textField] && (
                  <TextEle style={{ textAlign: 'center', paddingVertical: 10 }}>
                    {item[textField]}
                  </TextEle>
                )}
              </View>
            </View>
          </RectButton>
        )}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
      />

            {value?.isLoopingQtn ?
              <View style={{width:'100%',marginTop:25}}>
                    {
                      extraData.map((res)=>{ 
                          if(res.loopingQtnType === 'Multi Select' && value.loopingQtnType === 'Multi Select'){
                            return(
                              <Field
                                  data={res.subOrLoopingQtnOptions}
                                  valueField="Id"
                                  textField="Detailed_Survey_Option_Name__c"
                                  component={MultiSelection}
                                  name="subLoopMultiSelect"
                                  value={values.subLoopMultiSelect}
                                  question={res.loopingQtnName}
                                  isSubLoop={true}
                                  validate={value => {
                                    if (!value || value.length === 0) {
                                      return 'Please Enter Field Value';
                                    }
                                    return '';
                                  }}
                              />
                            )
                          } 
                          else if(res.loopingQtnType === 'Feedback' && value.loopingQtnType === 'Feedback')
                          {
                            return(
                            <Field
                              component={TextInput}
                              data={res.subOrLoopingQtnOptions}
                              multiline={res.loopingQtnType === 'Feedback' ?  true : false}
                              inputStyle={{ minHeight: 200 }}
                              name="subLoopFeedbackText"
                              value={values.subLoopFeedbackText}
                              question={res.loopingQtnName}
                              isSubLoop={true}
                              validate={value => {
                                if (!value) {
                                  return 'Please Enter Field Value';
                                }
                                return '';
                              }}
                            />
                            )
                          }
                          else if(res.loopingQtnType === 'Integer Enter Question' && value.loopingQtnType === 'Integer Enter Question')
                          {
                            return(
                              <Field
                                component={TextInput}
                                data={res.subOrLoopingQtnOptions}
                                keyboardType="number-pad"
                                inputStyle={{ minHeight: 200 }}
                                name='subLoopIntegerText'
                                value={values.subLoopIntegerText}
                                question={res.loopingQtnName}
                                isSubLoop={true}
                                validate={value => {
                                  if (!value) {
                                    return 'Please Enter Field Value';
                                  }
                                  return '';
                                }}
                              />
                            )
                          }
                          else if(res.loopingQtnType === 'Text' && value.loopingQtnType === 'Text')
                          {
                            return (
                              <Field
                                component={TextInput}
                                data={res.subOrLoopingQtnOptions}
                                inputStyle={{ minHeight: 200 }}
                                name= 'subLoopText'
                                value={values.subLoopText}
                                question={res.loopingQtnName}
                                isSubLoop={true}
                                validate={value => {
                                  if (!value) {
                                    return 'Please Enter Field Value';
                                  }
                                  return '';
                                }}
                              />
                            )
                          }
                          else if(res.loopingQtnType === 'Slider' && value.loopingQtnType === 'Slider'){
                            return(
                              <Field
                                  component={SliderQuestion}
                                  data={res}
                                  name="subLoopSlider"
                                  value={values.subLoopSlider}
                                  question={res.loopingQtnName}
                                  isSubLoop={true}
                                  validate={value => {
                                    if (!value) {
                                      return 'Please Enter Field Value';
                                    }
                                    return '';
                                  }}
                                />
                              )
                          }
                          else if((res.loopingQtnType === 'Single Select List' && value.loopingQtnType === 'Single Select List') || (res.loopingQtnType === 'Single Select' && value.loopingQtnType === 'Single Select') )
                          {
                            if(value?.subOrLoopingQtnOptions?.length > 1 && !!values[name])  
                            return(
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
                            )
                          }
                        })
                      }
              </View>
              :null
                
              }
    </>
  );
};

export default SelectImage;
