/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import React from 'react';
import useSWR from 'swr';
import { SafeAreaView, Text, ScrollView, View } from 'react-native';
import SingleSelectRadio from '@components/SingleSelectRadio';
import SingleSelectList from '@components/SingleSelectList';
import LongText from '@components/LongText';
import SelectGroup from '@components/SelectGroup';
import MultiSelection from '@components/MultiSelection';
import IntegerInput from '@components/IntegerInput';
import SliderQuestion from '@components/SliderQuestion';
import StarRating from '@components/StarRating';
import TextInput from '@components/TextInput/TextInput';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import SubmitServey from '../../components/SubmitServey';

const SurveyQue = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { questionId } = route.params;
  const { data } = useSWR(`/questions/${questionId}`);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.primary, padding: 20 }}>
        <Choose>
          <When condition={data.questionType === 'singleSelectRadio'}>
            <SingleSelectRadio data={data} />
          </When>
          <When condition={data.questionType === 'singleSelectList'}>
            <SingleSelectList data={data} />
          </When>
          <When condition={data.questionType === 'MultiSelect'}>
            <MultiSelection data={data} />
          </When>
          <When condition={data.questionType === 'LongText'}>
            <LongText data={data} />
          </When>
          <When condition={data.questionType === 'integerInput'}>
            <IntegerInput data={data} />
          </When>
          <When condition={data.questionType === 'Slider'}>
            <SliderQuestion data={data} />
          </When>
          <When condition={data.questionType === 'StarRating'}>
            <StarRating data={data} />
          </When>
          <When condition={data.questionType === 'ImageSuggestion'}>
            <SingleSelectRadio data={data} />
          </When>
          <When condition={data.questionType === 'selectGroup'}>
            <SelectGroup data={data} />
          </When>
          <When condition={data.questionType === 'Text'}>
            <TextInput data={data} />
          </When>
          <When condition={data.questionType === 'Feedback'}>
            <LongText data={data} />
          </When>
          <When condition={data.questionType === 'servey'}>
            <SubmitServey data={data} />
          </When>
          <Otherwise>
            <Text>ElseBlock</Text>
          </Otherwise>
        </Choose>
      </ScrollView>
      <View style={{ backgroundColor: colors.primary }}>
        {questionId > 1 ? (
          <View style={{ flexDirection: 'row', margin: 20 }}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <RectButton
                style={{
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  height: 40,
                }}
                onPress={() =>
                  navigation.navigate('SurveyQue', {
                    questionId: parseInt(questionId, 10) - 1,
                  })
                }>
                <Text style={{ color: 'white' }}>Prev</Text>
              </RectButton>
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <RectButton
                style={{
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  height: 40,
                }}
                onPress={() =>
                  navigation.navigate('SurveyQue', {
                    questionId: parseInt(questionId, 10) + 1,
                  })
                }>
                <Text style={{ color: 'white' }}>Next</Text>
              </RectButton>
            </View>
          </View>
        ) : (
          <View style={{ margin: 20 }}>
            <RectButton
              style={{
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                height: 40,
              }}
              onPress={() =>
                navigation.navigate('SurveyQue', {
                  questionId: parseInt(questionId, 10) + 1,
                })
              }>
              <Text style={{ color: 'white' }}>Next</Text>
            </RectButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SurveyQue;
