/* eslint-disable react-native/no-inline-styles */
import TextEle from '@components/TextEle';
import React,{useState,useEffect} from 'react';
import { View,TextInput,ScrollView,Picker,TouchableOpacity,Platform,ActionSheetIOS,Modal,Text,FlatList,Image, PermissionsAndroid,Alert } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { launchCamera } from 'react-native-image-picker';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import { format } from 'date-fns';
import { fields } from './fields';
import { getLocation } from 'src/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '../../utils/index'
import { v4 as uuidv4 } from 'uuid';



const AddRetailer = ({navigation}) => {
  
  const [adrFields,setFields]=useState([]);
  const [storeFrontImage,setStoreFrontImage]=useState(null);
  const [storeFrontImageRequiredError,setStoreFrontImageRequiredError]=useState(null);
  const [isVisible,setIsVisible]=useState(false);
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("")
  
  const create_UUID =() => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

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
    setFields(JSON.parse(JSON.stringify(fields)))
    getLocation();
  },[])

  const getLocation =  async() => {
    const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (chckLocationPermission) {
          Geolocation.getCurrentPosition(
            (position) => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
            },
            (error) => {
              // See error code charts below.
              askLocation();
              // console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    } 
};

const askLocation = async () =>{
  try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Walkaroo Connect Needs Access To Your Location',
                'message': 'We required Location permission in order to get device location ' +
                    'Please grant us.'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              Geolocation.getCurrentPosition(
                (position) => {
                  setLatitude(position.coords.latitude);
                  setLongitude(position.coords.longitude);
                },
                (error) => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );  
        } else {
            alert("You don't have access for the location");
        }
    } catch (err) {
        alert(err)
    }
}


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
      "dateOfCreation": format(new Date(), 'yyyy-MM-dd'),
      "latitude": latitude,
      "longitude": longitude,
      "isAddedRetailer":true,
      "dateAdded":format(new Date(), 'yyyy-MM-dd'),
    }, Object.fromEntries(adrFields.map((f) => [f.name, f.value])));

    await saveObjectIntoArrayOfStorage('newRetailers', payload)
    
    await saveObjectIntoArrayOfStorage('UnplannedVisits', payload)          
    // unplannedVisits = unplannedVisits.filter((visits) => visits.dateAdded === format(new Date(), 'yyyy-MM-dd'))
    

    let retailerImagePayload = Object.assign(payload, {
      surveyId:null,
      accountId: null,
      qtnId: null,
      Sequence_No: null,
      imageName: payload.accName + "_" + format(new Date(), 'yyyy-MM-dd') + "_",
      imageType: storeFrontImage.type,
      imageURL: storeFrontImage.uri,
      relatedTo: 'Retailer'
    })
    await saveObjectIntoArrayOfStorage('unSyncedImages', retailerImagePayload);
    
    Alert.alert(
      'Add Retailer',
      'Retailer saved.',
      [{ text: 'OK', onPress: () => navigation.popToTop() }],
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
      result.isVisible ?
      <View style={{width:'100%',marginVertical:7}}>
        <TextEle style={{opacity:0.7,marginBottom:5}}>{result.label} {result.isImportant ? "*":""}</TextEle>
        {
        result.errorMessage ? 
        <TextEle style={{opacity:0.7,color:'red',fontSize:12}}>{result.errorMessage}</TextEle>:null}
        {
        result.type === 1 ? 
          <View style={{width:'100%',height:50,borderWidth:1,marginTop:5,borderRadius:5,borderColor:"#90a4ae",paddingLeft:5}}>
              <TextInput value={result.value} keyboardType = {result.isNum ? "numeric":""} onChangeText={(e)=>setFieldValue(e,index)} placeholder="Please Input A Value"/>
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
            <TextEle style={{opacity:0.7,marginBottom:5}}>Store Shop Front Image</TextEle>
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
          <TouchableOpacity style={{padding:15}} onPress={()=>setIsVisible(true)}>
                <View style={{width:150,height:50,borderRadius:5,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                    <TextEle style={{color:'#fff'}}>
                        Capture Image
                    </TextEle>
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
        <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)} transparent={true}>
          <View style={{ backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
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
                    setStoreFrontImage(res)
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
