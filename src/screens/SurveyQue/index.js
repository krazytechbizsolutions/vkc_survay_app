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
const captureSurveyApi = '/services/apexrest/SRVY_SvyCapture_API';
const SurveyQue = ({ navigation, route }) => {
  // const { colors } = useTheme();
  const { questions, firstQuestion, accId, accName, surveyId, UserId, Unplanned, temp_account_id, survey } = route.params;
  const [ question, ...restQuestions ] = questions;
  const [ ShowSubmitModal, setSubmitModal]=useState(false);
  const { syncData, setSyncData } = useContext(ScreenContext);
  const formRef = useRef();
  
  let today = format(new Date(), 'yyyy-MM-dd');
  const onSubmit = async selectedOptions => {
    
      const { sQuestion } = question;
      const Sequence_No = sQuestion.Sequence_No__c
        ? {
            Sequence_No: sQuestion.Sequence_No__c,
          }
        : {};

      let answer = {};
      let selOptions = {};
      if(sQuestion.Option_Type__c === 'Slider'){
        answer = {
          answer: Math.floor(selectedOptions.mainField),
        };
      } else if (
        sQuestion.Option_Type__c === 'Integer Enter Question' ||
        sQuestion.Option_Type__c === 'Text' ||
        sQuestion.Option_Type__c === 'Star Rating' ||
        sQuestion.Option_Type__c === 'Feedback' ||
        sQuestion.Option_Type__c === 'Coupon'
      ) 
      {
        answer = {
          answer: selectedOptions.mainField,
        };

        if(selectedOptions.starRatingMainField){
          selOptions = {
            selectedOptions: selectedOptions.starRatingMainField.map(x => ({
              seqNo: x.seqNo,
              optionId: x.optionId,
              isLoopingQtn: x.isLoopingQtn,
              loopingQtnId: x.loopingQtnId,
              loopingQtnType: x.loopingQtnType,
              selectedSubOrLoopingQtnOptions:AddSubLoopingOptions(selectedOptions,x.loopingQtnType,x.optionId).filter((x) => x)
            })),
          };
        }
       
      }
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
        console.log("94",JSON.stringify(selectedOptions.mainField))
        if(selectedOptions.mainField.isLoopingQtn)
        {
          if(selectedOptions.mainField.loopingQtnType === "Single Select" || selectedOptions.mainField.loopingQtnType === "Single Select List")
          {
            selectedSubOrLoopingQtnOptions = {
              selectedSubOrLoopingQtnOptions: [
                {
                  Id: selectedOptions.childField.Id,
                  Sequence_No__c: selectedOptions.childField.Sequence_No__c,
                },
              ],
            };
          }
          else if(selectedOptions.mainField.loopingQtnType === "Multi Select")
          {
            selectedSubOrLoopingQtnOptions = {
              selectedSubOrLoopingQtnOptions: AddSubLoopingOptions(selectedOptions,selectedOptions.mainField.loopingQtnType).filter((x) => x)[0],
            };
          }
          else if(selectedOptions.mainField.loopingQtnType === "Ordering Question")
          {
            selectedSubOrLoopingQtnOptions = {
              selectedSubOrLoopingQtnOptions: AddSubLoopingOptions(selectedOptions,selectedOptions.mainField.loopingQtnType).filter((x) => x),
            };
          }
          else
          {
            selectedSubOrLoopingQtnOptions = {
              selectedSubOrLoopingQtnOptions: AddSubLoopingOptions(selectedOptions,selectedOptions.mainField.loopingQtnType).filter((x) => x),
            };
          }
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
        console.log("140",selOptions)
  
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
      else if(sQuestion.Option_Type__c === 'Ordering Question'){

        let selectedSubOrLoopingQtnOptions = {};
       let selQues = selectedOptions.mainField.filter((res) => {
          return res.IsSelected === true
        })

        if(selectedOptions.mainField.some((x) => x.isLoopingQtn)) //temp Soln
        {
          selOptions = {
            selectedOptions: selQues.map(x => ({
              seqNo: x.seqNo,
              optionId: x.optionId,
              isLoopingQtn: x.isLoopingQtn,
              loopingQtnId: x.loopingQtnId,
              loopingQtnType: x.loopingQtnType,
              selectedSubOrLoopingQtnOptions:AddSubLoopingOptions(selectedOptions,x.loopingQtnType,x.optionId).filter((x) => x)
            })),
          };
        }
        else
        {
          selOptions = {
            selectedOptions: selQues.map(x => ({
              seqNo: x.seqNo,
              optionId: x.optionId,
              isLoopingQtn: x.isLoopingQtn,
              loopingQtnId: x.loopingQtnId,
              loopingQtnType: x.loopingQtnType
            })),
          };
        }
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

      // save the selectedOptions to local & continue...
      let unSyncedQuestions = await getArrayFromStorage('unSyncedQuestions');
      // check if survey data already exists...
      let savedSurveyData = unSyncedQuestions.find( x => x.userId === UserId && x.accountId === accId && x.temp_account_id === temp_account_id && x.surveyId === surveyId 
        && x.surveyDate === today && x.isUnplanned === Unplanned)

      if(!savedSurveyData){
        savedSurveyData = {
          userId: UserId,
          accountId: accId,
          temp_account_id: temp_account_id,
          surveyId: surveyId,
          surveyDate: today,
          isUnplanned: Unplanned,
          Questions: []
        }
      }

      savedSurveyData.Questions = savedSurveyData.Questions.filter(q => q.sQuestion.qtnId !== sQuestion.Id)
      savedSurveyData.Questions.push({
        sQuestion: {
          qtnId: sQuestion.Id,
          qtnType: sQuestion.Option_Type__c,
          ...Sequence_No,
          ...answer,
        },
        ...selectedOptions,
        ...selOptions
      });

      console.log("277",JSON.stringify(savedSurveyData.Questions))

      unSyncedQuestions = unSyncedQuestions.filter( x => !(x.userId === UserId && x.accountId === accId && x.temp_account_id === temp_account_id && x.surveyId === surveyId 
              && x.surveyDate === today && x.isUnplanned === Unplanned))

      savedSurveyData.isCompleted = (restQuestions.length === 0);

      unSyncedQuestions.push(savedSurveyData);
      
      // console.log("284 Async",JSON.stringify(unSyncedQuestions))
      await saveArrayInStorage('unSyncedQuestions', unSyncedQuestions);
      if (restQuestions.length === 0) {
        Alert.alert(
          'Survey Recorded',
          'Your Survey Has Been Recorded',
          [{ text: 'OK', onPress: () => {
            if(!syncData) {
              setSyncData(true);
            }
            navigation.popToTop()
          } }],
          { cancelable: false },
        );
      } else {
        navigation.push('SurveyQue', {
          questions: restQuestions,
          firstQuestion: false,
          accId,
          accName,
          surveyId,
          UserId,
          Unplanned,
          temp_account_id,
          survey
        });
      }  
  };

  const AddSubLoopingOptions = (selQues,questionType,optionId = null)=>{  
    switch(questionType)
    {
      case 'Multi Select':
   
        return selQues.subLoopMultiSelect.map((val)=>{
          return(
                    {
                      Id: val.Id,
                      Sequence_No__c: val.Sequence_No__c,
                    } 
                )
            })
          break;
  
      case 'Single Select':
        return(
          [
            {
              Id: selQues.subLoopSingleSelect.Id,
              Sequence_No__c: selQues.subLoopSingleSelect.Sequence_No__c,
            }
          ]
        )
        break;
  
      case 'Single Select List':
        return(
          [
            {
              Id: selQues.subLoopSingleSelectList.Id,
              Sequence_No__c: selQues.subLoopSingleSelectList.Sequence_No__c,
            }
          ]
        )
        break;

        case 'Ordering Question':
          return selQues.subLoopOrder.map((res)=>{
            console.log("353",res)
            console.log("354",selQues.subLoopOrder)
              if(res.IsSelected)
              {
                return(
                  {
                    Id: res.Id,
                    Sequence_No__c: res.Sequence_No__c,
                  }
                )
              }
          })
        break;
  
      case 'Feedback':
      case 'Integer Enter Question':
      case 'Text':
      case 'Slider':
        return(
          [
            {
              Id: optionId ? optionId:selQues.mainField.optionId,
              answer:questionType === 'Feedback' ? selQues.subLoopFeedbackText : 
                     questionType === 'Integer Enter Question' ? selQues.subLoopIntegerText : 
                     questionType === 'Text' ? selQues.subLoopText :
                     questionType === 'Slider' ? Math.floor(selQues.subLoopSlider) : null
            }
          ]
        )
        break;
  
      default:
        return null
        break;
    }
  }

  const saveArrayInStorage = async (key, arr) => {
    await AsyncStorage.setItem(key, JSON.stringify(arr))
  }
  
  const getArrayFromStorage = async (key) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : []
    } catch(e){
      storageData = [];
    }
    return storageData;
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
            (survey?.Questions?.find(
                x =>
                  x.sQuestion.qtnId === question.sQuestion.Id
              )) || {
              mainField: '',
              childField: '',
              subLoopFeedbackText:'',
              subLoopIntegerText:'',
              subLoopText:'',
              subLoopMultiSelect:'',
              subLoopSlider:'',
              subLoopSelect:'',
              subLoopSingleSelect:'',
              subLoopSingleSelectList:'',
              subLoopOrder:'',
              starRatingMainField:''
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
                    if (!value || value.length === 0) {
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
                    if (!value || value.length === 0) {
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
                    console.log("509",value.some(x => x.IsSelected));
                    if (! value.some(x => x.IsSelected)) {
                      return 'Need To Prioritize atleast one value';
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
                    if (!(value > -1)) {
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
                  options = {question.Options}
                  name="mainField"
                  value={values.mainField}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  validate={value => {
                    if (!(value > -1)) {
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
                    if (!value || value.length === 0) {
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
                  temp_account_id={temp_account_id}
                  accName={accName}
                  userId={UserId}
                  surveyDate={today}
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  questionId={question.sQuestion.Id}
                  seqNo={question.sQuestion.Sequence_No__c}
                  validate={value => {
                    if (!value || value.length === 0) {
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
                    if (!value || value.length === 0) {
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
                  name="childField"
                  component={Tabular}
                  data={question.Options}
                  userId={UserId}
                  value={values.childField}
                  valueField="optionId"
                  textField="optionName"
                  question={question.sQuestion.Detailed_Survey_Question_Name__c}
                  surveyId = {question.sQuestion.Survey_Master__c}
                  questionId = {question.sQuestion.Id}
                  accountId = {accId}
                  validate={value => {
                    if (!value || value.length === 0) {
                      return 'Need to add atleast one value';
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
                    if (!(value > -1)) {
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
                    if (!value || value.length === 0) {
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
                    if (!value || value.length === 0) {
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
                    if (!value || value.length === 0) {
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
                    if (!value || value.length === 0) {
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
              style={{ margin: 5, flex: 1,backgroundColor:restQuestions.length === 0 ? '#1890ff' : '#ed4356' }}
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
