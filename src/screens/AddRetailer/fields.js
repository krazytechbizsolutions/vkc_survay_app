import TextInput from '../../components/TextInput/TextInput';
import Select from '../../components/select/Select';



export const fields = [
  {
    label:'Account Name',
    value:'',
    defaultValue:'',
    name:'accName',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Street',
    value:'',
    defaultValue:'',
    name:'street',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'City',
    value:'',
    defaultValue:'',
    name:'city',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'District',
    value:'',
    defaultValue:'',
    name:'District',
    type:1,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'State/Province',
    value:'',
    defaultValue:'Karnataka',
    name:'state',
    type:4,
    isNum:false,
    options:['Karnataka','Maharashtra','Jammu','Kerela'],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Zip/Postal Code',
    value:'',
    defaultValue:'',
    name:'pincode',
    type:1,
    isNum:true,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
     this.errorMessage = this.value.length === 6 ? null : 'Invalid Pincode';
    }
  },
  {
    label:'Country',
    value:'',
    defaultValue:'India',
    name:'country',
    type:4,
    isNum:false,
    options:['India'],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Contact Name',
    value:'',
    defaultValue:'',
    name:'contactName',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Phone',
    value:'',
    defaultValue:'',
    name:'contactNumber',
    type:1,
    isNum:true,
    options:[],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      this.errorMessage = this.value.length === 10 ? null : 'Please Enter A Valid Phone Number';
    }
  },
  {
    label:'WhatsApp Number',
    value:'',
    defaultValue:'',
    name:'whatsAppNo',
    type:1,
    isNum:true,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
    {
    label:'Email',
    value:'',
    defaultValue:'',
    name:'email_id',
    type:1,
    isNum:false,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:true,
    validate:function() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.errorMessage = re.test(String(this.value).toLowerCase()) ? null : 'Invalid Email';
    }
  },
  {
    label:'Shop Space',
    value:'',
    defaultValue:'Yes',
    name:'shopspace',
    type:4,
    isNum:false,
    options:["Yes","No"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Class',
    value:'',
    defaultValue:'A',
    name:'retail_class',
    type:4,
    isNum:false,
    options:["A","B","C","D"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Location Type',
    value:'',
    defaultValue:'Urban',
    name:'locationType',
    type:4,
    isNum:false,
    options:["Urban","Semi-Urban","Rural"],
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  },
  {
    label:'Shop Registration No',
    value:'',
    defaultValue:'',
    name:'shopRegNumber',
    type:1,
    isNum:true,
    editable:true,
    isVisible:true,
    errorMessage:null,
    isImportant:false,
    validate:function() {
      this.errorMessage = this.value.length > 0 ? null : 'This Field cannot be empty';
    }
  }
]

