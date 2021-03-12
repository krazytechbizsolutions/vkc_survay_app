/* eslint-disable react-native/no-inline-styles */
import TextEle from '@components/TextEle';
import React from 'react';
import { View,Picker,TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Form from '../../components/form/Form';
import fields from './fields';

const UnPlannedVisit = () => {
  const createUnplannedVisit = values => {
  };

  return (
    <View style={{flex:1,width:'100%',padding:10}}>
        <TextEle style={{opacity:0.7,fontSize:20}}>Retailers</TextEle>
        <View style={{width:'100%',borderWidth:1,borderRadius:5,borderColor:'#90a4ae',marginTop:10}}>
            <Picker
                  selectedValue={""}
                  style={{ height: 50, width: '100%' }}
                  onValueChange={(e)=>{}}
                >
            </Picker>
        </View>
        <TouchableOpacity style={{width:'100%',padding:15}} onPress={()=>{}}>
              <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                  <TextEle style={{color:'#fff'}}>
                      Save
                  </TextEle>
              </View>
        </TouchableOpacity>
        
    </View>
  );
};

export default UnPlannedVisit;
