/* eslint-disable */
import React from 'react';
import useSWR from 'swr';
import { Button, SafeAreaView } from 'react-native';

const SurveyQue = ({ navigation, route }) => {
  const { questionId } = route.params;
  const { data } = useSWR(`/questions/${questionId}`);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
