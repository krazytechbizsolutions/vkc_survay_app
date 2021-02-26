import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import { Field } from 'formik';
import React, { useState,useEffect } from 'react';
import { FlatList, View,Button,Picker,TouchableOpacity,Alert,TextInput } from 'react-native';
import Modal from 'react-native-modal';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';


const CustomTextInput = ({seqNo,DataAdd,getData,optionName,value})=>{

    const [Data,setData]=useState("");

    useEffect(() => {
        if(DataAdd)
        {
            getData(Data,optionName);
        }
        
        if(value !== "")
        {    
            let valueJson = JSON.parse(value);
            console.log("17",valueJson[optionName]);
            setData(valueJson[optionName]);
        }
      },[DataAdd,value])

    return(
        <View style={{width:'100%',height:50,borderWidth:1,marginTop:5,borderRadius:10,borderColor:"#90a4ae"}}>
            <TextInput value={Data} onChangeText={(e)=> setData(e)} placeholder="Please Input A Value"/>
        </View>   
    )

}

export default CustomTextInput;