import React from 'react';
import TextInput from '../../components/TextInput/TextInput';

export const nameRef = React.createRef();
export const distributorRef = React.createRef();
export const regionRef = React.createRef();
export const activeRef = React.createRef();

const fields = [
  [
    {
      name: 'Name',
      label: 'Name',
      placeholder: 'Name',
      component: TextInput,
      returnKeyType: 'next',
      value: '',
      innerRef: nameRef,
      onSubmitEditing: () => {
        if (nameRef && nameRef.current) {
          nameRef.current.focus();
        }
      },
      isRequired: true,
      validate: value => {
        let errorMessage;
        if (!value) {
          errorMessage = 'Required';
        }
        return errorMessage;
      },
    },
  ],
  [],
];

export default fields;
