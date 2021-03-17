import TextInput from '../../components/TextInput/TextInput';
import Select from '../../components/select/Select';



export const fields = [
  {
    label:'Account Name',
    value:'',
    name:'accName',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field cannot be empty'
        return false ;
      }
      this.errorMessage = null;
      return true ;
    }
  },
  {
    label:'Date Of Appointment',
    value:'',
    name:'dateOfCreation',
    type:2,
    isNum:false,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field cannot be empty'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'Street',
    value:'',
    name:'street',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false;
      }
      this.errorMessage = null;
      return true;
    }
  },
  {
    label:'City',
    value:'',
    name:'city',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false;
      }
      this.errorMessage = null;
      return true;
    }
  },
  {
    label:'State/Province',
    value:'Karnataka',
    name:'state',
    type:4,
    isNum:false,
    options:['Karnataka','Maharashtra','Jammu','Kerela'],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false;
      }
      this.errorMessage = null;
      return true;
    }
  },
  {
    label:'Zip/Postal Code',
    value:'',
    name:'pincode',
    type:1,
    isNum:true,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      if(this.value.length !== 6 )
      {
        this.errorMessage = 'Invalid Pincode'
        return false ;
      }
      this.errorMessage = null;
      return true ;
    }
  },
  {
    label:'Country',
    value:'India',
    name:'country',
    type:4,
    isNum:false,
    options:['India'],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false;
      }
      this.errorMessage = null;
      return true;
    }
  },
  {
    label:'Contact Name',
    value:'',
    name:'contactName',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null;
      return true;
    }
  },
  {
    label:'Phone',
    value:'',
    name:'contactNumber',
    type:1,
    isNum:true,
    options:[],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      if(this.value.length !== 10)
      {
        this.errorMessage = 'Invalid Contact No.'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'WhatsApp Number',
    value:'',
    name:'whatsAppNo',
    type:1,
    isNum:true,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null 
      return true
    }
  },
    {
    label:'Email',
    value:'',
    name:'email_id',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      console.log("Email",re.test(String(this.value).toLowerCase()))
      this.errorMessage = 'Invalid Email'
      return re.test(String(this.value).toLowerCase());
    }
  },
  {
    label:'Shop Space',
    value:'Yes',
    name:'shopspace',
    type:4,
    isNum:false,
    options:["Yes","No"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'Class',
    value:'A',
    name:'retail_class',
    type:4,
    isNum:false,
    options:["A","B","C","D"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'Location Type',
    value:'Urban',
    name:'locationType',
    type:4,
    isNum:false,
    options:["Urban","Semi-Urban","Rural"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'Shop Registration No',
    value:'',
    name:'shopRegNumber',
    type:1,
    isNum:true,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'Latitude',
    value:'',
    name:'latitude',
    type:1,
    isNum:false,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return false
      }
      this.errorMessage = null;
      return true
    }
  },
  {
    label:'Longitude',
    value:'',
    name:'longitude',
    type:1,
    isNum:false,
    editable:false,
    isVisible:false,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      if(!this.value.length > 0)
      {
        this.errorMessage = 'This Field Cannot Be Empty'
        return true
      }
      this.errorMessage = null;
      return false 
    }
  }
]




// export const fields = [
//   {
//     label:'Record Type',
//     value:'',
//     name:'Record Type',
//     type:1,
//     isNum:false,
//     editable:false,
//     isVisible:false,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field cannot be empty';
//         return false;
//       }
//       this.errorMessage = null;
//       return true;
//     }
//   },
//   {
//     label:'Account Name',
//     value:'',
//     name:'Account Name',
//     type:1,
//     isNum:false,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field cannot be empty'
//         return false ;
//       }
//       this.errorMessage = null;
//       return true ;
//     }
//   },
//   {
//     label:'Sales Officer Name',
//     value:'',
//     name:'Sales_Officer_Name_c',
//     type:1,
//     isNum:false,
//     editable:false,
//     isVisible:false,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'Sales Officer Id Invalid'
//         return false
//       }
//       this.errorMessage = null;
//       return true;
//     }
//   },
//   {
//     label:'Date Of Appointment',
//     value:'',
//     name:'Date_Of_Appointment_c',
//     type:2,
//     editable:false,
//     isVisible:false,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field cannot be empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Street',
//     value:'',
//     name:'BillingStreet',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'City',
//     value:'',
//     name:'BillingCity',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'District',
//     value:'',
//     name:'District',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'State/Province',
//     value:'',
//     name:'State_c',
//     type:4,
//     options:['Karnataka','Maharashtra','Jammu','Kerela'],
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Zip/Postal Code',
//     value:'',
//     name:'BillingPostalCode',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Country',
//     value:'',
//     name:'Country_c',
//     type:4,
//     options:['India'],
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Name Of Proprietor Partners',
//     value:'',
//     name:'Name_Of_ProPrietor_Partners_c',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Phone',
//     value:'',
//     name:'Phone',
//     type:1,
//     options:[],
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:true,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'WhatsApp Number',
//     value:'',
//     name:'Whatsapp Number',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//     {
//     label:'Email',
//     value:'',
//     name:'Email',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Shop Space',
//     value:'Yes',
//     name:'Shop_Space_c',
//     type:4,
//     options:["Yes","No"],
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Class',
//     value:'A',
//     name:'Retail_Class_c',
//     type:4,
//     options:["A","B","C","D"],
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Location Type',
//     value:'Urban',
//     name:'Location_Type_c',
//     type:4,
//     options:["Urban","Semi-Urban","Rural"],
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Shop Registration No',
//     value:'',
//     name:'Shop_Registration_No_c',
//     type:1,
//     editable:true,
//     isVisible:true,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Latitude',
//     value:'',
//     name:'latitude',
//     type:1,
//     editable:false,
//     isVisible:false,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   },
//   {
//     label:'Longitude',
//     value:'',
//     name:'longitude',
//     type:1,
//     editable:false,
//     isVisible:false,
//     errorMessage:null,
//     isImportant:false,
//     validate:function() {
//       if(!this.value.length > 0)
//       {
//         this.errorMessage = 'This Field Cannot Be Empty'
//         return
//       }
//       this.errorMessage = null;
//     }
//   }
// ]






