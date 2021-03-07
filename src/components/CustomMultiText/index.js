import TextEle from '@components/TextEle';
import VKCButton from '@components/VKCButton';
import { Field } from 'formik';
import React, { useState,useEffect } from 'react';
import { View, TextInput, Pressable,FlatList,TouchableOpacity,Modal} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '@utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CustomMultiText = ({
    field: { name, value },
    form: { touched, errors, setFieldValue, setFieldTouched, values },
    question
    }) =>{

    const [AccountData,setAccountData]=useState([]);
    const [ShowAccountData,setShowAccountData]=useState([]);
    const [SelectedData,setSelectedData]=useState([]);
    const [isVisible,setIsVisible]=useState(false);
    const [searchTextInput,setSearchTextInput]=useState("")
    const [searchText,setSearchText]=useState("")

    useEffect(() =>{
        AsyncStorage.getItem('AccountData').then(data=>{
            let AccountDataJSON = JSON.parse(data);
            // console.log("23",AccountDataJSON)
            setAccountData([...AccountDataJSON])
        })
    },[])

    useEffect(()=>{
        SearchTextInput("")
    },[AccountData])

    const onAddSelectedData=(item)=>{
        let tmpSelectedData = SelectedData;
        tmpSelectedData.push(item)
        setSelectedData([...tmpSelectedData]);
        setIsVisible(false)
        setFieldValue('mainField',SelectedData);
        setFieldValue('childField',[]);
      }
    
      const SearchTextInput=(e)=>{
          setSearchTextInput(e);
    
          let tempShowAccountData = [];
    
          AccountData.every((element,index)=>{
              if(tempShowAccountData.length < 5){
                if(element.accName.includes(e) ||(element.customer_code &&  element.customer_code.includes(e)))
                {
                  tempShowAccountData.push(element);
                }
                return true;
              }
          })
          /*
            AccountData.filter((element)=>{ return (element.accName.includes(e) ||(element.customer_code &&  element.customer_code.includes(e))); }}).splice(0, 5);
          */


          tempShowAccountData.sort((a,b) => a.accName.localeCompare(b.accName));
           setShowAccountData([...tempShowAccountData])
      }

    return(
        <View style={{width: '100%'}}>
            <TextEle>{question}</TextEle>
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'flex-start',padding:10}}>
                <View style={{width:'100%',justifyContent: 'center',marginTop:20}}>
                        <FlatList
                            data={SelectedData}
                            renderItem={({ item,index }) => (
                                    <View style={{width:'100%',padding:10,borderRadius:10,justifyContent:'flex-start',borderWidth:1,borderColor:'grey',marginVertical:10}}>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Name : {item.accName}</TextEle>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Type : {item.accType}</TextEle>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Area Name : {item.AreaName}</TextEle>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>State : {item.state}</TextEle>
                                    </View>
                            )}
                            keyExtractor={(item,index) => `${index}`}
                        />
                </View>

                <TouchableOpacity onPress={()=>setIsVisible(true)} style={{width:'100%'}}>
                    <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"red",alignItems:'center',justifyContent:'center'}}>
                        <TextEle style={{color:'white',fontSize:20}}>Add</TextEle>
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={isVisible}
                    style={{  marginTop:20, alignItems: 'center', justifyContent: 'center',padding:10 }}
                    onRequestClose={() => setIsVisible(false)}>
                        <View style={{width:'100%',flexDirection:'row',padding:10,justifyContent:'space-between'}}>
                            <View style={{width:'75%',borderWidth:1,height:45,borderRadius:5}}>
                                <TextInput value={searchTextInput} style={{height:45}} onChangeText={SearchTextInput} />
                            </View>

                            <View style={{width:'20%',alignItems:'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={()=>setIsVisible(false)}>
                                    <TextEle style={{color:'black',fontSize:14}}>Cancel</TextEle>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{height:'100%',flex:1}}>
                            <FlatList
                            data={ShowAccountData}
                            renderItem={({ item,index }) => (
                                <TouchableOpacity onPress={()=>onAddSelectedData(item)} style={{width:'100%',alignItems:'center',justifyContent: 'center'}}>
                                    <View style={{width:'90%',padding:10,borderRadius:5,justifyContent:'flex-start',borderWidth:1,marginVertical:10,borderColor:'grey'}}>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Name : {item.accName}</TextEle>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Type : {item.accType}</TextEle>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Area Name : {item.AreaName}</TextEle>
                                        <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>State : {item.state}</TextEle>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item,index) => `${index}`}
                        />
                        </View>
                    </Modal>
            </View>
        </View>
    )

}


export default CustomMultiText;