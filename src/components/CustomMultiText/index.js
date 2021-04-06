import TextEle from '@components/TextEle';
import VKCButton from '@components/VKCButton';
import { Field } from 'formik';
import React, { useState,useEffect, useRef } from 'react';
import { View, TextInput, Pressable,FlatList,TouchableOpacity,Modal,Picker,Alert} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '@utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddUnplannedVisits from 'src/screens/AddUnplannedVisits';
import { format } from 'date-fns';


const CustomMultiText = ({
    field: { name, value },
    form: { touched, errors, setFieldValue, setFieldTouched, values },
    question,
    object_c,
    filter_type_c,
    surveyObj,
    isUnplanned,
    backToHome
    }) =>{

    const flastListRef = useRef();
    const [AccountData,setAccountData]=useState([]);
    const [ShowAccountData,setShowAccountData]=useState([]);
    const [SelectedData,setSelectedData]=useState([]);
    const [isVisible,setIsVisible]=useState(false);
    const [searchTextInput,setSearchTextInput]=useState("")
    const [searchText,setSearchText]=useState("")
    const errorMsg = touched[name] && errors[name];


    useEffect(() =>{
        
        if(isUnplanned)
        {
            AsyncStorage.getItem('DealerAndRetailers').then(data => {
                console.log("33",data)
                let dealerAndRetailers = JSON.parse(data);
                setAccountData([...dealerAndRetailers])
            })
        }
        else
        {
            AsyncStorage.getItem('AccountData').then(data=>{
                let AccountDataJSON = JSON.parse(data);
                if(AccountDataJSON){
                    AccountDataJSON = AccountDataJSON.data.filter(x => object_c.split(" & ").indexOf(x.accType) > -1 && x[filter_type_c.toLowerCase()] === surveyObj[filter_type_c.toLowerCase()] )
                    console.log("53",filter_type_c,AccountDataJSON.length)
                    setAccountData([...AccountDataJSON])
                }
            })

            // setSelectedData(value);
        }
    },[])

    useEffect(()=>{
        SearchTextInput("")
    },[SelectedData])

    useEffect(()=>{
        console.log("In Here")
        SearchTextInput("")
    },[AccountData])

  useEffect(() => {
    if (!!(touched[name] && errors[name]) && flastListRef.current) {
      flastListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [touched, errors, name]);

    const onAddSelectedData=(item)=>{
        SearchTextInput("")
        let tmpSelectedData = SelectedData;
        let isExist = tmpSelectedData.some((e) => e.accName === item.accName)
        if(!isExist)
        {
            item.dateAdded = format(new Date(), 'yyyy-MM-dd');
            tmpSelectedData.push(item)
            setSelectedData([...tmpSelectedData]);
            
        }
        setIsVisible(false)
        if(!isUnplanned)
        {
            setFieldValue('mainField',SelectedData);
            setFieldValue('childField',[]);   
        }
      }

    const checkAccountExist = (UnplannedVisits,accName) => {
        console.log("66",UnplannedVisits)
        let isExist = UnplannedVisits.filter(e => {return e.dateAdded === format(new Date(), 'yyyy-MM-dd') && e.accName === accName})
        if(isExist.length  === 0)
        {
            return true
        }
        return false
    }

    const removeSelectedData = (accName) =>{
        // SearchTextInput("")
        let filteredSelectedData = SelectedData.filter((acc)=>{
          return acc.accName !== accName
        })
        setSelectedData([...filteredSelectedData])
        
        if(!isUnplanned)
        {
            setFieldValue('mainField',filteredSelectedData.length === 0 ? "":filteredSelectedData);
            setFieldValue('childField',[]);   
        }
      }
    
      const askIfremove = (accName) => {
        Alert.alert(
          'Data Removal',
          'Do You Want To Remove This Account',
          [{ text: 'Cancel', onPress: () => {}
            },
            { text: 'OK', onPress: () => removeSelectedData(accName)}],
          { cancelable: false },
        );
      }

    const checkAccountSelected = (accName) =>{
        // console.log("124",SelectedData);
        return SelectedData.some((acc)=>{
            console.log(accName,acc.accName)
            return acc.accName === accName
        })
    }
    
      const SearchTextInput=async(e)=>{
          setSearchTextInput(e);

          let tempShowAccountData = [];
          let UnplannedVisits = JSON.parse (await AsyncStorage.getItem('UnplannedVisits'));
         
                  AccountData.every((element,index)=>{
                    if(tempShowAccountData.length < 5){
                        // console.log("138",element)
                        if(element.accName.includes(e) ||(element.customer_code &&  element.customer_code.includes(e)))
                        {
                            if(isUnplanned)
                            {
                                if(checkAccountExist(UnplannedVisits ? UnplannedVisits : [],element.accName) && !checkAccountSelected(element.accName))
                                {
                                        tempShowAccountData.push(element);
                                }
                            }
                            else
                            {
                               if(!checkAccountSelected(element.accName)) 
                                {
                                    tempShowAccountData.push(element);
                                }
                            }       
                        }
                        return true;
                    }
                })
          /*
            AccountData.filter((element)=>{ return (element.accName.includes(e) ||(element.customer_code &&  element.customer_code.includes(e))); }}).splice(0, 5);
          */
          tempShowAccountData.sort((a,b) => a.accName.localeCompare(b.accName));
        //   console.log("162",tempShowAccountData)
           setShowAccountData([...tempShowAccountData])
      }
  

  getArrayFromStorage = async (key) => {
    let storageData = await AsyncStorage.getItem(key);
    try{
      storageData = storageData ? JSON.parse(storageData) : []
    } catch(e){
      storageData = [];
    }
    return storageData;
  }

     const onAddUnplannedVisits = async () => {

        if(SelectedData.length == 0){
            Alert.alert(
                'Add unplanned visits',
                'No retailers selected',
                [{ text: 'OK', onPress: () =>{} }],
                { cancelable: false },
            )
            return;
        }
        try 
        {
          let UnplannedVisits = await getArrayFromStorage('UnplannedVisits');
          
          UnplannedVisits = [...UnplannedVisits,...SelectedData];
          UnplannedVisits = UnplannedVisits.filter((visits) => visits.dateAdded === format(new Date(), 'yyyy-MM-dd'))

          await AsyncStorage.setItem('UnplannedVisits',JSON.stringify(UnplannedVisits));
          Alert.alert(
            'Add unplanned visits',
            'Selected retailers are saved for unplanned visits',
            [{ text: 'OK', onPress: () => backToHome() }],
            { cancelable: false },
          )
        } catch(e) {}
      }

    return(
        <>
        {isUnplanned ? 
        <View style={{flex:1,width:'100%',padding:10}}>
            <TextEle style={{opacity:0.7,fontSize:20}}>Retailers</TextEle>
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableOpacity style={{width:'50%',padding:15}} onPress={()=>setIsVisible(true)}>
                    <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"#ef4b4b",justifyContent:'center',alignItems:'center'}}>
                        <TextEle style={{color:'#fff',fontSize:16}}>
                            Add Retailers
                        </TextEle>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width:'50%',padding:15}} onPress={()=>onAddUnplannedVisits()}>
                    <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"#ef4b4b",justifyContent:'center',alignItems:'center'}}>
                        <TextEle style={{color:'#fff',fontSize:16}}>
                            Submit
                        </TextEle>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{width:'100%',borderRadius:5,marginTop:25,alignItems:'center'}}>
                {
                    SelectedData.length > 0 ? 
                    <View style={{width:'100%',justifyContent: 'center'}}>
                        <FlatList
                            ref={flastListRef}
                            data={SelectedData}
                            renderItem={({ item,index }) => 
                            {
                                return(
                                    
                                        <View style={{width:'100%',padding:10,borderRadius:10,justifyContent:'flex-start',borderWidth:1,borderColor:'grey',marginVertical:10}}>
                                            <View style={{width:'100%',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
                                                <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Name : {item.accName}</TextEle>
                                                <TouchableOpacity onPress={()=>askIfremove(item.accName)}>
                                                    <Icon
                                                        name="close"
                                                        style={{ right: 0, top: 3 }}
                                                        size={20}
                                                        color="grey"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            
                                            <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Type : {item.accType}</TextEle>
                                            <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Area Name : {item.AreaName}</TextEle>
                                            <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>State : {item.state}</TextEle>
                                            <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Customer Code : {item.customer_code}</TextEle>
                                        </View>
                                    
                            )
                        }}
                            keyExtractor={(item,index) => `${index}`}
                        />
                    </View>
                    :
                    <TextEle style={{opacity:0.7,fontSize:16}}>No Retailers Selected</TextEle>
                }
            </View>
           
            
        </View>
        :
        <View style={{width: '100%'}}>
            <TextEle style={{color: 'red',fontSize:12}}>{errorMsg}</TextEle>
            <TextEle>{question}</TextEle>
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'flex-start',padding:10}}>
                
                <TouchableOpacity onPress={()=>setIsVisible(true)} style={{width:'100%'}}>
                    <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"red",alignItems:'center',justifyContent:'center'}}>
                        <TextEle style={{color:'white',fontSize:20}}>Add</TextEle>
                    </View>
                </TouchableOpacity>
                
                <View style={{width:'100%',justifyContent: 'center',marginTop:20}}>
                        <FlatList
                            data={SelectedData}
                            renderItem={({ item,index }) => 
                            {
                              return (
                                        <TouchableOpacity style={{width:'100%'}} onPress={()=>askIfremove(item.accName)}>
                                            <View style={{width:'100%',padding:10,borderRadius:10,justifyContent:'flex-start',borderWidth:1,borderColor:'grey',marginVertical:10}}>
                                                <View style={{width:'100%',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
                                                    <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Name : {item.accName}</TextEle>
                                                    <TouchableOpacity onPress={()=>askIfremove(item.accName)}>
                                                        <Icon
                                                            name="close"
                                                            style={{ right: 0, top: 3 }}
                                                            size={20}
                                                            color="grey"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Type : {item.accType}</TextEle>
                                                <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Area Name : {item.AreaName}</TextEle>
                                                <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>State : {item.state}</TextEle>
                                            </View>
                                        </TouchableOpacity>
                                    )
                            }
                        }
                            keyExtractor={(item,index) => `${index}`}
                        />
                </View>
            </View>
        </View>}

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
                renderItem={({ item,index }) => 
                {
                    return(
                            <TouchableOpacity onPress={()=>onAddSelectedData(item)} style={{width:'100%',alignItems:'center',justifyContent: 'center'}}>
                                <View style={{width:'90%',padding:10,borderRadius:5,justifyContent:'flex-start',borderWidth:1,marginVertical:10,borderColor:'grey'}}>
                                    <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Name : {item.accName}</TextEle>
                                    <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Account Type : {item.accType}</TextEle>
                                    <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>Area Name : {item.AreaName}</TextEle>
                                    <TextEle style={{color:'grey',marginVertical:3,fontSize:14}}>State : {item.state}</TextEle>
                                </View>
                            </TouchableOpacity>
                    )
                }
                }
                keyExtractor={(item,index) => `${index}`}
            />
            </View>
        </Modal>
        </>
    )

}


export default CustomMultiText;