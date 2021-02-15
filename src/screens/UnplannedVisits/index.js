/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import Form from '../../components/form/Form';
import fields from './fields';

const UnplannedVisit = () => {
  const createUnplannedVisit = values => {
  };

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never', bottom: 'always' }}>
      <Form
        initialValues={{
          Subject: 'Call',
          Region__c: null,
          Retailer__c: [],
          Route__c: null,
          Description: '',
          ActivityDate: new Date(),
          Status: 'Not Started',
          Unplanned_Visit__c: true,
          ExternaIdOfTask__c: '',
        }}
        validate={values => {
          const errors = {};
          if (values.Status !== 'Not Started' && !values.Description) {
            errors.Description = 'Required';
          }
          return errors;
        }}
        onSubmit={createUnplannedVisit}
        fields={fields}
      />
    </SafeAreaView>
  );
};

export default UnplannedVisit;
