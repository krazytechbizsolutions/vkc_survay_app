import Select from '../../components/select/Select';
import MultiSelect from '../../components/multiSelect/MultiSelect';
import TextInput from '../../components/TextInput/TextInput';
import DatePicker from '../../components/datepicker';

export default [
  {
    name: 'ActivityDate',
    label: 'Date',
    placeholder: 'Date',
    component: DatePicker,
    returnKeyType: 'next',
    value: '',
    isRequired: true,
    validate: value => {
      let errorMessage;
      if (!value) {
        errorMessage = 'Required';
      }
      return errorMessage;
    },
  },
  {
    name: 'Region__c',
    label: 'Area',
    placeholder: 'Area',
    component: Select,
    value: '',
    isRequired: true,
    options: [],
    validate: value => {
      let errorMessage;
      if (!value) {
        errorMessage = 'Required';
      }
      return errorMessage;
    },
  },
  {
    name: 'Route__c',
    label: 'Beat',
    placeholder: 'Beat',
    component: Select,
    value: '',
    options: [],
    mapField: 'Region__c',
    isRequired: true,
    validate: value => {
      let errorMessage;
      if (!value) {
        errorMessage = 'Required';
      }
      return errorMessage;
    },
  },
  {
    name: 'Retailer__c',
    label: 'Retailer',
    placeholder: 'Retailer',
    component: MultiSelect,
    mapField: 'Route__c',
    value: [],
    options: [],
    isRequired: true,
    validate: value => {
      let errorMessage;
      if (!value) {
        errorMessage = 'Required';
      }
      return errorMessage;
    },
  },
  // {
  //   name: 'Status',
  //   label: 'Status',
  //   placeholder: 'Status',
  //   component: Select,
  //   value: '',
  //   options: [
  //     {
  //       text: 'Not Started',
  //       value: 'Not Started',
  //     },
  //     {
  //       text: 'Completed',
  //       value: 'Completed',
  //     },
  //     {
  //       text: 'Cancelled',
  //       value: 'Cancelled',
  //     },
  //   ],
  //   validate: value => {
  //     let errorMessage;
  //     if (!value) {
  //       errorMessage = 'Required';
  //     }
  //     return errorMessage;
  //   },
  // },
  {
    name: 'Description',
    label: 'Comments',
    placeholder: 'Comments',
    component: TextInput,
    multiline: true,
    inputStyle: {
      height: 100,
    },
    returnKeyType: 'next',
    value: '',
  },
];
