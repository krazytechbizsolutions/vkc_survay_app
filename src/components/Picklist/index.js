import { RadioCore } from '@components/radio/Radio';
import TextEle from '@components/TextEle';
import { Field } from 'formik';
import React, { useState,useEffect } from 'react';
import { FlatList, View,Button,Picker,TouchableOpacity,Alert } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';

const PickList = ({seqNo,getSeq,subOpt,DataAdd,getData,optionName,value})=>{
        const [Data,setData]=useState("")
        const [IsModalVisible,setIsModalVisible]=useState(false);
        
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

        const setOptions=(result)=>{
            setIsModalVisible(false);
            setData(result)
        }

        return(
            <>
            <TouchableOpacity onPress={()=>{
                setIsModalVisible(true)
                }}>
                  <View style={{borderWidth:1,height:50,borderRadius:10,marginTop:10,borderColor:"#90a4ae",justifyContent: 'space-between',alignItems: 'center',paddingHorizontal:10,flexDirection: 'row'}}>
                      <TextEle style={{color:Data === "" ? "grey":'black'}}>
                        {Data === "" ? "Please select a value" : Data.Detailed_Survey_Option_Name__c}
                      </TextEle>            

                      <Icon
                        name="caret-down-outline"
                        style={{ position: 'absolute', right: 10, top: 15 }}
                        size={24}
                        color="red"
                      />              
                  </View>
              </TouchableOpacity>

                <Modal
                    isVisible={IsModalVisible}
                    style={{  margin: 0, alignItems: 'center', justifyContent: 'center',padding:10 }}
                    onRequestClose={() => setIsModalVisible(false)}>
                    <View style={{width:'100%',backgroundColor:'white',padding:10}}>
                        {subOpt.subOrLoopingQtnOptions.map(result=>{
                            return(
                            <TouchableOpacity onPress={()=>setOptions(result)}>
                                <TextEle style={{color:'black',marginVertical:10}}>
                                    {result.Detailed_Survey_Option_Name__c}
                                </TextEle>
                            </TouchableOpacity>
                            )
                        })}
                    </View>
                </Modal> 
        </>
        )
}


export default PickList;
