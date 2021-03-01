/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import React, { useState,useContext,useEffect,useRef } from 'react';
import { SafeAreaView, Text, ScrollView, View, Alert, Pressable } from 'react-native';
import VKCButton from '@components/VKCButton';
import SingleSelectRadio from '@components/SingleSelectRadio';
import Tabular from '@components/Tabular';
import MultiSelection from '@components/MultiSelection';
import { format } from 'date-fns';
import VKCDraggableList from '@components/VKCDraggableList';
import VKCMediaPicker from '@components/VKCMediaPicker';
import SelectGroup from '@components/SelectGroup';
import SliderQuestion from '@components/SliderQuestion';
import StarRating from '@components/StarRating';
import { Formik, Field, FieldArray } from 'formik';
import SelectImage from '@components/SelectImage';
import TextEle from '@components/TextEle';
import { SurveyContext } from 'src/context/surveyContext';
import { ImageContext } from 'src/context/imgContext';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '@utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInput from '../../components/TextInput/TextInput';
import CustomMultiText from '@components/CustomMultiText';
import RNFS from 'react-native-fs';

console.disableYellowBox = true;
let survey = []
let Images = []
console.log("survey",survey);
const SurveyQue = ({ navigation, route }) => {
  // const { colors } = useTheme();
  const { questions, firstQuestion, accId, surveyId, UserId } = route.params;
  const [question, ...restQuestions] = questions;
  const [SurveySubmit,setSurveySubmit]=useState(false);
  const [ImageSubmit,setImage]=useState(false);
 
  const formRef = useRef();

  const onSubmit = async selectedOptions => {
  
    const url = '/services/apexrest/SRVY_SvyCapture_API';
    const ImgAPI = '/services/apexrest/SRVY_SvyCaptureImage_API';
      const { sQuestion } = question;
      // console.log("110",sQuestion.Option_Type__c)
      const Sequence_No = sQuestion.Sequence_No__c
        ? {
            Sequence_No: sQuestion.Sequence_No__c,
          }
        : {};

      let answer = {};
      if (
        sQuestion.Option_Type__c === 'Integer Enter Question' ||
        sQuestion.Option_Type__c === 'Text' ||
        sQuestion.Option_Type__c === 'Slider' ||
        sQuestion.Option_Type__c === 'Star Rating' ||
        sQuestion.Option_Type__c === 'Feedback' ||
        sQuestion.Option_Type__c === 'Coupon'
      ) {
        answer = {
          answer: selectedOptions.mainField,
        };
      }

      let selOptions = {};
      if (
        sQuestion.Option_Type__c === 'Single Select' ||
        sQuestion.Option_Type__c === 'Single Select List' ||
        sQuestion.Option_Type__c === 'Display' ||
        sQuestion.Option_Type__c === 'Stock' ||
        sQuestion.Option_Type__c === 'Performance In the Area' ||
        sQuestion.Option_Type__c === 'Salesman Commit' ||
        sQuestion.Option_Type__c === 'Special Efforts' 
      ) {
        let selectedSubOrLoopingQtnOptions = {};
        if (selectedOptions.childField && selectedOptions.mainField.isLoopingQtn) {
         
          selectedSubOrLoopingQtnOptions = {
            selectedSubOrLoopingQtnOptions: [
              {
                Id: selectedOptions.childField.Id,
                Sequence_No__c: selectedOptions.childField.Sequence_No__c,
              },
            ],
          };
        }



        selOptions = {
          selectedOptions: [
            {
              seqNo: selectedOptions.mainField.seqNo,
              optionId: selectedOptions.mainField.optionId,
              isLoopingQtn: selectedOptions.mainField.isLoopingQtn,
              loopingQtnId: selectedOptions.mainField.loopingQtnId,
              loopingQtnType: selectedOptions.mainField.loopingQtnType,
              ...selectedSubOrLoopingQtnOptions,
            },
          ],
        };
  
      } else if (
        sQuestion.Option_Type__c === 'Ordering Question' ||
        sQuestion.Option_Type__c === 'Multi Select'
      ) {
        selOptions = {
          selectedOptions: selectedOptions.mainField.map(x => ({
            seqNo: x.seqNo,
            optionId: x.optionId,
            isLoopingQtn: x.isLoopingQtn,
            loopingQtnId: x.loopingQtnId,
            loopingQtnType: x.loopingQtnType,
          })),
        };
      }
      else if (sQuestion.Option_Type__c === 'Single Select Group')
      {
        selOptions={
          selectedOptions:[]
        }

        selectedOptions.mainField.forEach((val,index) =>{
              selOptions.selectedOptions.push({
                seqNo: val.selectedOptions[0].seqNo, 
                optionId: val.selectedOptions[0].optionId,
                selectedSubOrLoopingQtnOptions: [
                  {
                    Id: val.selectedOptions[1].optionId,
                    Sequence_No__c: val.selectedOptions[1].seqNo
                  }
                ]
              })
          })   
      }
      else if (sQuestion.Option_Type__c === 'Multi Text') {
        selOptions = {
          selectedOptions: selectedOptions.mainField?.map((x, i) => ({
            seqNo: i + 1,
            answer: x.accId,
          })),
        };
      }
      else if(sQuestion.Option_Type__c === 'Tabular Question')
      {
        selOptions = {}
        let Options=[]
      
        selectedOptions.mainField.forEach((result,index) =>{
          Options.push({ 
              seqNo:result.seqNo,
              selectedSubOrLoopingQtnOptions:selectedOptions.childField[index]
            })
        })
        selOptions.selectedOptions = Options;
        
      }

      if(sQuestion.Option_Type__c === 'Upload Image for choosing an Option')
      {

        AsyncStorage.getItem(`IMG-${surveyId}-${accId}-${UserId}-${sQuestion.Id}`).then(res => {
              
          if(res !== null)
          {
            let ImgData = JSON.parse(res);
            console.log("266",`IMG-${surveyId}-${accId}-${UserId}-${sQuestion.Id}`,ImgData)
            ImgData.forEach((Img,index) => {
              let payload ={
                "surveyId": surveyId,
                "accountId": accId,
                "userId": UserId,
                "qtnId": sQuestion.Id,
                "Sequence_No": sQuestion.Sequence_No__c,
                "imageName": Img.fileName,
                "imageType": Img.type,
                "imageURL": Img.uri
              }
              Images.unshift(payload);
            })
             console.log("210",Images)
          }
          else{
            console.log("In Image Else")
            Images.unshift({});
          }
          console.log("217",Images)
        })
      }
      else
      {
        const data = {
          qtnId: sQuestion.Id,
          qtnType: sQuestion.Option_Type__c,
          ...Sequence_No,
          ...answer,
        };
  
        console.log("188",
          JSON.stringify({
            sQuestion: data,
            ...selOptions,
          }),
        );
        
        survey.unshift({
          sQuestion: data,
          ...selOptions,
        })
      }

      if (restQuestions.length === 0) {
        try {

          // console.log("In else")
          const data = await AsyncStorage.getItem('unSyncedQuestions');
          if (data) {
            let newData = await AsyncStorage.setItem(
              'unSyncedQuestions',
              JSON.stringify([
                ...JSON.parse(data),
                {
                  userId: UserId,
                  accountId: accId,
                  surveyId,
                  surveyDate: format(new Date(), 'yyyy-MM-dd'),
                  syncStatus: false,
                  Questions: survey,
                },
              ]),
            );

            // console.log("73",newData);
            
          } 
          else 
          {
           let newData = await AsyncStorage.setItem(
              'unSyncedQuestions',
              JSON.stringify([
                {
                  userId: UserId,
                  accountId: accId,
                  surveyId,
                  surveyDate: format(new Date(), 'yyyy-MM-dd'),
                  syncStatus: false,
                  Questions: survey,
                },
              ]),
            );

            // console.log("89",newData);
          }

          const netInfo = await NetInfo.fetch();
          if (netInfo.isConnected) {
            
            let AllQId=[];
            let ImgNames = [];
            let SubmitImage=true;

            let FinalSubmitSurvey = survey.filter((surveyQuestion)=>{
                if(AllQId.includes(surveyQuestion.sQuestion.qtnId)) {
                    return false;
                }
                else
                {
                  AllQId.push(surveyQuestion.sQuestion.qtnId);
                  return true;
                }
            })  

            FinalSubmitSurvey.reverse();
            console.log("Here 236",JSON.stringify({
              userId: UserId,
              accountId: accId,
              surveyId,
              surveyDate: format(new Date(), 'yyyy-MM-dd'),
              Questions: FinalSubmitSurvey,
            }))

            let FinalImages =Images.filter((val,index)=>{
                if(Object.keys(val).length === 0)
                {
                  return false;
                }
                else if(ImgNames.includes(val.imageName))
                {
                  return false;
                }
                else
                {
                  ImgNames.push(val.imageName)
                  return true;
                }
              })

             axios.post(url, [
              {
                userId: UserId,
                accountId: accId,
                surveyId,
                surveyDate: format(new Date(), 'yyyy-MM-dd'),
                Questions: FinalSubmitSurvey,
              },
            ]).then(result=>{
                if(result.data.status !== 'Success')
                {
                  //Submitting Images
                  // Remove Saved Tabular Data
                  console.log("290","Survey Submitted");
                  FinalImages.forEach((Img)=>{
                    RNFS.readFile(Img.imageURL, 'base64')
                    .then(res =>{
                        let SubmitImg={
                          "surveyId": surveyId,
                          "accountId": accId,
                          "userId": UserId,
                          "qtnId": Img.qtnId,
                          "Sequence_No": Img.Sequence_No,
                          "imageName": Img.imageName,
                          "imageType": "JPG",
                          "imageBase64": res
                      } 
                      axios.post(ImgAPI, SubmitImg).then(result=>{
                          if(result.data.status === "Success"){
                                //Remove Images
                                console.log("307","Images Submitted");
                          }
                          else
                          {
                            SubmitImage = false;
                            Alert.alert(
                                'Error Uploading Image',
                                `${JSON.stringify(result.data)}`,
                                [{ text: 'OK', onPress: () => {} }],
                                { cancelable: false },
                              );
                            }
                          }).catch(err => {

                            SubmitImage = false;
                            Alert.alert(
                              'Error Uploading Image',
                              `${Img.imageName}`,
                              [{ text: 'OK', onPress: () => {} }],
                              { cancelable: false },
                            );

                        })    
                    });
                  })

                  if(SubmitImage)
                  {
                      Alert.alert(
                        'Survey Completed',
                        `Survey Submitted Successfully`,
                        [{ text: 'OK', onPress: () => navigation.popToTop() }],
                        { cancelable: false },
                      );
                  }
                  else
                  {
                    Alert.alert(
                      'Survey Completed With Exeptions',
                      `Survey Submitted But Some Images Were Not Uploaded`,
                      [{ text: 'OK', onPress: () => navigation.popToTop() }],
                      { cancelable: false },
                    );
                  }
                }
                else
                {
                  Alert.alert(
                    'Some Error Occured',
                    `${JSON.stringify(result.data)}`,
                    [{ text: 'OK', onPress: () => navigation.popToTop() }],
                    { cancelable: false },
                  );
                }
            }).catch(error=>{
              Alert.alert(
                'Error',
                `${error}`,
                [{ text: 'OK', onPress: () => {} }],
                { cancelable: false },
              );
            });
          } else {
            // console.log("In else")
            const data = await AsyncStorage.getItem('unSyncedQuestions');
            if (data) {
              let newData = await AsyncStorage.setItem(
                'unSyncedQuestions',
                JSON.stringify([
                  ...JSON.parse(data),
                  {
                    userId: UserId,
                    accountId: accId,
                    surveyId,
                    surveyDate: format(new Date(), 'yyyy-MM-dd'),
                    Questions: survey,
                  },
                ]),
              );
            } 
            else 
            {
             let newData = await AsyncStorage.setItem(
                'unSyncedQuestions',
                JSON.stringify([
                  {
                    userId: UserId,
                    accountId: accId,
                    surveyId,
                    surveyDate: format(new Date(), 'yyyy-MM-dd'),
                    Questions: survey,
                  },
                ]),
              );
            }
            Alert.alert(
              'UnSync',
              'Form Submition Completed but not sync with database',
              [{ text: 'OK', onPress: () => navigation.popToTop() }],
              { cancelable: false },
            );
          }
        } catch (error) {
          Alert.alert('Fail', error.message, [{ text: 'OK', onPress: () => {} }], {
            cancelable: true,
          });
        }
      } 
      
      if(restQuestions.length !== 0)
      {
        navigation.push('SurveyQue', {
          questions: restQuestions,
          firstQuestion: false,
          accId,
          surveyId,
          UserId,
        });
      }
    
      
  };

  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <ScrollView style={{ flex: 1 }}>
        <Formik
          innerRef={formRef}
          initialValues={
            (survey &&
              survey.find(
                x =>
                  x.sQuestion.Id === question.sQuestion.Id &&
                  x.accId === accId &&
                  x.surveyId === surveyId &&
                  x.UserId === UserId,
              )) || {
              accId,
              surveyId,
              UserId,
              mainField: '',
              childField: '',
            }
          }
          enableReinitialize
          onSubmit={onSubmit}>
          {({ values }) => (
            <Choose>
              <When condition={question.sQuestion.Option_Type__c === 'Single Select'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Single Select List'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Single Select Group'}>
                <Field
                  component={SelectGroup}
                  data={question.Options}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Multi Select'}>
                <Field
                  data={question.Options}
                  valueField="optionId"
                  textField="optionName"
                  component={MultiSelection}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value || value.length === 0) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Ordering Question'}>
                <Field
                  data={question.Options}
                  component={VKCDraggableList}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Integer Enter Question'}>
                <Field
                  component={TextInput}
                  keyboardType="number-pad"
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Text'}>
                <Field
                  component={TextInput}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Slider'}>
                <Field
                  component={SliderQuestion}
                  data={question.sQuestion}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Star Rating'}>
                <Field
                  component={StarRating}
                  data={question.sQuestion}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When
                condition={question.sQuestion.Option_Type__c === 'Question with Image as options'}>
                <Field
                  name="mainField"
                  component={SelectImage}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  imageField="imageUrl"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When
                condition={
                  question.sQuestion.Option_Type__c === 'Upload Image for choosing an Option'
                }>
                <Field
                  component={VKCMediaPicker}
                  name="mainField"
                  value={values.mainField}
                  surveyId={surveyId}
                  accountId={accId}
                  userId={UserId}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  questionId={question.sQuestion.Id}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Multi Text'}>
                <Field
                  component={CustomMultiText}
                  name="mainField"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Feedback'}>
                <Field
                  component={TextInput}
                  multiline
                  inputStyle={{ minHeight: 200 }}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Tabular Question'}>
                <Field
                  name="mainField"
                  component={Tabular}
                  data={question.Options}
                  userId={UserId}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  surveyId = {question.sQuestion.Survey_Master__c}
                  questionId = {question.sQuestion.Id}
                  accountId = {accId}
                  validate={value => {
                    
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Coupon'}>
                <Field
                  component={TextInput}
                  keyboardType="number-pad"
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    if (value > question.sQuestion.Max_Limit__c) {
                      return `value should not be greater than ${question.sQuestion.Max_Limit__c}`;
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Display'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Stock'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Performance In the Area'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Salesman Commit'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Special Efforts'}>
                <Field
                  name="mainField"
                  component={SingleSelectRadio}
                  data={question.Options}
                  value={values.mainField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!value) {
                      return 'Please Enter Field Value';
                    }
                    return '';
                  }}
                />
              </When>
              <Otherwise>
                <Text>No Such Question type found</Text>
              </Otherwise>
            </Choose>
          )}
        </Formik>
      </ScrollView>
      <Choose>
        <When condition={firstQuestion}>
          <VKCButton
            variant="fill"
            style={{ marginVertical: 5 }}
            text="Next"
            onPress={() => formRef.current.handleSubmit()}
          />
        </When>
        <Otherwise>
          <View style={{ flexDirection: 'row' }}>
            <VKCButton
              variant="fill"
              style={{ margin: 5, flex: 1 }}
              text="Previous"
              onPress={() => navigation.pop()}
            />
            <VKCButton
              variant="fill"
              style={{ margin: 5, flex: 1 }}
              text={restQuestions.length === 0 ? 'Submit' : 'Next'}
              onPress={() => formRef.current.handleSubmit()}
            />
          </View>
        </Otherwise>
      </Choose>
    </SafeAreaView>
  );
};

export default SurveyQue;
