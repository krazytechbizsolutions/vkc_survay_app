/* eslint-disable react-native/no-inline-styles */
import TextEle from '@components/TextEle';
import React,{useState,useEffect,useContext} from 'react';
import { View,TextInput,ScrollView,Picker,TouchableOpacity,Platform,ActionSheetIOS,Modal,Text,FlatList,Image, PermissionsAndroid,Alert } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { launchCamera } from 'react-native-image-picker';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import { format } from 'date-fns';
import { fields } from './fields';
// import { getLocation } from 'src/utils';
import {getLocation} from '../../utils/index'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '../../utils/index'
import { v4 as uuidv4 } from 'uuid';
import { ScreenContext } from '../../context/screenContext';



const AddRetailer = ({navigation}) => {
  let today = format(new Date(), 'yyyy-MM-dd');

  const [adrFields,setFields]=useState([]);
  const [storeFrontImage,setStoreFrontImage]=useState(null);
  const [storeFrontImageRequiredError,setStoreFrontImageRequiredError]=useState(null);
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("")
  const { syncData, setSyncData } = useContext(ScreenContext);
  

  const create_UUID =() => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  useEffect(()=>{
    setFields(fields.map((fld) => {
      fld.value = fld.defaultValue;
      fld.errorMessage = null;
      return fld;
    }))
    getCordinates();
  },[])

  const getCordinates =  async() => {
    let coord = await getLocation();
    setLatitude(coord.latitude);
    setLongitude(coord.longitude);
};


  const setFieldValue = (e,index) =>{
    adrFields[index].value = e;
    setFields([...adrFields])
  } 

  const submitValues= async() =>{
    let tempAdrFields = adrFields.map(fld => {
      fld.isImportant && fld.validate();
      return fld;
    });
    
    setFields(tempAdrFields);
    setStoreFrontImageRequiredError(storeFrontImage ? null : 'Image is required');
    
    if(tempAdrFields.filter(fld => !!fld.errorMessage).length > 0 || !storeFrontImage){
      return;
    }
    
    await saveNewRetailerToLocal();
  }

  const saveNewRetailerToLocal = async() => {
    let Token = await getToken();
    let temp_Id = `${Token.id.split('/').pop()}_${create_UUID()}`;
    let payload = Object.assign({
      "temp_account_id":temp_Id,
      "userId":  Token.id.split('/').pop(),
      "dateOfCreation": today,
      "latitude": latitude,
      "longitude": longitude,
      "isAddedRetailer":true,
      "accType": "Retailer",
      "dateAdded": today,
    }, Object.fromEntries(adrFields.map((f) => [f.name, f.value])));

    await saveObjectIntoArrayOfStorage('newRetailers', payload)
    
    await saveObjectIntoArrayOfStorage('UnplannedVisits', payload)
    

    let retailerImagePayload = {
      surveyId:null,
      accountId: null,
      temp_account_id: payload.temp_account_id,
      userId: payload.userId,
      qtnId: null,
      Sequence_No: 1,
      dateAdded: today,
      imageName: payload.accName + "_" + today + "_1",
      imageType: "JPG",
      imageURL: storeFrontImage.uri,
      relatedTo: 'Retailer'
    }
    await saveObjectIntoArrayOfStorage('unSyncedImages', retailerImagePayload);
    
    Alert.alert(
      'Add Customer',
      'Customer saved.',
      [{ text: 'OK', onPress: () => {
        if(!syncData){
          setSyncData(true)
        }
        navigation.popToTop()
      } }],
      { cancelable: false },
    )
  }
  

  const saveObjectIntoArrayOfStorage = async (key, obj) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : []
    } catch(e){
      storageData = [];
    }
    storageData.push(obj);
    await AsyncStorage.setItem(key, JSON.stringify(storageData))
  }

  let showFields=adrFields.map((result,index)=>{
    return (
      <View style={{width:'100%',marginVertical:7}}>
        <TextEle style={{opacity:0.7,marginBottom:5}}>{result.label} {result.isImportant ? "*":""}</TextEle>
        {
        result.type === 1 ? 
          <View style={{width:'100%',height:50,borderWidth:1,marginTop:5,borderRadius:5,borderColor:"#90a4ae",paddingLeft:5}}>
              <TextInput value={result.value} maxLength={index === 8 ? 10 : 100} keyboardType = {result.isNum ? "numeric":""} onChangeText={(e)=>setFieldValue(e,index)} placeholder="Please Input A Value"/>
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
        { result.errorMessage ? <TextEle style={{opacity:0.7,color:'red',fontSize:12}}>{result.errorMessage}</TextEle>:null}
      </View>
    )
  })

  return (
    <ScrollView style={{width:'100%'}}>
      <View style={{padding:10}}>
        {showFields}
        <View style={{width:'100%',marginVertical:7}}>
            <TextEle style={{opacity:0.7,marginBottom:5}}>Store Shop Front Image *</TextEle>
          { storeFrontImage ? 
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <TouchableOpacity style={{zIndex:2}} onPress={()=>setStoreFrontImage(null)}>
                      <View style={{width:30,height:30,borderRadius:100,backgroundColor:'red',elevation:1,alignItems:'center',justifyContent:'center'}}>
                          <Icon
                                name="md-close"
                                style={{ right: 0, top: 0 }}
                                size={18}
                                color="white"
                              />
                      </View>
                    </TouchableOpacity>
                    <Image style={{width:'100%',height:100,marginTop:-15}} source={{uri:storeFrontImage.uri}} />
                  </View>
            </View>
          : 
          <TouchableOpacity style={{ padding: 15, paddingLeft: 0 }} onPress={()=>{
            launchCamera(
              {
                mediaType: 'photo',
                maxWidth:500,
                maxHeight:500
              },
              res => {
                setStoreFrontImage(res)
              },
            );
          }}>
                <View style={{width:150,height:50,borderRadius:5,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                    <TextEle style={{color:'#fff'}}> Capture Image </TextEle>
                </View>
          </TouchableOpacity>
          
          }
          <TextEle style={{opacity:0.7,marginBottom:5,color:'red',fontSize:12}}>{storeFrontImageRequiredError}</TextEle>
        </View>

        <TouchableOpacity style={{width:'100%',padding:15}} onPress={()=>submitValues()}>
              <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                  <TextEle style={{color:'#fff'}}>
                      Submit
                  </TextEle>
              </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
    
  );
};

export default AddRetailer;
