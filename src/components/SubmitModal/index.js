import React from 'react';
import { Animated,SafeAreaView, Text, ScrollView, View, Alert, Pressable,Modal,StyleSheet,Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '@utils/axios';
import RNFS from 'react-native-fs';
import TextEle from '@components/TextEle';
const url = '/services/apexrest/SRVY_SvyCapture_API';
const ImgAPI = '/services/apexrest/SRVY_SvyCaptureImage_API';

class SubmitModal extends React.Component{
    constructor()
    {
        super();
        this.state={
            OuterProgressWidth:0,
            ProgressWidth:new Animated.Value(30),
            TotalSurvey:0,
            TotalImages:0,
            ImagesErrorCount:0,
            SurveySubmited:false,
            SubmitFinished:false,
            Images:[],
            ImageCount:0,
            ErrorMsg:""
        }
    }

    componentDidMount()
    {
        this.GetNumbers();
    }

    SetProgressBar =(val)=>{
        Animated.timing(this.state.ProgressWidth,{
            toValue:isNaN(val) ? 30 :val,
            timing:5000
        }).start();
    }

    RemoveImages = async()=>{
        let AllKeys = await AsyncStorage.getAllKeys();
            AllKeys.forEach((result,index)=>{
                if(result.includes('IMG'))
                {
                    AsyncStorage.removeItem(result)
                }
            })
    }

  

    GetNumbers = async () =>{
        let Unsyncquestion = await AsyncStorage.getItem('unSyncedQuestions');
        let ParsedSurvey = JSON.parse(Unsyncquestion);
        this.setState({TotalSurvey:ParsedSurvey.length})
        let AllKeys = await AsyncStorage.getAllKeys();
        let chk = AllKeys.findIndex(keys => keys.includes('IMG'));
        console.log(chk)
        if(chk > 0 )
        {
            AllKeys.forEach(async(result,index)=>{
                if(result.includes('IMG'))
                {
                let Img = await AsyncStorage.getItem(result)
                 let ParsedImages = JSON.parse(Img)
                    ParsedImages.forEach((PImgs)=>{
                        if(Object.keys(PImgs).length > 0)
                        {
                            let ImagesTemp = this.state.Images;
                            ImagesTemp.push(PImgs);
                            this.setState({Images:ImagesTemp},()=>{
                                console.log(this.state.Images);
                                this.setState({TotalImages:this.state.Images.length},()=>{
                                    this.UploadUnsyncedSurveys(ParsedSurvey);
                                })
                            })
                        }  
                    })
                }
            })  
        }
        else
        {
            this.UploadUnsyncedSurveys(ParsedSurvey);
        }
        
    }


    UploadUnsyncedSurveys = (ParsedSurvey) => {
        console.log("91",JSON.stringify(ParsedSurvey));
        axios.post(url,ParsedSurvey).then(res=>{
            console.log("89",res.data)
            if(res.data.status === "Success")
            {
                this.setState({SurveySubmited:true},()=>{
                    const {OuterProgressWidth,TotalImages,TotalSurvey} = this.state;
                    AsyncStorage.removeItem('unSyncedQuestions');
                    let Total = OuterProgressWidth / (TotalImages+TotalSurvey);
                    // console.log("Total",Total,Images)
                    let SurveyProgress = TotalSurvey * Total;
                    this.SetProgressBar(SurveyProgress);
                    this.UploadUnsyncedImages();
                })
            }
            else
            {
                this.setState({ErrorMsg:JSON.stringify(res.data)})
                this.setState({SubmitFinished:true})
                
            }
            
            
        }).catch(e=>{
            this.setState({SubmitFinished:true})
            this.setState({ErrorMsg:e})
            console.log(e)
        })
    }

    UploadUnsyncedImages=async()=>{
        console.log(this.state.Images);
        let SubmitImg;

        if(this.state.Images.length > 0)
        {
            for(i = 0 ; i < this.state.Images.length ; i ++)
            {
            console.log("Loop",i)
            let res =await RNFS.readFile(this.state.Images[i].uri, 'base64')
            // console.log("98",this.state.Images[i].QId)
            SubmitImg={
               "surveyId": this.props.SurveyId,
               "accountId": this.props.AccId,
               "userId": this.props.UserId,
               "qtnId": this.state.Images[i].QId,
               "Sequence_No": this.state.Images[i].SqNo,
               "imageName": this.state.Images[i].fileName,
               "imageType": "JPG",
               "imageBase64": res
           }
            
                axios.post(ImgAPI, SubmitImg).then(res=>{
            //   console.log("res",res)
                    this.setState({ImageCount:this.state.ImageCount + 1},()=>{
                   console.log("107",this.state.ImageCount)
                   const {TotalImages,ImageCount,OuterProgressWidth,TotalSurvey} = this.state;
                    let TotalImageCount = TotalImages - ImageCount;
                    console.log("123",TotalImageCount)
                    let Total = OuterProgressWidth / (TotalSurvey + TotalImageCount);
                    console.log("Total",Total)
                    let SurveyProgress = TotalSurvey * Total;
                    console.log("128",OuterProgressWidth,SurveyProgress)
                    this.SetProgressBar(SurveyProgress);
                    console.log("115",this.state.ImageCount,this.state.Images.length)
                    if((OuterProgressWidth - SurveyProgress) < 10)
                    { 
                        this.RemoveImages()
                        this.setState({SubmitFinished:true})
                    } 
               })             
            }).catch(e=>{
               this.setState({SubmitFinished:true})
               this.setState({ErrorMsg:e})
                })
            }
        } 
        else
        {
            setTimeout(()=>{
                this.setState({SubmitFinished:true})
            },3000)
        }      
    }

  

    render()
    {
        const animatedStyle={
            width:this.state.ProgressWidth
        }
        
        return(
            <View style={{width:'100%',height:'100%',backgroundColor:'white',marginTop:200,borderRadius:20,elevation:5,padding:10,alignItems:'center'}}>
           { this.state.SubmitFinished ? 
                this.state.SurveySubmited ? 
                    this.state.ImageCount === this.state.Images.length ?
                    <View style={{width:'100%',height:'100%',alignItems:'center',padding:15}}>
                        <Image style={{width:125,height:125}} source={require('./checked.png')}/>
                        <TextEle style={{textAlign:'center',marginTop:25}}>Your Survey Has Been Sucessfully Submitted.</TextEle>
                        <TouchableOpacity onPress={()=>this.props.BackToHome()} style={{width:'100%',marginTop:25}}>
                            <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"red",alignItems:'center',justifyContent:'center'}}>
                                <TextEle style={{color:'white',fontSize:20}}>Proceed</TextEle>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{width:'100%',height:'100%',alignItems:'center',padding:15}}>
                        <Image style={{width:125,height:125}} source={require('./warning.png')}/>
                        <TextEle style={{textAlign:'center',marginTop:25}}>All Your Survey Were Submitted But Some Of Your Image Were Not Able to Upload.Please Try Again</TextEle>
                        <TextEle style={{textAlign:'center',marginTop:25}}>{this.state.ErrorMsg}</TextEle>
                        <TouchableOpacity onPress={()=>this.props.BackToHome()} style={{width:'100%',marginTop:25}}>
                            <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"red",alignItems:'center',justifyContent:'center'}}>
                                <TextEle style={{color:'white',fontSize:20}}>Proceed</TextEle>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{width:'100%',height:'100%',alignItems:'center',padding:15}}>
                        <Image style={{width:125,height:125}} source={require('./close.png')}/>
                        <TextEle style={{textAlign:'center',marginTop:25}}>Your Survey Was Not Recorded.Please Contact Support</TextEle>
                        <TextEle style={{textAlign:'center',marginTop:15}}>{this.state.ErrorMsg}</TextEle>
                        <TouchableOpacity onPress={()=>this.props.BackToHome()} style={{width:'100%',marginTop:25}}>
                            <View style={{width:'100%',height:50,borderRadius:10,backgroundColor:"red",alignItems:'center',justifyContent:'center'}}>
                                <TextEle style={{color:'white',fontSize:20}}>Proceed</TextEle>
                            </View>
                        </TouchableOpacity>
                    </View>// Show Error
                    :
                    <>
                       <TextEle style={{marginTop:10}}>Uploading {this.state.TotalSurvey} Survey and {this.state.TotalImages} Images....</TextEle>
                       <View onLayout={(event)=>{
                            let {width}=event.nativeEvent.layout;
                            this.setState({OuterProgressWidth:parseInt(width)})
                        }} style={{marginTop:30,width:'90%',height:25,borderRadius:10,backgroundColor:'#e0e0de'}}>
                            <Animated.View style={[styles.Progress,animatedStyle]}/>
                        </View>
                    </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Progress:{
        width:'10%',
        height:25,
        borderRadius:10,
        backgroundColor:'red'
    }
})


export default SubmitModal;
