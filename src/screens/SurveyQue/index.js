/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, Alert } from 'react-native';
// import { useTheme } from '@react-navigation/native';
import VKCButton from '@components/VKCButton';
import SingleSelectRadio from '@components/SingleSelectRadio';
import SingleSelectList from '@components/SingleSelectList';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableList from '@components/VKCDraggableList';
import VKCMediaPicker from '@components/VKCMediaPicker';
// import LongText from '@components/LongText';
import SelectGroup from '@components/SelectGroup';
// import IntegerInput from '@components/IntegerInput';
import SliderQuestion from '@components/SliderQuestion';
import StarRating from '@components/StarRating';
import TextEle from '@components/TextEle';
import { TextInput } from 'react-native-gesture-handler';
import MultiText from '@components/MultiText';
// import TextInput from '@components/TextInput/TextInput';
// import { RectButton } from 'react-native-gesture-handler';
// import SubmitServey from '../../components/SubmitServey';

const SurveyQue = ({ navigation, route }) => {
  // const { colors } = useTheme();
  const { questions, firstQuestion } = route.params;
  const [question, ...restQuestions] = questions;
  const [value, setValue] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <ScrollView style={{ flex: 1 }}>
        <Choose>
          <When condition={question.sQuestion.Option_Type__c === 'Single Select'}>
            <SingleSelectRadio
              value={value}
              onSelect={item => setValue(item)}
              data={question.Options}
              valueField="optionId"
              textField="optionName"
              question={question.sQuestion.Detailed_Survey_Question_Name__c}
            />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Single Select List'}>
            <SingleSelectList
              data={question.Options.map(x => ({
                text: x.optionName,
                value: x.optionId,
              }))}
            />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Single Select Group'}>
            <SelectGroup data={question.Options} />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Multi Select'}>
            <MultiSelection
              data={question.Options.map(x => ({
                text: x.optionName,
                value: x.optionId,
              }))}
            />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Ordering Question'}>
            <VKCDraggableList data={question.Options} />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Integer Enter Question'}>
            <TextInput
              style={{
                height: 56,
                paddingHorizontal: 24,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 32,
                fontWeight: '500',
                fontFamily: 'Inter-Medium',
                fontSize: 15,
                fontStyle: 'normal',
                lineHeight: 18,
                letterSpacing: 0.7,
                textAlign: 'left',
                marginVertical: 10,
              }}
              keyboardType="numeric"
            />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Text'}>
            <TextInput
              style={{
                height: 56,
                paddingHorizontal: 24,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 32,
                fontWeight: '500',
                fontFamily: 'Inter-Medium',
                fontSize: 15,
                fontStyle: 'normal',
                lineHeight: 18,
                letterSpacing: 0.7,
                textAlign: 'left',
                marginVertical: 10,
              }}
            />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Slider'}>
            <SliderQuestion data={question.sQuestion} />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Star Rating'}>
            <StarRating data={question.sQuestion} />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Question with Image as options'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When
            condition={question.sQuestion.Option_Type__c === 'Upload Image for choosing an Option'}>
            <VKCMediaPicker />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Multi Text'}>
            <MultiText />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Feedback'}>
            <TextInput
              multiline
              style={{
                paddingHorizontal: 24,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 10,
                fontWeight: '500',
                fontFamily: 'Inter-Medium',
                fontSize: 15,
                fontStyle: 'normal',
                lineHeight: 18,
                letterSpacing: 0.7,
                textAlign: 'left',
                marginVertical: 10,
              }}
            />
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Tabular Question'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Coupon'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Display'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Stock'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Performance In the Area'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Salesman Commit'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <When condition={question.sQuestion.Option_Type__c === 'Special Efforts'}>
            <Text>{question.sQuestion.Option_Type__c}</Text>
          </When>
          <Otherwise>
            <Text>No Such Question type found</Text>
          </Otherwise>
        </Choose>
      </ScrollView>
      <Choose>
        <When condition={firstQuestion}>
          <VKCButton
            variant="fill"
            style={{ marginVertical: 5 }}
            text="Next"
            onPress={() =>
              navigation.push('SurveyQue', {
                questions: restQuestions,
                firstQuestion: false,
              })
            }
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
              onPress={() =>
                restQuestions.length === 0
                  ? Alert.alert(
                      'Completed',
                      'Form Submition Completed',
                      [{ text: 'OK', onPress: () => navigation.popToTop() }],
                      { cancelable: false },
                    )
                  : navigation.push('SurveyQue', {
                      questions: restQuestions,
                      firstQuestion: false,
                    })
              }
            />
          </View>
        </Otherwise>
      </Choose>
    </SafeAreaView>
  );

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //     <ScrollView style={{ flex: 1, backgroundColor: colors.primary, padding: 20 }}>
  //       <Choose>
  //         <When condition={data.questionType === 'singleSelectRadio'}>
  //           <SingleSelectRadio data={data} />
  //         </When>
  //         <When condition={data.questionType === 'singleSelectList'}>
  //           <SingleSelectList data={data} />
  //         </When>
  //         <When condition={data.questionType === 'MultiSelect'}>
  //           <MultiSelection data={data} />
  //         </When>
  //         <When condition={data.questionType === 'LongText'}>
  //           <LongText data={data} />
  //         </When>
  //         <When condition={data.questionType === 'integerInput'}>
  //           <IntegerInput data={data} />
  //         </When>
  //         <When condition={data.questionType === 'Slider'}>
  //           <SliderQuestion data={data} />
  //         </When>
  //         <When condition={data.questionType === 'StarRating'}>
  //           <StarRating data={data} />
  //         </When>
  //         <When condition={data.questionType === 'ImageSuggestion'}>
  //           <SingleSelectRadio data={data} />
  //         </When>
  //         <When condition={data.questionType === 'selectGroup'}>
  //           <SelectGroup data={data} />
  //         </When>
  //         <When condition={data.questionType === 'Text'}>
  //           <TextInput data={data} />
  //         </When>
  //         <When condition={data.questionType === 'Feedback'}>
  //           <LongText data={data} />
  //         </When>
  //         <When condition={data.questionType === 'servey'}>
  //           <SubmitServey data={data} />
  //         </When>
  //         <Otherwise>
  //           <Text>ElseBlock</Text>
  //         </Otherwise>
  //       </Choose>
  //     </ScrollView>
  //     <View style={{ backgroundColor: colors.primary }}>
  //       {questionId > 1 ? (
  //         <View style={{ flexDirection: 'row', margin: 20 }}>
  //           <View style={{ flex: 1, marginHorizontal: 5 }}>
  //             <RectButton
  //               style={{
  //                 backgroundColor: 'red',
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //                 borderRadius: 20,
  //                 height: 40,
  //               }}
  //               onPress={() =>
  //                 navigation.navigate('SurveyQue', {
  //                   questionId: parseInt(questionId, 10) - 1,
  //                 })
  //               }>
  //               <Text style={{ color: 'white' }}>Prev</Text>
  //             </RectButton>
  //           </View>
  //           <View style={{ flex: 1, marginHorizontal: 5 }}>
  //             <RectButton
  //               style={{
  //                 backgroundColor: 'red',
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //                 borderRadius: 20,
  //                 height: 40,
  //               }}
  //               onPress={() =>
  //                 navigation.navigate('SurveyQue', {
  //                   questionId: parseInt(questionId, 10) + 1,
  //                 })
  //               }>
  //               <Text style={{ color: 'white' }}>Next</Text>
  //             </RectButton>
  //           </View>
  //         </View>
  //       ) : (
  //         <View style={{ margin: 20 }}>
  //           <RectButton
  //             style={{
  //               backgroundColor: 'red',
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               borderRadius: 20,
  //               height: 40,
  //             }}
  //             onPress={() =>
  //               navigation.navigate('SurveyQue', {
  //                 questionId: parseInt(questionId, 10) + 1,
  //               })
  //             }>
  //             <Text style={{ color: 'white' }}>Next</Text>
  //           </RectButton>
  //         </View>
  //       )}
  //     </View>
  //   </SafeAreaView>
  // );
};

export default SurveyQue;
