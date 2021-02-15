/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import WizardForm from '../../components/wizard/Wizard';

import { fields } from './fields';

const AddRetailer = () => {
  const createRetailer = values => {
    // console.log(values);
  };
  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never', bottom: 'always' }}>
      <WizardForm
        fields={fields}
        initialValues={{
          Name: '',
          GSTIN__c: '',
          GSTIN_Status__c: false,
          Classification__c: '',
          Region__c: '',
          BillingCountry: 'India',
          BillingState: '',
          BillingCity: '',
          BillingStreet: '',
          BillingPostalCode: '',
          FirstName: '',
          LastName: '',
          Email: '',
          Phone: '',
          Mobile: '',
          Route__c: '',
        }}
        onSubmit={createRetailer}
      />
    </SafeAreaView>
  );
};

export default AddRetailer;
