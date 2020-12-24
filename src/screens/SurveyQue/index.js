/* eslint-disable */
import React from 'react';
import useSWR from 'swr';
import { Button, SafeAreaView, Text, ScrollView } from 'react-native';
import SingleSelectRadio from '@components/SingleSelectRadio';
import SingleSelectList from '@components/SingleSelectList';

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
          <Otherwise>
            <Text>ElseBlock</Text>
          </Otherwise>
        </Choose>
      </ScrollView>
      <Button
        title="next"
        onPress={() =>
          navigation.navigate('SurveyQue', {
            questionId: parseInt(questionId, 10) + 1,
          })
        }
      />
    </SafeAreaView>
  );
};

export default SurveyQue;
