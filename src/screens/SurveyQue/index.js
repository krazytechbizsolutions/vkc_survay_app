/* eslint-disable */
import React from 'react';
import useSWR from 'swr';
import { Button, SafeAreaView, Text, ScrollView, View } from 'react-native';
import SingleSelectRadio from '@components/SingleSelectRadio';
import SingleSelectList from '@components/SingleSelectList';
import LongText from '@components/LongText';

const SurveyQue = ({ navigation, route }) => {
  const { questionId } = route.params;
  const { data } = useSWR(`/questions/${questionId}`);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        <Choose>
          <When condition={data.questionType === 'singleSelectRadio'}>
            <SingleSelectRadio data={data} />
          </When>
          <When condition={data.questionType === 'singleSelectList'}>
            <SingleSelectList data={data} />
          </When>
          <When condition={data.questionType === 'LongText'}>
            <LongText data={data} />
          </When>
          <Otherwise>
            <Text>ElseBlock</Text>
          </Otherwise>
        </Choose>
      </ScrollView>

      {questionId > 1 ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ flex: 1 }}>
            <Button
              title="next"
              onPress={() =>
                navigation.navigate('SurveyQue', {
                  questionId: parseInt(questionId, 10) + 1,
                })
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Previous"
              onPress={() =>
                navigation.navigate('SurveyQue', {
                  questionId: parseInt(questionId, 10) - 1,
                })
              }
            />
          </View>
        </View>
      ) : (
        <Button
          title="next"
          onPress={() =>
            navigation.navigate('SurveyQue', {
              questionId: parseInt(questionId, 10) + 1,
            })
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SurveyQue;
