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
import styles from './styles';
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
}) => {
  // console.log("22",data);
  const [isVisible, setIsVisible] = useState(false);
  const [EditIndex,setEditIndex]=useState(null);
  const [isSubVisible, setIsSubVisible] = useState(false);
  const [SelectedType, setSelectedType] = useState(0);
  const [Gender,setGender]=useState("");
  const [Brand,setBrand]=useState("");
  const [Price,setPrice]=useState("");
  const [Quantity,setQuantity]=useState("");
  const[DispData,setDispData]=useState([]);

  useEffect(() => {
    console.log("36 UseEffect")
    GetLocalData();
  },[])


  // const onSelectValue = item => {
  //   // setIsVisible(false);
  //   console.log("27",name,item)
  //   setFieldValue(name, item);
  //   if (name !== 'childField') {
  //     setFieldValue('childField', '');
  //   }
  // };

  const GetLocalData=()=>{
     AsyncStorage.getItem(`${userId}`).then(data=>{
        let LocalDispData = JSON.parse(data);
        setDispData(LocalDispData); 
     })

  }

  //


  const setValue = ()=>{
    setFieldValue('mainField',DispData);
    setFieldValue('childField',DispData);
  }

  const AddEditData=(index)=>{
    let TempDispData=DispData;
    if(EditIndex === null)
    {    
        TempDispData.push({ 
          Gender:Gender,
          Brand:Brand,
          Price:Price,
          Quantity:Quantity
        })
    }
    else
    {
      TempDispData[EditIndex].Gender=Gender;
      TempDispData[EditIndex].Brand=Brand;
      TempDispData[EditIndex].Price=Price;
      TempDispData[EditIndex].Quantity=Quantity;
    }

    setDispData([...TempDispData])
    setEditIndex(null)
    setIsVisible(false);
   
    setValue();
  }

  const SaveData=async ()=>{
    try {
      await AsyncStorage.setItem(`${userId}`,JSON.stringify(DispData));
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
    setBrand("")
    setGender("")
    setQuantity("")
    setPrice("")
    setEditIndex(null)
    setIsVisible(true)
  }

  const onDeleteData=(val)=>{
    let TempDispData=DispData;
      if (val > -1) {
        TempDispData.splice(val, 1);
      }
      setDispData([...TempDispData])
  }

  const onEditPressed=(data,index)=>{
    setBrand(data.Brand)
    setGender(data.Gender)
    setQuantity(data.Quantity)
    setPrice(data.Price)
    setEditIndex(index)
    setIsVisible(true)
  }

  const setOptionValues=(val)=>{
    setIsSubVisible(false);
    switch (SelectedType) {
      case 0:
        setGender(val)
        break;

      case 1:
        setBrand(val)
        break;

      case 2:
        setPrice(val)
        break;
      
      case 3:
        setQuantity(val)
        break;
      
      default:
        break;
    }
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
                        Quantity : {item.Quantity.Detailed_Survey_Option_Name__c}
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
              <TextEle style={{color:'black'}}>
                    Gender
              </TextEle>
              <TouchableOpacity onPress={()=>{
                setIsSubVisible(true)
                setSelectedType(0)
                }}>
                  <View style={{borderWidth:1,height:50,borderRadius:10,marginTop:10,borderColor:"#90a4ae",justifyContent: 'space-between',alignItems: 'center',paddingHorizontal:10,flexDirection: 'row'}}>
                      <TextEle style={{color:Gender === "" ? "grey":'black'}}>
                        {Gender === "" ? "Please select a value" : Gender.Detailed_Survey_Option_Name__c}
                      </TextEle>

                      <Icon
                        name="caret-down-outline"
                        style={{ position: 'absolute', right: 10, top: 15 }}
                        size={24}
                        color="red"
                      />             
                  </View>
              </TouchableOpacity>

              <TextEle style={{color:'black',marginTop:25}}>
                    Brand
              </TextEle>
              <TouchableOpacity onPress={()=>{
                setIsSubVisible(true)
                setSelectedType(1)
                }}>
                  <View style={{borderWidth:1,height:50,borderRadius:10,marginTop:10,borderColor:"#90a4ae",justifyContent: 'space-between',alignItems: 'center',paddingHorizontal:10,flexDirection: 'row'}}>
                      <TextEle style={{color:Brand === "" ? "grey":'black'}}>
                        {Brand === "" ? "Please select a value" : Brand.Detailed_Survey_Option_Name__c}
                      </TextEle>            

                      <Icon
                        name="caret-down-outline"
                        style={{ position: 'absolute', right: 10, top: 15 }}
                        size={24}
                        color="red"
                      />              
                  </View>
              </TouchableOpacity>

              <TextEle style={{color:'black',marginTop:25}}>
                    Price
              </TextEle>
              <TouchableOpacity onPress={()=>{
                setIsSubVisible(true)
                setSelectedType(2)
                }}>
                  <View style={{borderWidth:1,height:50,borderRadius:10,marginTop:10,borderColor:"#90a4ae",justifyContent: 'space-between',alignItems: 'center',paddingHorizontal:10,flexDirection: 'row'}}>
                      <TextEle style={{color:Price === "" ? "grey":'black'}}>
                        {Price === "" ? "Please select a value" : Price.Detailed_Survey_Option_Name__c}
                      </TextEle>

                      <Icon
                        name="caret-down-outline"
                        style={{ position: 'absolute', right: 10, top: 15 }}
                        size={24}
                        color="red"
                      />                          
                  </View>
              </TouchableOpacity>

              
              <TextEle style={{color:'black',marginTop:25}}>
                    Quantity
              </TextEle>
              <TouchableOpacity onPress={()=>{
                setIsSubVisible(true)
                setSelectedType(3)
                }}>
                  <View style={{borderWidth:1,height:50,borderRadius:10,marginTop:10,borderColor:"#90a4ae",justifyContent: 'space-between',alignItems: 'center',paddingHorizontal:10,flexDirection: 'row'}}>
                      <TextEle style={{color:Quantity === "" ? "grey":'black'}}>
                        {Quantity === "" ? "Please select a value" : Quantity.Detailed_Survey_Option_Name__c}
                      </TextEle>
                      
                      <Icon
                        name="caret-down-outline"
                        style={{ position: 'absolute', right: 10, top: 15 }}
                        size={24}
                        color="red"
                      />                          
                  </View>
              </TouchableOpacity>

              
             
              <TouchableOpacity style={{width:'100%',padding:15,marginTop:50}} onPress={()=>AddEditData()}>
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
              
                          
          {/* <FlatList
            data={data}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
            )}
            renderItem={({ item }) => (
              <RadioCore
                key={item.optionId}
                option={{ text: item[textField], value: item[valueField] }}
                value={value[valueField]}
                onPress={() => onSelectValue(item)}
              />
            )}
            keyExtractor={item => `${item.Id}`}
          /> */}
          </SafeAreaView>
        </Modal>
      {/* <Button title="Ok" onPress={()=>onSelectValue("")}></Button> */}
      {/* <RectButton
        onPress={() => {
          setIsVisible(true);
          // setFieldTouched(name, true);
        }}>
        <View pointerEvents="none">
          <TextInput
            style={[styles.textInput, errorStyle]}
            value={value ? value[textField] : ''}
            placeholder={placeholder}
            editable={false}
          />
          <Icon
            name="caret-down-outline"
            style={{ position: 'absolute', right: 10, top: 7 }}
            size={24}
            color="red"
          />
        </View>
      </RectButton>
      {touched[name] && errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
          {errors[name]}
        </TextEle>
      )}
      <Modal
        isVisible={isVisible}
        style={{ backgroundColor: '#fff', margin: 0 }}
        onRequestClose={() => setIsVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
            )}
            renderItem={({ item }) => (
              <RadioCore
                key={item.optionId}
                option={{ text: item[textField], value: item[valueField] }}
                value={value[valueField]}
                onPress={() => onSelectValue(item)}
              />
            )}
            keyExtractor={item => `${item.Id}`}
          />
        </SafeAreaView>
      </Modal>
      {value?.subOrLoopingQtnOptions?.length > 1 && !!values[name] && (
        <Field
          name="childField"
          component={SingleSelectRadio}
          data={value.subOrLoopingQtnOptions}
          value={values.childField}
          valueField="Id"
          textField="Detailed_Survey_Option_Name__c"
          question={value.loopingQtnName}
          validate={val => {
            if (!val) {
              return 'Please Enter Field Value';
            }
            return '';
          }}
        />
      )}
      {value?.subOptions?.length > 1 && !!values[name] && (
        <Field
          name="childField"
          component={SingleSelectRadio}
          data={value.subOptions}
          value={values.childField}
          valueField="Id"
          textField="Detailed_Survey_Option_Name__c"
          question={value.loopingQtnName}
          validate={val => {
            if (!val) {
              return 'Please Enter Field Value';
            }
            return '';
          }}
        />
      )} */}
    </>
  );
};

export default SingleSelectRadio;
