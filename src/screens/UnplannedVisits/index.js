/* eslint-disable react-native/no-inline-styles */
import TextEle from '@components/TextEle';
import React from 'react';
import { View,Picker,TouchableOpacity,ScrollView } from 'react-native';
import { Formik, Field, FieldArray } from 'formik';
import SafeAreaView from 'react-native-safe-area-view';
import Form from '../../components/form/Form';
import fields from './fields';
import CustomMultiText from '../../components/CustomMultiText/index';

const UnPlannedVisit = ({navigation}) => {
  const createUnplannedVisit = values => {
  };

  const MoveToHome = () =>{
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <ScrollView style={{ flex: 1 }}>
      <Formik
          initialValues={""}
          enableReinitialize
          onSubmit={()=>{}}>
            <Field
                  component={CustomMultiText}
                  name="mainField"
                  question={""}
                  isUnplanned={true}
                  backToHome = {MoveToHome}
            />
      </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UnPlannedVisit;
