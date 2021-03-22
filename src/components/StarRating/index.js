/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect,useState } from 'react';
import { View,ScrollView } from 'react-native';
import { Rating } from 'react-native-ratings';
import SingleSelectRadio from '@components/SingleSelectRadio';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableLoop from '@components/VKCDraggableList';
import TextInput from '../../components/TextInput/TextInput';
import SliderQuestion from '@components/SliderQuestion';
import { Formik, Field, FieldArray } from 'formik';


const StarRating = ({
  field: { name, value },
  form: { touched, errors, setFieldValue,values },
  data,
  noOfStars,
  extraData,
  question,
}) => 
 
  {

    useEffect(() => {
      console.log("22 Star rating",values);
    },[])

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
                onFinishRating={rating => setFieldValue(name, rating)}
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


          {!data.Is_Looping_Question__c ?
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
        </View>
      </ScrollView>
      );
  } 

export default StarRating;
