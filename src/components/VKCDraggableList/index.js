/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect, useState,useRef } from 'react';
import { FlatList, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import SingleSelectRadio from '@components/SingleSelectRadio';
import MultiSelection from '@components/MultiSelection';
import VKCDraggableLoop from '@components/VKCDraggableList';
import TextInput from '../../components/TextInput/TextInput';
import SliderQuestion from '@components/SliderQuestion';
import { Formik, Field, FieldArray } from 'formik';

const VKCDraggableList = ({ field: { name, value }, form: { setFieldValue,values }, data, question }) => {
  const [temp, setTemp] = useState([]);
  const formRef = useRef();

  useEffect(() => {
    setFieldValue(name, data);
  }, []);

  const onSelect = item => {
    const index = temp.findIndex(x => x.optionId === item.optionId);
    let arr = [];
    if (index === -1) {
      item.IsSelected = true;
      arr = [...temp, item];
    } else {
      delete item.IsSelected;
      arr = [...temp.slice(0, index), ...temp.slice(index + 1)];
    }

    console.log("24",arr);
    const filteredStateData = value.filter(x => !arr.some(y => y.optionId === x.optionId));
    setFieldValue(
      name,
      [...arr, ...filteredStateData].map((x, i) => ({ ...x, seqNo: i + 1 })),
    );
    setTemp(arr);
  };

  return (
    <>
      <View>
        <TextEle>{question}</TextEle>
      </View>
      {!!value && value.length > 0 && (
        <FlatList
          data={value}
          renderItem={({ item, index }) => (
            <RectButton
              onPress={() => onSelect(item)}
              style={{
                backgroundColor: temp.some(x => x.optionId === item.optionId) ? 'red' : '#fff',

                margin: 5,
                padding: 10,
                shadowColor: '#000',
                borderRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
              }}>
              <TextEle
                variant="body1"
                style={{ color: temp.some(x => x.optionId === item.optionId) ? 'white' : 'black' }}>
                {index + 1}
              </TextEle>
              <TextEle
                variant="body1"
                style={{ color: temp.some(x => x.optionId === item.optionId) ? 'white' : 'black' }}>
                {item.optionName}
              </TextEle>
            </RectButton>
          )}
          keyExtractor={item => `draggable-item-${item.optionId}`}
        />
      )   
      }

      {temp.some((x) => x.isLoopingQtn) ?
      <View style={{width:'100%',marginTop:25}}>
              {
                temp.map((loopingQuestion) => { 
                  if(loopingQuestion.loopingQtnType === 'Slider') { 
                    console.log("89",loopingQuestion)
                    return(
                      <Field
                          component={SliderQuestion}
                          data={loopingQuestion}
                          name="subLoopSlider"
                          value={values.subLoopSlider}
                          question={loopingQuestion.loopingQtnName}
                          isSubLoop={true}
                          validate={value => {
                            if (!value) {
                              return 'Please Enter Field Value';
                            }
                            return '';
                          }}
                        />
                      )
                    }
                    else
                    {
                      return null 
                    }
                })  
              }              
      </View>
      :null
        
      }
    </>
  );
};

export default VKCDraggableList;
