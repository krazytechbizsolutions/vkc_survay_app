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

      {value?.Is_Looping_Question__c ?
              <View style={{width:'100%',marginTop:25}}>
                    {
                      extraData.map((res)=>{ 
                          if(res.loopingQtnType === 'Multi Select'){
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
                          else if(res.loopingQtnType === 'Feedback' || 
                                  res.loopingQtnType === 'Integer Enter Question' ||
                                  res.loopingQtnType === 'Text' )
                          {
                            return(
                            <Field
                              component={TextInput}
                              data={res.subOrLoopingQtnOptions}
                              keyboardType={res.loopingQtnType === 'Integer Enter Question' ? "number-pad":""}
                              multiline={res.loopingQtnType === 'Feedback' ?  true : false}
                              inputStyle={{ minHeight: 200 }}
                              name={res.loopingQtnType === 'Feedback' ? "subLoopFeedbackText" :res.loopingQtnType === 'Integer Enter Question' ? "subLoopIntegerText" : res.loopingQtnType === 'Text' ? "subLoopText":null  }
                              value={res.loopingQtnType === 'Feedback' ? values.subLoopFeedbackText :res.loopingQtnType === 'Integer Enter Question' ? values.subLoopIntegerText : res.loopingQtnType === 'Text' ? values.subLoopText :null}
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
                          else if(res.loopingQtnType === 'Slider'){
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
                        })
                      }
              </View>
              :null
                
              }


      {/* {value?.subOrLoopingQtnOptions?.length > 1 && !!values[name] && (
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
      )} */}
    </ScrollView>
  );
};

export default SingleSelectRadio;