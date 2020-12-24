/* eslint-disable */
import React from 'react';
import useSWR from 'swr';
import { Button, SafeAreaView, Text } from 'react-native';

const SurveyQue = ({ navigation, route }) => {
  const { questionId } = route.params;
  const { data } = useSWR(`/questions/${questionId}`);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Choose>
        <When condition={data.questionType === 'singleSelectRadio'}>
          <Text>{data.question}</Text>
        </When>
        <When condition={data.questionType === 'singleSelectList'}></When>
        <Otherwise>
          <Text>ElseBlock</Text>
        </Otherwise>
      </Choose>
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
