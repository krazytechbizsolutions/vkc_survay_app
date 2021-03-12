import React from 'react'
import {View,Text,TouchableOpacity} from 'react-native'

const ShowUnplanned =()=>{

    return(
        <View style={{flex:1,width:'100%',padding:15,justifyContent:'flex-start',alignContent:'center'}}> 
            <View style={{backgroundColor:'white',marginVertical:10,elevation:3,width:'100%',padding:10,borderRadius:10}}>
                <Text style={{ paddingVertical: 4 }}>{`Account Name: Kiran Stores`}</Text>
                <Text style={{ paddingVertical: 4 }}>{`Area Name: Jaya Nagar`}</Text>
                <Text style={{ paddingVertical: 4 }}>{`Account Type: Retailer`}</Text>
                
                <TouchableOpacity style={{width:'100%',marginVertical:5}} onPress={()=>{}}>
                    <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{color:'#fff'}}>
                            Survey Type 1
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width:'100%',marginVertical:5}} onPress={()=>{}}>
                    <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{color:'#fff'}}>
                            Survey Type 2
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width:'100%',marginVertical:5}} onPress={()=>{}}>
                    <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{color:'#fff'}}>
                            Survey Type 3
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{backgroundColor:'white',elevation:3,marginVertical:10,width:'100%',padding:10,borderRadius:10}}>
                <Text style={{ paddingVertical: 4 }}>{`Account Name: Centos Footware`}</Text>
                <Text style={{ paddingVertical: 4 }}>{`Area Name: Jaya Nagar`}</Text>
                <Text style={{ paddingVertical: 4 }}>{`Account Type: Retailer`}</Text>
                
                <TouchableOpacity style={{width:'100%',marginVertical:5}} onPress={()=>{}}>
                    <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{color:'#fff'}}>
                            Survey Type 1
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width:'100%',marginVertical:5}} onPress={()=>{}}>
                    <View style={{width:'100%',height:50,borderRadius:15,backgroundColor:"#ef4b4b",justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{color:'#fff'}}>
                            Survey Type 2
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>


        </View>
    )

}


export default ShowUnplanned