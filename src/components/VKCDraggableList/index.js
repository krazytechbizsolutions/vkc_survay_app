/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect, useState,useRef } from 'react';
import { FlatList, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import SingleSelectRadio from '@components/SingleSelectRadio';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableLoop from '@components/VKCDraggableList';
import TextInput from '../../components/TextInput/TextInput';
import SliderQuestion from '@components/SliderQuestion';
import { Formik, Field, FieldArray } from 'formik';

const VKCDraggableList = ({ 
  field: { name, value }, 
  form: { touched, errors, setFieldValue, setFieldTouched, values }, 
  data, 
  valueField,
  textField,
  question,
  isSubLoop
}) => {
  const errorMsg = touched[name] && errors[name];
  const formRef = useRef();

  useEffect(() => {
    if(!value){
      setFieldValue(name, data);
    }
  }, [])

  const resetOtherValues = () => {
    
   value = value.map((x)=>{
      if(!x.isSelected){
        if(x.loopingQtnType === 'Ordering Question')
        {
          x.subOrLoopingQtnOptions = x.subOrLoopingQtnOptions.map(result => {
              result.isSelected = false;
              return result;
            })  
            
            setFieldValue("subLoopOrder","" );
        }
        else if(x.loopingQtnType === 'Feedback')
        {
          setFieldValue("subLoopFeedbackText", "");
        }
        else if(x.loopingQtnType === 'Integer Enter Question')
        {
          setFieldValue("subLoopIntegerText", "");
        }
        else if(x.loopingQtnType === 'Text')
        {
          setFieldValue("subLoopText", "");
        }
        else if(x.loopingQtnType === 'Multi Select')
        {
          setFieldValue("subLoopMultiSelect", "");
        }
        else if(x.loopingQtnType === 'Slider')
        {
          setFieldValue("subLoopSlider", "");
        }
        else if(x.loopingQtnType === 'Single Select')
        {
           setFieldValue("subLoopSingleSelect", "");
        }
        else if(x.loopingQtnType === 'Single Select List')
        {
          setFieldValue("subLoopSingleSelectList", "");
        }
      }
      return x;
    })
  }


  const onSelect = (item, index) => {    
    value[index].isSelected = !item.isSelected;
        
    let selectedData = value.filter(x => x.isSelected);
    let nonSelectedData = data.filter(x => !(value || []).some(y => y[valueField] === x[valueField] && y.isSelected)).map(x => { x.isSelected = false; return x;});
    setFieldValue(
      name, 
      [...selectedData, ...nonSelectedData].map((x, i) => ({ ...x, seqNo: i + 1 })),
    );
    resetOtherValues()
  };

  return (
    <>
      <View>
        <TextEle>{question}</TextEle>
        {errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
          {errors[name]}
        </TextEle>
      )}
      </View>
      {!!value && value.length > 0 && (
        <FlatList
          data={value}
          renderItem={({ item, index }) => (
            <RectButton
              onPress={() => onSelect(item, index)}
              style={{
                backgroundColor: item.isSelected ? 'red' : 'white',
                margin: 5,
                padding: 10,
                shadowColor: '#000',
                borderRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
              }}>
              <TextEle
                variant="body1"
                style={{ color: item.isSelected ? 'white' : 'black' }}>
                {index + 1}
              </TextEle>
              <TextEle
                variant="body1"
                style={{ color: item.isSelected ? 'white' : 'black' }}>
                { item[textField] }
              </TextEle>
            </RectButton>
          )}
          keyExtractor={(item,index) => {
            return item.Id
          }}
        />
      )   
      }

      {(value || []).some((x) => x.isSelected && x.isLoopingQtn) ?
      <View style={{width:'100%',marginTop:25}}>
              {
                value.filter((x) => x.isSelected).map((loopingQuestion) => { 
                  if(loopingQuestion.loopingQtnType === 'Slider') { 
                    return(
                      <Field
                          component={SliderQuestion}
                          data={loopingQuestion}
                          name="subLoopSlider"
                          value={values.subLoopSlider}
                          question={loopingQuestion.loopingQtnName}
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
                    else if(loopingQuestion.loopingQtnType === 'Single Select'){
                          return(
                            <Field
                                name="subLoopSingleSelect"
                                component={SingleSelectRadio}
                                data={loopingQuestion.subOrLoopingQtnOptions}
                                value={values.subLoopSingleSelect}
                                valueField="Id"
                                textField="Detailed_Survey_Option_Name__c"
                                isSubLoop={true}
                                question={loopingQuestion.loopingQtnName}
                                validate={val => {
                                  if (!val) {
                                    return 'Please Enter Field Value';
                                  }
                                  return '';
                                }}
                              />
                          )
                    }
                    else if(loopingQuestion.loopingQtnType === 'Single Select List')
                    {
                      return(
                        <Field
                            name="subLoopSingleSelectList"
                            component={SingleSelectRadio}
                            data={loopingQuestion.subOrLoopingQtnOptions}
                            value={values.subLoopSingleSelectList}
                            valueField="Id"
                            textField="Detailed_Survey_Option_Name__c"
                            isSubLoop={true}
                            question={loopingQuestion.loopingQtnName}
                            validate={val => {
                              if (!val) {
                                return 'Please Enter Field Value';
                              }
                              return '';
                            }}
                          />
                      )
                    }
                    else if(loopingQuestion.loopingQtnType === 'Multi Select')
                    {
                      return(
                        <Field
                            data={loopingQuestion.subOrLoopingQtnOptions}
                            valueField="Id"
                            textField="Detailed_Survey_Option_Name__c"
                            component={MultiSelection}
                            name="subLoopMultiSelect"
                            value={values.subLoopMultiSelect}
                            question={loopingQuestion.loopingQtnName}
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
                    else if(loopingQuestion.loopingQtnType === 'Feedback')
                    {
                      return(
                      <Field
                        component={TextInput}
                        data={loopingQuestion.subOrLoopingQtnOptions}
                        multiline={true}
                        inputStyle={{ minHeight: 200 }}
                        name="subLoopFeedbackText"
                        value={values.subLoopFeedbackText}
                        question={loopingQuestion.loopingQtnName}
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
                    else if(loopingQuestion.loopingQtnType === 'Integer Enter Question')
                    {
                      return(
                        <Field
                          component={TextInput}
                          data={loopingQuestion.subOrLoopingQtnOptions}
                          keyboardType="number-pad"
                          multiline={false}
                          inputStyle={{ minHeight: 200 }}
                          name='subLoopIntegerText'
                          value={values.subLoopIntegerText}
                          question={loopingQuestion.loopingQtnName}
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
                    else if(loopingQuestion.loopingQtnType === 'Text')
                    {
                      return (
                        <Field
                          component={TextInput}
                          data={loopingQuestion.subOrLoopingQtnOptions}
                          inputStyle={{ minHeight: 200 }}
                          name= 'subLoopText'
                          multiline={false}
                          value={values.subLoopText}
                          question={loopingQuestion.loopingQtnName}
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
                    else if(loopingQuestion.loopingQtnType === 'Ordering Question'){
                      // console.log("198",JSON.stringify(value))
                      // console.log("199",JSON.stringify(res))  
                      return (  
                          <Field
                            component={VKCDraggableList}
                            name="subLoopOrder"
                            data={loopingQuestion.subOrLoopingQtnOptions}
                            value={values.subLoopOrder}
                            valueField="Id"
                            textField="Detailed_Survey_Option_Name__c"
                            question={loopingQuestion.loopingQtnName}
                            isSubLoop={true}
                            validate={value => {
                              if (!value || value.filter(v => v.isSelected).length === 0) {
                                return 'Need To Prioritize atleast one value';
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

export default VKCDraggableList;
