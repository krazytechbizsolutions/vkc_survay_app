/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import React, { useState,useContext,useEffect,useRef } from 'react';
import { SafeAreaView, Text, ScrollView, View, Alert, Pressable,Modal } from 'react-native';
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
import SubmitModal from '@components/SubmitModal';
import RNFS from 'react-native-fs';
import SpecialEfforts from '@components/CustomSpecialEfforts'
import { ScreenContext } from '../../context/screenContext';

console.disableYellowBox = true;
let survey = []
let Images = []
console.log("survey",survey);
const SurveyQue = ({ navigation, route }) => {
  // const { colors } = useTheme();
  const { questions, firstQuestion, accId, accName, surveyId, UserId, Unplanned, temp_account_id } = route.params;
  const [question, ...restQuestions] = questions;
  const [SurveySubmit,setSurveySubmit]=useState(false);
  const [ImageSubmit,setImage]=useState(false);
  const [ShowSubmitModal,setSubmitModal]=useState(false);
  const { syncData, setSyncData } = useContext(ScreenContext);
  const formRef = useRef();
  const onSubmit = async selectedOptions => {
    
      const { sQuestion } = question;
      console.log("48",sQuestion)
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
      ) 
      {
        if(sQuestion.Option_Type__c === 'Slider'){
          answer = {
            answer: Math.floor(selectedOptions.mainField),
          };
        } else {
          answer = {
            answer: selectedOptions.mainField,
          };
        }
      }

      let selOptions = {};
      if (
        sQuestion.Option_Type__c === 'Single Select' ||
        sQuestion.Option_Type__c === 'Single Select List' ||
        sQuestion.Option_Type__c === 'Display' ||
        sQuestion.Option_Type__c === 'Stock' ||
        sQuestion.Option_Type__c === 'Performance In the Area' ||
        sQuestion.Option_Type__c === 'Salesman Commit' ||
        sQuestion.Option_Type__c === 'Question with Image as options'
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
      else if(sQuestion.Option_Type__c === 'Ordering Question')
      {
       let selQues = selectedOptions.mainField.filter((res) => {
          return res.IsSelected === true
        })
        

        selOptions = {
          selectedOptions: selQues.map(x => ({
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
      else if(sQuestion.Option_Type__c === 'Special Efforts')
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
                    Id: val.selectedOptions[1].Id,
                    Sequence_No__c: val.selectedOptions[1].Sequence_No__c
                  }
                ]
              })
          }) 
      }
      else if (sQuestion.Option_Type__c === 'Multi Text') {
        selOptions = {
          selectedOptions: selectedOptions.mainField && selectedOptions.mainField?.map((x, i) => ({
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
            let ImageName ;
            console.log("266",`IMG-${surveyId}-${accId}-${UserId}-${sQuestion.Id}`,sQuestion)
            
            ImgData.forEach((Img,index) => {
              ImageName = accName + "_" + format(new Date(), 'yyyy-MM-dd') + sQuestion.Id + "_" + (index + 1);
              let payload ={
                surveyId,
                accountId: accId,
                userId: UserId,
                qtnId: sQuestion.Id,
                Sequence_No: index + 1,
                imageName: ImageName,
                imageType: 'JPG',
                imageURL: Img.uri,
                relatedTo: 'Survey'
              }
              
              let isExist = Images.some((img) => img.imageName === ImageName )
              if(!isExist)
              {
                Images.push(payload);
              }
              // 
            })
            console.log('223 Images :',Images);
            AsyncStorage.setItem('unSyncedImages',JSON.stringify(Images))
            //  console.log("210",Images)
          }
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

        let LocalStorageSurveyData = {
          sQuestion: data,
          ...selOptions,
        }

        setIntoLocalStorage(UserId,accId,surveyId,sQuestion.Id,LocalStorageSurveyData)
      }

      if (restQuestions.length === 0) {

        try {
            const data = await AsyncStorage.getItem('unSyncedQuestions');
            if (data) {
              let newData = await AsyncStorage.setItem(
                'unSyncedQuestions',
                JSON.stringify([
                  ...JSON.parse(data),
                  {
                    userId: UserId,
                    accountId: accId,
                    surveyId:surveyId,
                    isUnplanned:Unplanned  ? true:false,
                    temp_account_id:temp_account_id,
                    surveyDate: format(new Date(), 'yyyy-MM-dd'),
                    Questions:JSON.parse(await AsyncStorage.getItem(`UnSync-${UserId}-${accId}-${surveyId}`))
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
                    surveyId:surveyId,
                    isUnplanned:Unplanned ? true:false,
                    temp_account_id:temp_account_id,
                    surveyDate: format(new Date(), 'yyyy-MM-dd'),
                    Questions: JSON.parse(await AsyncStorage.getItem(`UnSync-${UserId}-${accId}-${surveyId}`)),
                  },
                ]),
              );
            }
            Alert.alert(
              'Survey Recorded',
              'Your Survey Has Been Recorded',
              [{ text: 'OK', onPress: () => {
                setSyncData(true)
                navigation.popToTop()
              } }],
              { cancelable: false },
            );
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
          accName,
          surveyId,
          UserId,
          Unplanned,
          temp_account_id
        });
      }  
  };

  const setIntoLocalStorage = async(
    UserId,
    accId,
    surveyId,
    questionId,
    survData
    ) => {
    let data = await AsyncStorage.getItem(`UnSync-${UserId}-${accId}-${surveyId}`);
   
    if(data === null){
      let TempData = [];
      TempData.push(survData)
      AsyncStorage.setItem(`UnSync-${UserId}-${accId}-${surveyId}`,JSON.stringify(TempData)).then(()=>{
        AsyncStorage.getItem(`UnSync-${UserId}-${accId}-${surveyId}`).then((res)=>{
          console.log("Async data",res)
        })
      }) 
    }
    else
    {
      let TempData = JSON.parse(data);
      // console.log("436",TempData)
       let Search = TempData.findIndex((res)=>{
              console.log(res.sQuestion.qtnId,questionId)
              return res.sQuestion.qtnId === questionId
       })
       
       if (Search >= 0)
       {
        TempData[Search] = survData;
       }
       else
       {
        TempData.push(survData)
       }
       
       AsyncStorage.setItem(`UnSync-${UserId}-${accId}-${surveyId}`,JSON.stringify(TempData)).then(()=>{
        AsyncStorage.getItem(`UnSync-${UserId}-${accId}-${surveyId}`).then((res)=>{
          console.log("Async data",res)
        })
      }) 
    }
  }

  const NavigateToHome=()=>{
    navigation.popToTop();
  }

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
                    console.log("484",question.Options)
                    if (question.Options.filter((x)=> x.level === 'Option 1').length !== value.length) {
                      return 'Please Select All Options';
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
                  noOfStars={question.sQuestion.Max_Limit__c}
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
                  seqNo={question.sQuestion.Sequence_No__c}
                  validate={value => {
                    console.log("587",value)
                    if (!value) {
                      return 'Please Select Atleast One Image';
                    }
                    return '';
                  }}
                />
              </When>
              <When condition={question.sQuestion.Option_Type__c === 'Multi Text'}>
                <Field
                  component={CustomMultiText}
                  name="mainField"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  isUnplanned={false}
                  validate={value => {
                    if (!value) {
                      return 'Please Add Atleast One Account';
                    }
                    return '';
                  }}
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
                  component={SpecialEfforts}
                  data={question.Options}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    console.log("484",question.Options)
                    if (question.Options.filter((x)=> x.level === 'Option 1').length !== value.length) {
                      return 'Please Select All Options';
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

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={ShowSubmitModal}
        onRequestClose={() => {
        }}
      >
        <SubmitModal
          SurveyId = {surveyId}
          AccId = {accId}
          UserId = {UserId}
          BackToHome = {NavigateToHome}  />
      </Modal>            */}

    </SafeAreaView>
  );
};

export default SurveyQue;
