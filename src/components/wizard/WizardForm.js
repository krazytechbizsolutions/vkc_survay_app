import React from 'react';
import { Field } from 'formik';
import { View } from 'react-native';
import Wizard from './Wizard';
import commonStyle from '../../commonStyle';

const WizardForm = ({ fields, ...props }) => {
  return (
    <Wizard {...props}>
      {fields.map((field, index) => (
        <Wizard.Page key={index}>
          <View style={commonStyle.mar10}>
            {field.map(item => {
              return <Field key={item.name} {...item} />;
            })}
          </View>
        </Wizard.Page>
      ))}
    </Wizard>
  );
};

export default WizardForm;
