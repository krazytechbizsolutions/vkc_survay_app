import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import { Field } from 'formik';
import React, { useState } from 'react';
import { FlatList, View,ScrollView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableLoop from '@components/VKCDraggableList';
import TextInput from '../../components/TextInput/TextInput';
import SliderQuestion from '@components/SliderQuestion';
import styles from './styles';


const SingleSelectRadio = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched, values },
  data,
  valueField,
  textField,
  placeholder = 'Please select value',
  question,
  extraData
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const onSelectValue = item => {
    setIsVisible(false);
    setFieldValue(name, item);
    console.log("32",name,item)
    if (name !== 'childField') {
      setFieldValue('childField', '');
    }
  };

  const errorStyle = touched[name] && errors[name] ? { borderColor: 'red' } : {};

  return (
    <ScrollView style={{width:'100%'}}>
      <TextEle variant="title" style={{ marginBottom: 10 }}>
        {question}
      </TextEle>
      <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={data}
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
     
      {touched[name] && errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
          {errors[name]}
        </TextEle>
      )}
      <Modal
        isVisible={isVisible}
        style={{ backgroundColor: '#fff', margin: 0 }}
        onRequestClose={() => setIsVisible(false)}>
       
      </Modal>

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


     
    </ScrollView>
  );
};

export default SingleSelectRadio;