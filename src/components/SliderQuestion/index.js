/* eslint-disable react/prop-types */
import React,{useState, useEffect} from 'react';
import { Slider, View, Dimensions} from 'react-native';
import TextEle from '@components/TextEle';

const { width: screenWidth } = Dimensions.get('window');

const SliderQuestion = ({
  field: { name, value = 0 },
  form: { touched, errors, setFieldValue },
  data,
  question,
  isSubLoop
}) => {
  const left = (value * (screenWidth - 60)) / 100 - 8;
  const [sliderVal,setSliderVal] =useState(0)

  useEffect(() =>{
    if(!data.Min_Limit__c){
      data.Min_Limit__c = 0;
    }
    if(!data.Max_Limit__c){
      data.Max_Limit__c = 100;
    }
    setSliderVal(value);
  },[])

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <TextEle variant="title" style={{ marginBottom: 10 }}>
        {question}
      </TextEle>
      
      {touched[name] && errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 10 }}>
          {errors[name]}
        </TextEle>
      )}
      
      <View style={{width:'100%',justifyContent:'center',alignItems: 'center'}}>
        <TextEle style={{color:'grey',marginBottom:-30}}> {sliderVal} </TextEle>
      </View>

      <Slider
        style={{ marginTop: 20 }}
        minimumValue={data.Min_Limit__c}
        maximumValue={data.Max_Limit__c}
        thumbTintColor="red"
        minimumTrackTintColor="red"
        maximumTrackTintColor="#000000"
        value={value || data.Min_Limit__c}
        onValueChange={val => {
          setSliderVal(Math.floor(val));
          setFieldValue(name, Math.floor(val));
        }}
      />
      
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
          <TextEle>{data.Min_Limit__c}</TextEle>
          <TextEle>{data.Max_Limit__c}</TextEle>
      </View>
      
    </View>
  );
};

export default SliderQuestion;
