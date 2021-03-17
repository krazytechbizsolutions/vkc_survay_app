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
  const [images,setImages]=useState([]);
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
    console.log("Effect")
    setFields([...fields])
    getLocation();
  },[])



  const getLocation =  async() => {
    const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (chckLocationPermission) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log("60",position);
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
                  console.log("60",position);
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

  const submitValues= async() =>{
    let hasNoErrors = true;
    let TempAdrField=adrFields  
    TempAdrField.forEach((res)=>{
      if(res.isImportant)
      {
        if(!res.validate())
        {
          hasNoErrors = false ;
        }
      }
    })
    setFields([...TempAdrField])
    console.log("132",hasNoErrors)
    if(hasNoErrors)
    { 
      await saveNewRetailerToLocal();
      // saveNewRetailerToUnplanned(null)
    }
  }

  const saveNewRetailerToLocal = async() => {
    let Token = await getToken();
    let temp_Id = `${Token.id.split('/').pop()}_${create_UUID()}`;
      let payload = {
        "accName": adrFields[4].value,
        "temp_account_id":temp_Id,
        "userId":  Token.id.split('/').pop(),
        "dateOfCreation": format(new Date(), 'yyyy-MM-dd'),
        "street": adrFields[2].value,
        "city": adrFields[3].value,
        "state": adrFields[4].value,
        "country": "India",
        "pincode": adrFields[5].value,
        "contactName": adrFields[7].value,
        "contactNumber": adrFields[8].value,
        "whatsAppNo": adrFields[9].value,
        "email_id": adrFields[10].value,
        "shopspace": adrFields[11].value,
        "retail_class": adrFields[12].value,
        "locationType": adrFields[13].value,
        "shopRegNumber": adrFields[13].value,
        "latitude": latitude,
        "longitude": longitude,
      }
    
      let newRetailers = await AsyncStorage.getItem('newRetailers');
      if(newRetailers)
      {
        newRetailers = JSON.parse(newRetailers)
      } else {
        newRetailers = [];
      }
      newRetailers.push(payload);
      await AsyncStorage.setItem('newRetailers', JSON.stringify(newRetailers))
      await saveNewRetailerToUnplanned(temp_Id)
      // await addImagesToLocal(temp_Id)
    }
  


  const saveNewRetailerToUnplanned = async (temp_Id) => {
    try {

        let Token = await getToken();

        let payload ={
          "state":adrFields[4].value,
          "salesRepId":null,
          "region":null,
          "customer_code":null,
          "country":null,
          "AreaName":adrFields[3].value,
          "areaId":null,
          "accType":"Dealer",
          "accName":adrFields[0].value,
          "accId":null,
          "isAddedRetailer":true,
          "dateAdded":format(new Date(), 'yyyy-MM-dd'),
          "temp_account_id": temp_Id
        }
          let unplannedVisits = await AsyncStorage.getItem('UnplannedVisits')
          unplannedVisits = JSON.parse(unplannedVisits);

          if(unplannedVisits)
          {
            unplannedVisits.push(payload)
          }
          else
          {
            unplannedVisits = [ payload ] 
          }
          
          unplannedVisits = unplannedVisits.filter((visits) => visits.dateAdded === format(new Date(), 'yyyy-MM-dd'))
          console.log("226",unplannedVisits);
          await AsyncStorage.setItem('UnplannedVisits',JSON.stringify(unplannedVisits))
          Alert.alert(
            'Retailer Added',
            'A New Retailer Has Been Added',
            [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
            { cancelable: false },
          )
    }

    catch(e)
    {
      Alert.alert(
        'New Retailer Not Added',
        e.message,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
        { cancelable: false },
      )
    }
  }

  const addImagesToLocal = async(temp_Id) =>{
      let getUnsyncedImages = JSON.parse(await AsyncStorage.getItem('unSyncedImages'));
      let Token = await getToken();
      if(getUnsyncedImages)
      {
        let retailImages = images.map((img,index)=>{
            return {
                surveyId:null,
                accountId: null,
                userId:  Token.id.split('/').pop(),
                qtnId: null,
                Sequence_No: null,
                imageName: adrFields[0].value + "_" + format(new Date(), 'yyyy-MM-dd') + "_" + index,
                imageType: img.type,
                imageURL: img.uri,
                temp_account_id:temp_Id,
                relatedTo: 'Retailer'
            }
        })

        getUnsyncedImages = [...getUnsyncedImages,...retailImages]
        await AsyncStorage.setItem('unSyncedImages',JSON.stringify(getUnsyncedImages))
      }
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
