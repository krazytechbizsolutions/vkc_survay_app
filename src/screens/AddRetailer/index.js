/* eslint-disable react-native/no-inline-styles */
import TextEle from '@components/TextEle';
import React,{useState,useEffect} from 'react';
import { View,TextInput,ScrollView,Picker,TouchableOpacity,Platform,ActionSheetIOS,Modal,Text,FlatList,Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { launchCamera } from 'react-native-image-picker';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import { fields } from './fields';

const AddRetailer = () => {
  
  const [adrFields,setFields]=useState([]);
  const [images,setImages]=useState([]);
  const [isVisible,setIsVisible]=useState(false);

  const selectImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo...'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            //
          } else if (buttonIndex === 1) {
            launchCamera(
              {
                mediaType: 'photo',
              },
              res => {},
            );
          }
        },
      );
    } else {
      setIsVisible(true);
    }
  };

  useEffect(()=>{
    console.log("Effect")
    setFields([...fields])
  },[])

  const setImage=(res)=>{
    let TempImages = images;
    images.push(res);
    console.log(TempImages)
    setImages([...TempImages]);
  }

  const removeImage = (fileName) => {
    let TempImages = images.filter((Img) => Img.fileName !== fileName)
    setImages([...TempImages]);
  }


  const setFieldValue = (e,index) =>{
    fields[index].value = e;
    setFields([...fields])
  } 

  const submitValues=()=>{
    let hasErrors = false;
    let TempAdrField=adrFields  
    TempAdrField.forEach((res)=>{
      if(res.isImportant)
      {
        res.validate()
      }
    })
    setFields([...TempAdrField])
  }

  let showFields=adrFields.map((result,index)=>{
    return (
      result.isVisible ?
      <View style={{width:'100%',marginVertical:7}}>
        <TextEle style={{opacity:0.7,marginBottom:5}}>{result.label}</TextEle>
        {
        result.errorMessage ? 
        <TextEle style={{opacity:0.7,color:'red',fontSize:12}}>Need To Fill Up This Field</TextEle>:null}
        {
        result.type === 1 ? 
          <View style={{width:'100%',height:50,borderWidth:1,marginTop:5,borderRadius:5,borderColor:"#90a4ae",paddingLeft:5}}>
              <TextInput value={result.value} onChangeText={(e)=>setFieldValue(e,index)} placeholder="Please Input A Value"/>
          </View>
        :
        result.type === 4 ?
        <View style={{width:'100%',borderWidth:1,borderRadius:5,borderColor:'#90a4ae'}}>
          <Picker
              selectedValue={result.value}
              style={{ height: 50, width: '100%' }}
              onValueChange={(e)=>setFieldValue(e,index)}
            >
             { 
                result.options.map((opt) => {
                  return <Picker.Item label={opt} value={opt} />
                })
             }
            </Picker>
        </View>
        :null
        }   
      </View>:null
    )
  })

  return (
    <ScrollView style={{width:'100%'}}>
      <View style={{padding:10}}>
        {showFields}
        <View style={{width:'100%',marginVertical:7}}>
            <TextEle style={{opacity:0.7,marginBottom:5}}>Select Images</TextEle>
            <TouchableOpacity style={{padding:15}} onPress={()=>setIsVisible(true)}>
                <View style={{width:150,height:50,borderRadius:5,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                    <TextEle style={{color:'#fff'}}>
                        Select Image
                    </TextEle>
                </View>
          </TouchableOpacity>

          <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
              <FlatList 
                data = {images}
                renderItem = {(img)=>(
                  <View style={{width:'30%',alignItems:'flex-end'}}>
                    <TouchableOpacity style={{zIndex:2}} onPress={()=>removeImage(img.item.fileName)}>
                      <View style={{width:30,height:30,borderRadius:100,backgroundColor:'red',elevation:1,alignItems:'center',justifyContent:'center'}}>
                          <Icon
                                name="md-close"
                                style={{ right: 0, top: 0 }}
                                size={18}
                                color="white"
                              />
                      </View>
                    </TouchableOpacity>
                    <Image style={{width:'100%',height:100,marginTop:-15}} source={{uri:img.item.uri}} />
                  </View>
                )}
                keyExtractor={(item,index)=> index}
                numColumns="3"
              />
          </View>
        </View>

        <TouchableOpacity style={{width:'100%',padding:15}} onPress={()=>submitValues()}>
              <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                  <TextEle style={{color:'#fff'}}>
                      Submit
                  </TextEle>
              </View>
        </TouchableOpacity>
      </View>
        <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)} transparent={true}>
          <View style={{ backgroundColor: '#fff' }}>
            <Text style={{ padding: 20 }}>Select Image</Text>
            <TouchableOpacity
              onPress={() => {
                launchCamera(
                  {
                    mediaType: 'photo',
                    maxWidth:500,
                    maxHeight:500
                  },
                  res => {
                    // console.log("78",res);
                    setImage(res);
                  },
                );
                setIsVisible(false);
              }}>
              <RectButton style={{ padding: 20 }}>
                <Text>Take Photo...</Text>
              </RectButton>
            </TouchableOpacity>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <RectButton style={{ padding: 10 }}>
                  <Text style={{ color: 'red' }}>Cancel</Text>
                </RectButton>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ScrollView>
    
  );
};

export default AddRetailer;
