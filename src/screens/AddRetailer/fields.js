import TextInput from '../../components/TextInput/TextInput';
import Select from '../../components/select/Select';



export const fields = [
  {
    label:'Record Type',
    value:'',
    name:'Record Type'
    type:1,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Account Name',
    value:'',
    name:'Account Name'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Sales Officer Name',
    value:'',
    name:'Sales_Officer_Name_c'
    type:1,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'Sales Officer Id Invalid'
      }
      errorMessage = ''
    }
  },
  {
    label:'Date Of Appointment',
    value:'',
    name:'Date_Of_Appointment_c'
    type:2,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Street',
    value:'',
    name:'BillingStreet'
    type:3,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() =>{

      }
  },
  {
    label:'City',
    value:'',
    name:'BillingCity'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() =>{

      }
  },
  {
    label:'City',
    value:'',
    name:'BillingCity'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() =>{

      }
  },
  {
    label:'District',
    value:'',
    name:'District'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'State/Province',
    value:'',
    name:'State_c'
    type:4,
    options:[],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Zip/Postal Code',
    value:'',
    name:'BillingPostalCode'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Country',
    value:'',
    name:'Country_c'
    type:4,
    options:[],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Name Of Proprietor Partners',
    value:'',
    name:'Name_Of_ProPrietor_Partners_c'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'This Field cannot be empty'
      }
      errorMessage = ''
    }
  },
  {
    label:'Phone',
    value:'',
    name:'Phone'
    type:4,
    options:[],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:() => {
      if(value.length !== 10)
      {
        errorMessage = 'Please Enter A Valid Phone No.'
      }
      errorMessage = ''
    }
  },
  {
    label:'WhatsApp Number',
    value:'',
    name:'Whatsapp Number'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() => {}
  },
  {
    label:'Email',
    value:'',
    name:'Email'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() => {}
  },
  {
    label:'Shop Space',
    value:'Yes',
    name:'Shop_Space_c'
    type:4,
    options:["Yes","No"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() => {}
  },
  {
    label:'Class',
    value:'A',
    name:'Retail_Class_c'
    type:4,
    options:["A","B","C","D"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() => {}
  },
  {
    label:'Location Type',
    value:'Urban',
    name:'Location_Type_c'
    type:4,
    options:["Urban","Semi-Urban","Rural"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() => {}
  },
  {
    label:'Shop Registration No',
    value:'',
    name:'Shop_Registration_No_c'
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:() => {}
  },
  {
    label:'Geo Tag',
    value:'',
    name:'Geo_Tag_c'
    type:1,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:false,
    validate:() => {
      if(!value.length)
      {
        errorMessage = 'Geolocation not valid'
      }
      errorMessage = ''
    }
  }
]





// export const fields = [
//   [
//     {
//       name: 'Name',
//       label: 'Name',
//       placeholder: 'Name',
//       component: TextInput,
//       returnKeyType: 'next',
//       value: '',
//       editable: false,
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'GSTIN__c',
//       label: 'GST Number',
//       placeholder: 'GST Number',
//       component: TextInput,
//       returnKeyType: 'next',
//       value: '',
//       editable: false,
//       validate: value => {
//         let errorMessage;
//         if (
//           value &&
//           !/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/i.test(
//             value,
//           )
//         ) {
//           errorMessage = 'Invalid GST Number';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'Classification__c',
//       label: 'Retailer Class',
//       placeholder: 'Retailer Class',
//       component: Select,
//       value: '',
//       options: [],
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'Region__c',
//       label: 'Area',
//       placeholder: 'Area',
//       component: Select,
//       value: '',
//       options: [],
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'Route__c',
//       label: 'Beat',
//       placeholder: 'Beat',
//       component: Select,
//       value: '',
//       options: [],
//       mapField: 'Region__c',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'BillingState',
//       label: 'State',
//       placeholder: 'State',
//       component: TextInput,
//       returnKeyType: 'next',
//       editable: false,
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'BillingCity',
//       label: 'City',
//       placeholder: 'City',
//       component: TextInput,
//       returnKeyType: 'next',
//       editable: false,
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'BillingStreet',
//       label: 'Address',
//       placeholder: 'Address',
//       component: TextInput,
//       returnKeyType: 'next',
//       editable: false,
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'BillingPostalCode',
//       label: 'PostalCode',
//       placeholder: 'PostalCode',
//       component: TextInput,
//       returnKeyType: 'next',
//       editable: false,
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//   ],
//   [
//     {
//       name: 'FirstName',
//       label: 'First Name',
//       placeholder: 'First Name',
//       component: TextInput,
//       returnKeyType: 'next',
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'LastName',
//       label: 'Last Name',
//       placeholder: 'Last Name',
//       component: TextInput,
//       returnKeyType: 'next',
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'Email',
//       label: 'Email',
//       placeholder: 'Email',
//       component: TextInput,
//       returnKeyType: 'next',
//       keyboardType: 'email-address',
//       value: '',
//       validate: value => {
//         let errorMessage;
//         if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
//           errorMessage = 'Invalid email address';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'Mobile',
//       placeholder: 'Mobile',
//       label: 'Mobile',
//       component: TextInput,
//       returnKeyType: 'next',
//       keyboardType: 'phone-pad',
//       value: '',
//       isRequired: true,
//       validate: value => {
//         let errorMessage;
//         if (!value) {
//           errorMessage = 'Required';
//         } else if (!/^\d{10}$/i.test(value)) {
//           errorMessage = 'Invalid Mobile Number';
//         }
//         return errorMessage;
//       },
//     },
//     {
//       name: 'Phone',
//       placeholder: 'Whatsapp Number',
//       label: 'Whatsapp Number',
//       component: TextInput,
//       keyboardType: 'phone-pad',
//       returnKeyType: 'next',
//       value: '',
//       validate: value => {
//         let errorMessage;
//         if (value && !/^\d{10}$/i.test(value)) {
//           errorMessage = 'Invalid Phone Number';
//         }
//         return errorMessage;
//       },
//     },
//   ],
// ];

// export const formData = [
//   // {
//   //   name: 'GSTIN_Status__c',
//   //   component: Switch,
//   //   label: 'Do you have GST Number?',
//   //   value: true,
//   // },
//   {
//     name: 'GSTIN__c',
//     label: 'GST Number',
//     placeholder: 'GST Number',
//     component: TextInput,
//     returnKeyType: 'next',
//     value: '',
//     isRequired: true,
//     validate: value => {
//       let errorMessage;
//       if (!value) {
//         errorMessage = 'Required';
//       } else if (
//         !/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/i.test(
//           value,
//         )
//       ) {
//         errorMessage = 'Invalid GST Number';
//       }
//       return errorMessage;
//     },
//   },
// ];
