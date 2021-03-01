/* eslint-disable react/prop-types */
import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import { Field } from 'formik';
import React, { useState,useEffect } from 'react';
import { FlatList, View,Button,Picker,TouchableOpacity,Alert } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';
import PickList from '@components/Picklist';
import CustomTextInput from '@components/TextInput2'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SingleSelectRadio = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched, values },
  data,
  userId,
  valueField,
  textField,
  placeholder = 'Please select value',
  question,
  surveyId,
  questionId,
  accountId
}) => {

  // console.log("22",JSON.stringify(data));
  const [isVisible, setIsVisible] = useState(false);
  const [EditIndex,setEditIndex]=useState(null);
  const [isSubVisible, setIsSubVisible] = useState(false);
  const [SelectedType, setSelectedType] = useState(0);
  const [SingleDispData,setSingleDispData] = useState({})
  const [DispData,setDispData]=useState([]);
  const [AddData,setAddData]=useState(false);
  

  const OpenOptionModal=(val)=>{
    console.log("39",val)
    setSelectedType(val - 1);
    setIsSubVisible(true);
  }


  useEffect(() => {
    GetLocalData();
  },[])

  const GetLocalData=()=>{
    // console.log('114',`Tab-${userId}-${questionId}-${surveyId}`)
     AsyncStorage.getItem(`Tab-${userId}-${questionId}-${surveyId}-${accountId}`).then(data=>{
       if(data !== null)
       {
        let LocalDispData = JSON.parse(data);
        setDispData(LocalDispData);
        setValue(LocalDispData) 
       }
     })
  }

  const setValue = (DisplayData)=> {
    let MainField=[];
    let ChildField = []; 
      // console.log("77",DisplayData)

      DisplayData.forEach((result,index)=>{
          MainField.push({
            seqNo:index + 1,
            selectedSubOrLoopingQtnOptions:[]
          })

          ChildField.push([{
                Sequence_No__c: 1,
                Id: result.Gender.Id // INCASE OF ENTRY TYPE AS PICKLIST
              },{
                Sequence_No__c: 2,
                Id: result.Brand.Id// INCASE OF ENTRY TYPE AS PICKLIST
              },{
                Sequence_No__c: 3,
                Id: result.Price.Id // INCASE OF ENTRY TYPE AS PICKLIST
              },{
                Sequence_No__c: 4,
                answer: typeof result.Quantity === "object" ? result.Quantity.Id : result.Quantity  // INCASE OF ENTRY TYPE AS TEXTFIELD
          }])
        })
       

      console.log("76","MainField" + JSON.stringify(MainField),"ChildField" +JSON.stringify(ChildField));

    setFieldValue('mainField',MainField);
    setFieldValue('childField',ChildField);

  }

  const AddEditData=(value)=>{
    
    let TempDispData=DispData;
    if(EditIndex === null)
    {    
        TempDispData.push(value)
    }
    else
    {
      TempDispData[EditIndex] = value;
    }
    console.log("61",TempDispData);
    setDispData([...TempDispData])
    setEditIndex(null)
    setIsVisible(false);
    setValue(TempDispData);
  }

  const SaveData=async ()=>{
    try {
      console.log('114',`Tab-${userId}-${questionId}-${surveyId}`)
      await AsyncStorage.setItem(`Tab-${userId}-${questionId}-${surveyId}-${accountId}`,JSON.stringify(DispData));
      Alert.alert(
        "Data Saved",
        "Your Data Has Been Locally Saved Successfully",
        [
          { text: "OK", onPress: () => {} }
        ],
        { cancelable: true }
      );
    } catch (error) {
      // Error saving data
      Alert.alert(
        "Data Not Saved",
        "Fail To Store Data",
        [
          { text: "OK", onPress: () => {} }
        ],
        { cancelable: true }
      );
    }
  }

  const AddNewData=()=>{
    setEditIndex(null)
    setIsVisible(true)
  }

  const GetData=(val,optionName)=>{
      console.log("123",val,optionName);
      let tempSingleData=SingleDispData
      tempSingleData[optionName] = val;
      setSingleDispData(tempSingleData);
      console.log("120",Object.keys(SingleDispData).length)
      if(Object.keys(SingleDispData).length === data.length)
      {
        setAddData(false)
        // console.log("ADDING DATA")
         AddEditData(SingleDispData);
         setSingleDispData({});
      }
  }
  
  
  const onDeleteData=(val)=>{
    let TempDispData=DispData;
      if (val > -1) {
        TempDispData.splice(val, 1);
      }
      setDispData([...TempDispData])
  }

  const onEditPressed=(data,index)=>{
    setEditIndex(index)
    setIsVisible(true)
  }

  // console.log("77",DispData)
  const errorStyle = touched[name] && errors[name] ? { borderColor: 'red' } : {};

  return (
    <>
      <TextEle variant="title" style={{ marginBottom: 10 }}>
        {question}
      </TextEle>
        <View style={{width:'100%',alignItems: 'center',justifyContent: 'center'}}>
          <View style={{width:'100%'}}>
              <FlatList
                data={DispData}
                renderItem={({ item,index }) => (
                  <View style={{width:'100%',padding:10,backgroundColor:'white',borderRadius:10,borderWidth:1,marginTop:10}}>
                    
                    <View style={{width:'100%',flexDirection:'row',justifyContent: 'space-between',alignItems: 'center'}}>
                      <TextEle style={{color:'black'}}>
                          Gender : {item.Gender.Detailed_Survey_Option_Name__c}
                      </TextEle>
                      <View style={{flexDirection:'row',justifyContent: 'space-between',alignItems: 'center',width:90,marginTop:10}}>
                        
                        <TouchableOpacity onPress={()=>onEditPressed(item,index)}>
                          <View style={{width:35,height:35,backgroundColor:'red',justifyContent:'center',alignItems: 'center',borderRadius:100}}>
                            <Icon
                              name="md-pencil-sharp"
                              style={{ right: 0, top: 0 }}
                              size={24}
                              color="white"
                            />
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>onDeleteData(index)}>
                        <View style={{width:35,height:35,backgroundColor:'red',justifyContent:'center',alignItems: 'center',borderRadius:100}}>
                            <Icon
                              name="trash-bin"
                              style={{ right: 0, top: 0 }}
                              size={20}
                              color="white"
                            />
                          </View>
                        </TouchableOpacity> 
                      </View>
                    </View>


                    <TextEle style={{color:'black',marginVertical:5}}>
                        Brand : {item.Brand.Detailed_Survey_Option_Name__c}
                    </TextEle>

                    <TextEle style={{color:'black',marginVertical:5}}>
                        Price : {item.Price.Detailed_Survey_Option_Name__c}
                    </TextEle>

                    <TextEle style={{color:'black',marginVertical:5}}>
                        Quantity : {typeof item.Quantity === 'object' ? item.Quantity.Detailed_Survey_Option_Name__c : item.Quantity}
                    </TextEle>
                  </View>
                )}
                keyExtractor={(item,index) => `${index}`}
              />
          </View>
                  
          <View style={{width:'100%',flexDirection:'row',justifyContent: 'space-between'}}>
            <TouchableOpacity style={{width:'50%',padding:15}} onPress={()=>SaveData()}>
                  <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                      <TextEle style={{color:'#fff'}}>
                          Save
                      </TextEle>
                  </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={{width:'50%',padding:15}} onPress={()=>AddNewData()}>
                <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                    <TextEle style={{color:'#fff'}}>
                        Add
                    </TextEle>
                </View>
            </TouchableOpacity>
          </View>
         
        </View>
        <Modal
          isVisible={isVisible}
          style={{ backgroundColor: '#fff', margin: 0 }}
          onRequestClose={() => setIsVisible(false)}>
          <SafeAreaView style={{ flex: 1,padding: 25 }}>

            {data.map((result,index) =>(
                <>
                  <TextEle style={{color:'black',marginTop:10}}>
                    {result.optionName}
                  </TextEle>
        
                  { result.entryType === "Picklist Value" ? 
                        <PickList 
                          seqNo={result.seqNo} 
                          getSeq={OpenOptionModal} 
                          subOpt={data[index]} 
                          DataAdd={AddData} 
                          getData={GetData} 
                          optionName={result.optionName} 
                          value={EditIndex === null ? "" : JSON.stringify(DispData[EditIndex])
                        }/>
                  :
                        <CustomTextInput 
                          seqNo={result.seqNo} 
                          DataAdd={AddData} 
                          getData={GetData} 
                          optionName={result.optionName} 
                          value={EditIndex === null ? "" : JSON.stringify(DispData[EditIndex])
                        }/>
                  }
                </>
            ))}

              <TouchableOpacity style={{width:'100%',padding:15,marginTop:50}} onPress={()=>setAddData(true)}>
                <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                    <TextEle style={{color:'#fff'}}>
                        {EditIndex !== null  ? "Edit":"Add"}
                    </TextEle>
                </View>
            </TouchableOpacity> 
              <Modal
                  isVisible={isSubVisible}
                  style={{  margin: 0, alignItems: 'center', justifyContent: 'center',padding:10 }}
                  onRequestClose={() => setIsSubVisible(false)}>
                    <View style={{width:'100%',backgroundColor:'white',padding:10}}>
                      {data[SelectedType].subOrLoopingQtnOptions.map(result=>{
                          return(
                            <TouchableOpacity onPress={()=>setOptionValues(result)}>
                                <TextEle style={{color:'black',marginVertical:10}}>
                                  {result.Detailed_Survey_Option_Name__c}
                                </TextEle>
                            </TouchableOpacity>
                          )
                      })}
                    </View>
              </Modal>                  
          </SafeAreaView>
        </Modal>
    </>
  );
};

export default SingleSelectRadio;