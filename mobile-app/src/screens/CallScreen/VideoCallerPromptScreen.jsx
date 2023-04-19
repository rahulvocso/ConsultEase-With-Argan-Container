import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Section,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  RTCView,
  MediaStream,
  mediaDevices,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import SvgUri from 'react-native-svg-uri';
import Svg from '../../../Svg';
// import CallReject from './Svgs/CallReject';
// import Sound from 'react-native-sound';

import Actions from '../../actions';
import Theme from '../../theme';

import AvatarSample from '../../../android/app/src/main/assets/AvatarSample.png';
// import CallAccept from '../../assets/images/CallAccept.svg';
// import CallReject from '../../assets/images/CallReject.svg';
import GoBack from '../../../android/app/src/main/assets/GoBack.svg';
import GoBack1 from '../../../android/app/src/main/assets/GoBack1.svg';
import CameraSwitch from '../../../android/app/src/main/assets/CameraSwitch.svg';
import MicOn from '../../../android/app/src/main/assets/MicOn.svg';
import MicOn1 from '../../../android/app/src/main/assets/MicOn1.svg';
import MicOff from '../../../android/app/src/main/assets/MicOff.svg';
import MicOff1 from '../../../android/app/src/main/assets/MicOff1.svg';
import CameraOn from '../../../android/app/src/main/assets/CameraOn.svg';
import CameraOff from '../../../android/app/src/main/assets/CameraOff.svg';
import CallReject from '../../../android/app/src/main/assets/CallReject.svg';


// import notifee, {AndroidImportance} from '@notifee/react-native';
import CallDisconnect from '../../assets/images/CallReject.svg';


const VideoCallerPromptScreen = () => {
  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const calleeDetails = useSelector(state => state.webview.calleeDetails);
  const dispatch = useDispatch();
  // const {calleeDetails, isCallViewOn, setCallView} = route.params;
  const [cameraIsFacingUser, setCameraIsFacingUser] = useState('user');

  const video = useSelector((state) => state.media.local.video)
  const mic = useSelector((state) => state.media.local.audio)
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  ;
  const active = useSelector((state) => !!state.media.local.video);
  const navigation = useNavigation();
  const key = useSelector((state) => state.meeting.key);
//   const [ primaryVideoViewIsPeer, setPrimaryVideoViewIsPeer ] =useState(true)
  
  useEffect(() => {
    dispatch(Actions.Media.getLocalVideo());
    dispatch(Actions.Media.getLocalAudio());
    // return () => {
    //     dispatch(Actions.Media.releaseLocalVideo());
    //     dispatch(Actions.Media.releaseLocalAudio());
    // }
    console.log("calleeDetails inside VideoCallerPrompt" , calleeDetails)
  }, []);

  // useEffect(()=>{
  //   const sound = new Sound('audio.mp3', Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log('Failed to load sound', error);
  //       return;
  //     }
  //     sound.setNumberOfLoops(-1); // Set number of loops to -1 for infinite looping
  //     sound.play(() => {
  //       sound.release();
  //     });
  //   });

  //   return () => { //cleanup function to stop playing audio file
  //     sound.stop(() => {
  //       sound.release();
  //     });
  //   };
  // },[])

  const handleCameraFacing = () => {
    setCameraIsFacingUser((cameraIsFacingUser)=>(!cameraIsFacingUser))
    dispatch(Actions.Media.flipCamera())
  };

  const handleMicToggle = () => {
    setIsMicOn(isMicOn => !isMicOn);
    isMicOn ? dispatch(Actions.Media.releaseLocalAudio()) : dispatch(Actions.Media.getLocalAudio())
    
  };

  const handleCameraToggle = () => {
    setIsCameraOn((isCameraOn) => !isCameraOn);
    isCameraOn ? dispatch(Actions.Media.releaseLocalVideo()) : dispatch(Actions.Media.getLocalVideo())
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height: deviceHeight,
      width: deviceWidth,
    },
    rtcView: {
      flex: 1,
      // width: '100%',
      // height: '100%',
      height: deviceHeight,
      width: deviceWidth,
      //backgroundColor: "white"
      // position: 'absolute',
      // top: 0,
      // left: 0,
    },
    rtcViewReplacingView: {
      flex: 1,
      height: deviceHeight,
      width: deviceWidth,
      backgroundColor: "grey"
    },
    callViewContainer: {
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      height: deviceHeight,
      width: deviceWidth,
      // flexDirection: 'column',
      // flexWrap: 'wrap',
      //backgroundColor: '#fff',
      // alignContent: 'flex-start',
      // justifyContent: 'center',

      position: 'absolute',
      top: 0,
      height: deviceHeight,
      width: deviceWidth,
    },
    callPromptAvatar: {
        width: deviceWidth,
        // height: deviceHeight / 8,
        position: 'absolute',
        top: 90,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: 'red',
        color: "red",
        // borderWidth: 2,
        // backgroundColor: 'green',
        // marginLeft: deviceWidth / 20,
        // marginRight: deviceWidth / 20,
    },
    // noStreamCallPromptAvatar: {
    //     width: deviceWidth,
    //     // height: deviceHeight / 8,
    //     position: 'absolute',
    //     top: 90,
    //     flex: 1,
    //     flexDirection: 'column',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     color: "white",
    //     // borderColor: 'red',
    //     // borderWidth: 2,
    //     backgroundColor: '#ffffff',
    //     borderRadius: 20,
    //     backgroundColor: 'grey',
    //     // marginLeft: deviceWidth / 20,
    //     // marginRight: deviceWidth / 20,
    // },
    // noStreamCallPromptCallingName,
    // noStreamCallPromptCalling,
    // noStreamcallPromptCallingCallCatogory,
    // noStreamcallPromptCallCategory: {
    //   color: 'white',
    // },
    callPromptCallingName: {
        top: 10,
        fontSize: 25,
        // color: "red",
    },
    callPromptCalling: {
        top: 10,
        fontSize: 15,
    },
    callPromptCallCategory: {
        top: 10,
        marginTop: 10,
        fontSize: 25,
        marginBottom: 10,
    },
    callViewBottomContainer: {
      position: 'absolute',
      bottom: 0,
    },
    controlButtonsContainer: {
      position: 'absolute',
      bottom: 8,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      backgroundColor: '#ffffff1a',
      alignItems: 'center',
      width: deviceWidth,
      height: deviceHeight / 12,
      backgroundColor: '#435a6433',
      backgroundColor: '#075e54',
      paddingTop: 14 ,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },

    rtcView2Container: {
      flex: 1,
      width: deviceWidth / 3,
      height: deviceHeight / 6,
      position: 'absolute',
      bottom: deviceHeight / 8,
      right: deviceWidth / 20,
      backgroundColor: 'white',
      borderRadius: 15,
      //aspectRatio: 20,
    },
    rtcView2: {
      //flex: 1,
      width: deviceWidth / 3,
      height: deviceHeight / 6,
      // position: 'absolute',
      // bottom: deviceHeight / 8,
      // right: deviceWidth / 20,
      backgroundColor: 'purple',
      borderRadius: 15,
      //aspectRatio: 20,
    },
  });

  return (
    <View style={styles.container}>
        <View>
            {video ? 
            <RTCView
            // ref={rtcRef}
            streamURL={video && video.stream && video.stream?.toURL()}
            style={styles.rtcView}
            zOrder={-1}
            objectFit='cover'
            mirror={true}
            />
            :
            <View style={styles.rtcViewReplacingView}>
            </View>
            }
            <View style={styles.callViewContainer}>
                <View style={styles.callPromptAvatar }>
                    <Image
                    style={{width: 80, height: 80, borderRadius: 50, objectFit: "contain"}}
                    // source={AvatarSample}
                    source={ calleeDetails.length!= 0 && calleeDetails.photo ? 
                      {uri: calleeDetails.photo} :
                      AvatarSample
                    }    
                    />

                    <Text style={styles.callPromptCallingName}>
                    {Object.keys(calleeDetails).length !== 0 && calleeDetails.name ? calleeDetails.name :"Name Unavailable"}
                    </Text>

                    <Text style={styles.callPromptCalling}>Calling</Text>

                    <Text style={styles.callPromptCallCategory}>
                    {Object.keys(calleeDetails).length !== 0 && calleeDetails.callCategory ? calleeDetails.callCategory : "Call Category Unavailable"}
                    </Text>

                </View>
                <View style={styles.callViewBottomContainer}>
                    <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity onPress={ ()=>{
                      dispatch(Actions.Media.releaseLocalVideo());
                      dispatch(Actions.Media.releaseLocalAudio());
                      dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
                      }}>  
                        <GoBack1
                        width={30} 
                        height={30}
                        fill="white"
                        // fill="#3DB271"
                        />                      
                        {/* <SvgUri
                        width="25"
                        height="25"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/GoBack.svg')}
                        // source={require('../../assets/images/GoBack.svg')}
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraFacing}>
                        <CameraSwitch
                          width={35} 
                          height={35}
                          fill="white"
                          // fill="#3DB271"
                        />
                        {/* <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/CameraSwitch.svg')}
                        // source={require('../../assets/images/CameraSwitch.svg')}
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMicToggle}>
                        {
                          isMicOn ? 
                          <MicOn1
                          width={37} 
                          height={37}
                          fill="white"
                          // fill="#3DB271"
                          />
                          :
                          <MicOff1
                          width={35} 
                          height={35}
                          fill="white"
                          // fill="#3DB271"
                        />
                        }
                        {/* <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        source={
                          isMicOn 
                          ? require('../../../android/app/src/main/assets/MicOn.svg')
                          : require('../../../android/app/src/main/assets/MicOff.svg')
                        }
                        // source={
                        //     isMicOn
                        //     ? require('../../assets/images/MicOn.svg')
                        //     : require('../../assets/images/MicOff.svg')
                        // }
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraToggle}>
                        {
                          isCameraOn ? 
                          <CameraOn
                          width={35} 
                          height={35}
                          fill="white"
                          // fill="#3DB271"
                          />
                          :
                          <CameraOff
                          width={35} 
                          height={35}
                          fill="white"
                          // fill="#3DB271"
                        />
                        }
                        {/* <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        // fill="#3DB271"
                        source={
                          isCameraOn 
                          ? require('../../../android/app/src/main/assets/CameraOn.svg')
                          : require('../../../android/app/src/main/assets/CameraOff.svg')
                        }
                        // source={
                        //     isCameraOn
                        //     ? require('../../assets/images/CameraOn.svg')
                        //     : require('../../assets/images/CameraOff.svg')
                        // }
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('VideoCall', { key })
                        // dispatch({ type: 'SET_CALLEE_DETAILS', payload: JSON.parse(event.nativeEvent.data) })
                      }
                    }>
                        {/* <SvgUri
                        width="40"
                        height="40"
                        fill="red"
                        source={require('../../../android/app/src/main/assets/CallReject.svg')}
                        // source={require('../../assets/images/CallReject.svg')}
                        /> */}
                        <CallReject
                          width={40} 
                          height={40}
                          fill="red"
                        />
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </View>
    </View>
  );
};

export default VideoCallerPromptScreen;
