import React, {useState, useRef, useEffect} from 'react';
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

import Actions from '../../actions';
import Theme from '../../theme';
import Timer from './Timer';


// import notifee, {AndroidImportance} from '@notifee/react-native';
import GoBack from '../../../android/app/src/main/assets/GoBack.svg';
import GoBack1 from '../../../android/app/src/main/assets/GoBack1.svg';
import CameraSwitch from '../../../android/app/src/main/assets/CameraSwitch.svg';
import Monitor1 from '../../../android/app/src/main/assets/Monitor1.svg';
import MicOn from '../../../android/app/src/main/assets/MicOn.svg';
import MicOn1 from '../../../android/app/src/main/assets/MicOn1.svg';
import MicOff from '../../../android/app/src/main/assets/MicOff.svg';
import MicOff1 from '../../../android/app/src/main/assets/MicOff1.svg';
import CameraOn from '../../../android/app/src/main/assets/CameraOn.svg';
import CameraOff from '../../../android/app/src/main/assets/CameraOff.svg';
import CallReject from '../../../android/app/src/main/assets/CallReject.svg';


const VideoCallScreen = () => {

  const [cameraIsFacingUser, setCameraIsFacingUser] = useState('user');
  const video = useSelector((state) => state.media.local.video);
  const [isCameraOn, setIsCameraOn] = useState(video);
  const [isMicOn, setIsMicOn] = useState(true);

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  const dispatch = useDispatch();
  const active = useSelector((state) => !!state.media.local.video);
  const navigation = useNavigation();
  const key = useSelector((state) => state.meeting.key);
  const [ primaryVideoViewIsPeer, setPrimaryVideoViewIsPeer ] =useState(true)

  const timerLimit = 3660;
  
  useEffect(() => {
    dispatch(Actions.Media.getLocalVideo());
    dispatch(Actions.Media.getLocalAudio());
    return () => {
      dispatch(Actions.Media.releaseLocalVideo());
      dispatch(Actions.Media.releaseLocalAudio());
      // dispatch({ type: 'SET_CALLEE_DETAILS', payload: {} });
  }
  }, []);



  const returnToWebview = () => {
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'VideoCallerPrompt'}],
    // })
    //navigation.navigate('CallRating')
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
  };

  const handleCameraFacing = () => {
    dispatch(Actions.Media.flipCamera())
    setCameraIsFacingUser((cameraIsFacingUser)=>(!cameraIsFacingUser))
  };

  const handleMicToggle = () => {
    setIsMicOn(!isMicOn);
    isMicOn ? dispatch(Actions.Media.releaseLocalAudio()) : dispatch(Actions.Media.getLocalAudio())
  };

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
    isCameraOn ? dispatch(Actions.Media.releaseLocalVideo()) : dispatch(Actions.Media.getLocalVideo())
  };

  const handlePrimaryVideoStreamView = () => {
    setPrimaryVideoViewIsPeer((primaryVideoViewIsPeer)=>(!primaryVideoViewIsPeer))
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
      backgroundColor: "purple"
      // position: 'absolute',
      // top: 0,
      // left: 0,
    },
    callPromptButton: {
      //backgroundColor: 'blue',
      backgroundColor: '#61DAFB',
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    callPromptButtonText: {
      //color: '#fff',
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
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
      position: 'absolute',
    },
    topProgressBar: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#ffffff1a',
      //backgroundColor: 'blue',
      width: deviceWidth,
      height: deviceHeight / 25,
      position: 'absolute',
      top: 0,
      margin: 0,
      borderRadius: 25,
      //backgroundColor: !isDarkMode ? Colors.darker : Colors.lighter,
    },
    topProgressBarText: {
      paddingTop: 0,
      color: '#fff',
      //backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
      paddingTop: 12,
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
      borderWidth: 2,
      borderColor: "white",
      borderRadius: 15,
      //aspectRatio: 20,
    },
  });

  

  return (
    <View style={styles.container}>
        <View>
            <RTCView
                // ref={rtcRef}
                streamURL={primaryVideoViewIsPeer ? (" ") : (video && video.stream && video.stream?.toURL()) }
                style={styles.rtcView}
                zOrder={-1}
                objectFit='cover'
                mirror={true}
            />
            <View style={styles.callViewContainer}>
                <View style={styles.topProgressBar}>        
                    <Timer timerLimit={timerLimit}/>
                </View>
                <View
                    style={styles.rtcView2Container}
                    // onPress={handleStreamContainerSwitch}
                >
                    <RTCView
                    // ref={rtcRef2}
                    streamURL={primaryVideoViewIsPeer ? (video && video.stream && video.stream?.toURL()) : ("")
                    }
                    style={styles.rtcView2}
                    zOrder={1}
                    objectFit={'cover'}
                    mirror={true}
                    // onPress={handlePrimaryVideoStreamView}
                    />
                </View>
                <View style={styles.callViewBottomContainer}>
                    <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity onPress={ ()=>{navigation.goBack()}}>
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
                    <TouchableOpacity onPress={handlePrimaryVideoStreamView}>
                        <Monitor1
                          width={36} 
                          height={36}
                          fill="white"
                          // fill="#3DB271"
                        />
                        {/* <SvgUri
                        width="30"
                        height="30"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/Monitor.svg')}  
                        // source={require('../../assets/images/Monitor.svg')}
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
                    <TouchableOpacity onPress={returnToWebview}>
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

export default VideoCallScreen;
