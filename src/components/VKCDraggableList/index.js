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

const VKCDraggableList = ({ field: { name, value }, form: { setFieldValue,values }, data, question,isSubLoop }) => {
  const [temp, setTemp] = useState([]);
  const formRef = useRef();

  useEffect(() => {
    setFieldValue(name, data);
    console.log(isSubLoop)
  }, []);

  const onSelect = item => {
    let index;
    console.log("23",isSubLoop)
    if(isSubLoop){
      index = temp.findIndex(x => x.Id === item.Id);
    }
    else{
      index = temp.findIndex(x => x.optionId === item.optionId);
    }
    
    console.log("24",index,temp);
    let arr = [];
    if (index === -1) {
      item.IsSelected = true;
      arr = [...temp, item];
    } else {
      delete item.IsSelected;
      arr = [...temp.slice(0, index), ...temp.slice(index + 1)];
    }
    let filteredStateData;
    // console.log("24",arr);
    if(isSubLoop){
      filteredStateData = value.filter(x => !arr.some(y => y.Id === x.Id));
    }
    else{
      filteredStateData = value.filter(x => !arr.some(y => y.optionId === x.optionId));
    }
    
    setFieldValue(
      name,
      [...arr, ...filteredStateData].map((x, i) => ({ ...x, seqNo: i + 1 })),
    );
    setTemp(arr);
  };

  return (
    <>
      <View>
        <TextEle>{question}</TextEle>
      </View>
      {!!value && value.length > 0 && (
        <FlatList
          data={value}
          renderItem={({ item, index }) => (
            <RectButton
              onPress={() => onSelect(item)}
              style={{
                backgroundColor: isSubLoop ? temp.some(x => x.Id === item.Id) ? 'red' : '#fff':temp.some(x => x.optionId === item.optionId) ? 'red' : '#fff',

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
                style={{ color: isSubLoop ? temp.some(x => x.Id === item.Id) ? 'white' : 'black' : temp.some(x => x.optionId === item.optionId) ? 'white' : 'black' }}>
                {index + 1}
              </TextEle>
              <TextEle
                variant="body1"
                style={{ color: isSubLoop ? temp.some(x => x.Id === item.Id) ? 'white' : 'black' : temp.some(x => x.optionId === item.optionId) ? 'white' : 'black' }}>
                {isSubLoop ? item.Detailed_Survey_Option_Name__c : item.optionName }
              </TextEle>
            </RectButton>
          )}
          keyExtractor={(item,index) => {
            return item.Id
          }}
        />
      )   
      }

      {temp.some((x) => x.isLoopingQtn) ?
      <View style={{width:'100%',marginTop:25}}>
              {
                temp.map((loopingQuestion) => { 
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
                })  
              }              
      </View>
      :null
        
      }
    </>
  );
};

export default VKCDraggableList;
