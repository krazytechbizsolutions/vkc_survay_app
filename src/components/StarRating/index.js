/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect,useState } from 'react';
import { View,ScrollView } from 'react-native';
import { Rating } from 'react-native-ratings';
import SingleSelectRadio from '@components/SingleSelectRadio';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableList from '@components/VKCDraggableList';
import TextInput from '../../components/TextInput/TextInput';
import SliderQuestion from '@components/SliderQuestion';
import { Formik, Field, FieldArray } from 'formik';


const StarRating = ({
  field: { name, value },
  form: { touched, errors, setFieldValue,values },
  data,
  options,
  question,
}) => 
 
  {
    const [rate,setRating]=useState(0)

    useEffect(() =>{
      setRating(value)
    },[])

    const setting=(r)=>{
      let rate = parseFloat((Math.round(r * 2) / 2).toFixed(1))
      setRating(rate)
      setFieldValue("subLoopFeedbackText", "");
      setFieldValue("subLoopIntegerText", "");
      setFieldValue("subLoopText", "");
      setFieldValue("subLoopMultiSelect", "");
      setFieldValue("subLoopSlider", "");
      setFieldValue('starRatingMainField', options.filter(x => parseFloat(x.optionName) === rate))
      setFieldValue(name, rate)
    }

    return(
      <ScrollView style={{width:'100%'}}>
        <View style={{ flex: 1 }}>
          <TextEle variant="title" style={{ marginBottom: 10 }}>
            {question}
          </TextEle>
          <View style={{ marginTop: 30, margin: 10, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Rating
                type="custom"
                ratingImage={require('../../assets/Logo/star.png')}
                ratingColor="red"
                ratingBackgroundColor="#fff"
                onFinishRating={setting}
                showRating={true}
                fractions={1}
                startingValue={value || 0}
                style={{ paddingVertical: 10 }}
                ratingCount={data.Max_Limit__c}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
              {touched[name] && errors[name] && (
                <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
                  {errors[name]}
                </TextEle>
              )}
            
            </View>
          </View>


          {options ?
              <View style={{width:'100%',marginTop:25}}>
                    {
                      options.map((res)=>{ 
                          if(parseFloat(res.optionName) === rate){
                            if(res.loopingQtnType === 'Multi Select')
                            {
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
                            else if(res.loopingQtnType === 'Single Select'){
                              return(
                                <Field
                                    name="subLoopSingleSelect"
                                    component={SingleSelectRadio}
                                    data={res.subOrLoopingQtnOptions}
                                    value={values.subLoopSingleSelect}
                                    valueField="Id"
                                    textField="Detailed_Survey_Option_Name__c"
                                    question={res.loopingQtnName}
                                    validate={val => {
                                      if (!val) {
                                        return 'Please Enter Field Value';
                                      }
                                      return '';
                                    }}
                                  />
                              )
                        }
                        else if(res.loopingQtnType === 'Single Select List')
                        {
                          return(
                            <Field
                                name="subLoopSingleSelectList"
                                component={SingleSelectRadio}
                                data={res.subOrLoopingQtnOptions}
                                value={values.subLoopSingleSelectList}
                                valueField="Id"
                                textField="Detailed_Survey_Option_Name__c"
                                question={res.loopingQtnName}
                                validate={val => {
                                  if (!val) {
                                    return 'Please Enter Field Value';
                                  }
                                  return '';
                                }}
                              />
                          )
                        }
                        else if(res.typeloopingQtnType === 'Feedback')
                          {
                            return(
                            <Field
                              component={TextInput}
                              data={res.subOrLoopingQtnOptions}
                              multiline={true}
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
                          else if(res.loopingQtnType === 'Integer Enter Question')
                          {
                            return(
                              <Field
                                component={TextInput}
                                data={res.subOrLoopingQtnOptions}
                                keyboardType="number-pad"
                                multiline={false}
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
                          else if(res.loopingQtnType === 'Text')
                          {
                            return (
                              <Field
                                component={TextInput}
                                data={res.subOrLoopingQtnOptions}
                                inputStyle={{ minHeight: 200 }}
                                name= 'subLoopText'
                                multiline={false}
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
                          else if(res.loopingQtnType === 'Ordering Question'){
                           
                            return (  
                                <Field
                                  component={VKCDraggableList}
                                  name="subLoopOrder"
                                  data={res.subOrLoopingQtnOptions}
                                  value={values.subLoopOrder}
                                  valueField="Id"
                                  textField="Detailed_Survey_Option_Name__c"
                                  question={res.loopingQtnName}
                                  isSubLoop={true}
                                  validate={value => {
                                    if (!value || value.length === 0) {
                                      return 'Need To Prioritize atleast one value';
                                    }
                                    return '';
                                  }}
                                />
                              )
                          }
                      }
                    })
                  }
              </View>
              :null
                
              }
        </View>
      </ScrollView>
      );
  } 

export default StarRating;
