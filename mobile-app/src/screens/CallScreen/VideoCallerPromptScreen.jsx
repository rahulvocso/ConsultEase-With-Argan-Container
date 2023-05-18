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

import Sound from 'react-native-sound';
import InCallManager from 'react-native-incall-manager';

// import Svg from '../../../Svg';
// import CallReject from './Svgs/CallReject';
// import Sound from 'react-native-sound';

import Actions from '../../actions';
import Theme from '../../theme';
import Utils from '../../utils';
import xss from 'xss';

import AvatarSample from '../../assets/images/AvatarSample.png';
// import CallAccept from '../../assets/images/CallAccept.svg';
// import CallReject from '../../assets/images/CallReject.svg';
import GoBack from '../../assets/images/GoBack.svg';
import GoBack1 from '../../assets/images/GoBack1.svg';
import CameraSwitch from '../../assets/images/CameraSwitch.svg';
import MicOn from '../../assets/images/MicOn.svg';
import MicOn1 from '../../assets/images/MicOn1.svg';
import MicOff from '../../assets/images/MicOff.svg';
import MicOff1 from '../../assets/images/MicOff1.svg';
import SpeakerOn from '../../assets/images/SpeakerOn.svg';
import SpeakerOff from '../../assets/images/SpeakerOff.svg';
import CameraOn from '../../assets/images/CameraOn.svg';
import CameraOff from '../../assets/images/CameraOff.svg';
import CallReject from '../../assets/images/CallReject.svg';
import InstagramVideoCallTone from '../../assets/audio/InstagramVideoCallTone.mp3'


// import notifee, {AndroidImportance} from '@notifee/react-native';
import CallDisconnect from '../../assets/images/CallReject.svg';
// import getSocket from '../../foreground-background-services/getSocket';
import useFetch from '../../hooks/useFetch';
import initCallDetailsGetRoom from './initCallDetailsGetRoom';
// import getCalleeSocket from './getCalleeSocket.js';
// import initCall from './initCall';

const VideoCallerPromptScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');

  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const calleeDetails = useSelector((state) => state.webview.calleeDetails);
  const callerDetails = useSelector((state)=> state.webview.callerDetails);
  const calleeSocketId = useSelector((state)=> state.webview.calleeSocketId);
  const socketId = useSelector((state) => state.socket.id);
  const callInstanceData = useSelector((state) => state.webview.callInstanceData)
  const callId = useSelector((state) => state.webview.callInstanceData._id)
  // const incomingCallId = useSelector((state) => state.webview.incomingCallId);
  const outgoingCallId = useSelector((state) => state.webview.outgoingCallId);
  const joined = useSelector((state) => state.media.joined)


  // profile data received from webview
  const consulteaseUserProfileData = useSelector((state) =>
    state.webview.consulteaseUserProfileData ? state.webview.consulteaseUserProfileData : {},
  );
  
  const [cameraIsFacingUser, setCameraIsFacingUser] = useState('user');
  const video = useSelector((state) => state.media.local.video)
  const mic = useSelector((state) => state.media.local.audio)
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  // call instance data after initiating call
  const [callInstanceState, setCallInstanceState] = useState({})

  const active = useSelector((state) => !!state.media.local.video);
  const key = useSelector((state) => state.meeting.key);
  const room = useSelector((state)=>state.meeting.room)
  const name = useSelector((state) => state.user.name);
  const email = useSelector((state) => state.user.email);

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  // ringtone playing code
  const [isPlaying, setIsPlaying] = useState(false);
  const [ringtoneIntervalId, setAudioIntervalId] = useState(null);
  const [ringtone, setRingtone] = useState(null);
  const [ringtoneOnSpeaker, setRingtoneOnSpeaker] = useState(false);

  const [shouldComponentUnmount, setShouldComponentUnmount] = useState(false);

  // if (shouldComponentUnmount) {
  //   return null; // Unmount the component
  // }

  // useEffect(() => {
  //   const sound = new Sound('audio.mp3', Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log('Error loading sound:', error);
  //       return;
  //     }
      
  //     // Set the duration of each audio loop in milliseconds
  //     const loopDuration = 5000;

  //     // Start playing the audio immediately
  //     sound.play();

  //     // Schedule the next audio loop after the loopDuration
  //     const intervalId = setInterval(() => {
  //       sound.stop(); // Stop the previous loop
  //       sound.play(); // Start a new loop
  //     }, loopDuration);

  //     // Clean up the interval when the component unmounts
  //     return () => clearInterval(intervalId);
  //   });
    
  //   // Clean up the sound when the component unmounts
  //   return () => sound.release();
  // }, []);
  
  //

  useEffect(() => {
    console.log(
      "calleeDetails inside VideoCallerPrompt",
      "calleeDetails.user_id",
      calleeDetails && calleeDetails.user_id
    )
    if (socketId) {
      // send initial call details, get room id , i.e '_id' from returned started call instance data
      if (
        Object.keys(consulteaseUserProfileData).length !== 0 &&
        consulteaseUserProfileData.auth_token &&
        consulteaseUserProfileData._id &&
        calleeDetails &&
        calleeDetails.callCategory
      ) {
        getCalleeSocket() //get callee socket data    
      } 
    }
  }, [consulteaseUserProfileData, calleeDetails]);

  useEffect(() => {
    calleeSocketId ? initCall() : null; // get initial call instance data
  },[calleeSocketId])


  useEffect(() => {
    if (socketId && callInstanceData && Utils.socket) {
      (consulteaseUserProfileData && calleeDetails) ? (
        Utils.socket.emit("messageDirectPrivate",
            {
              type: 'videoCall',
              from: socketId,
              to: calleeSocketId,
              callInstanceData: callInstanceData,
              callerDetails: {
              name: `${consulteaseUserProfileData.fname} ${consulteaseUserProfileData.lname}`,
              callCategory: calleeDetails.callCategory,
              photo: consulteaseUserProfileData.photo,
              },
            }
      ),
      console.log('****messageDirectPrivate for call initiation sent to callee')
      ) : null;
      console.log('log below -> call started message event by private-socket-message')
    }
  }, [callInstanceData]);

  useEffect(() => {
    if (socketId && key && callId) {
      dispatch(Actions.IO.joinRoom(callId));
    }
  }, [callId]);


  useEffect(() => {
    dispatch(Actions.Media.getLocalVideo());
    dispatch(Actions.Media.getLocalAudio());
    // Initialize the Sound object with the audio file
    const audioPath = 'path_to_your_audio_file.mp3';
    Sound.setCategory('Playback');
    const sound = new Sound(require('../../assets/audio/InstagramVideoCallTone.mp3'), null , error => { // testing('' in place of Sound.MAIN_BUNDLE) 
      if (error) {
        console.log('******Failed to load the sound', error);
      } else {
        console.log('******Ringtone set', error);
        setRingtone(sound);
      }
    });
    sound.play((success, error) => {
      if (success) {
        console.log('****Ringtone Sound played successfully');
      } else {
        console.log('**** Ringtone Sound playback failed',error);
      }
    });
    // Set the audio mode to earpiece initially
    // InCallManager.start({ media: 'audio' });
    // InCallManager.setForceSpeakerphoneOn(false);

    // Set the duration of each audio loop in milliseconds
    // const loopDuration = 5000;
     // Set the maximum duration for playing the audio
     const maxDuration = 40000;
     // Get the actual duration of the audio file
     const ringtoneDuration = (sound.getDuration() * 1000);
     const audioDuration = ringtoneDuration <= maxDuration ? (sound.getDuration() * 1000) : maxDuration;

    //  const loopCount = Math.ceil(maxDuration / loopDuration);
    //  const totalDuration = loopDuration * loopCount;

    //  const playAudioLoop = () => {
    //    sound.play();
    //    setTimeout(() => {
    //      sound.stop();
    //      playAudioLoop();
    //    }, loopDuration);
    //  };

    //  playAudioLoop();

    //  const timeoutId = setTimeout(() => {
    //   sound.stop();
    // }, totalDuration);

    // Schedule the next audio loop after the loopDuration
    const ringtoneIntervalId = setInterval(() => {
      sound.release(); // Stop the previous loop
      sound.play(); // Start a new loop
    }, audioDuration);

    //component mount duration code starts
    const componentMountDuration = maxDuration; // Duration in milliseconds
    const componentUnmountTimeoutId = setTimeout(() => {
      setShouldComponentUnmount(true);
    }, componentMountDuration);
    //component mount duration code ends

    return () => {
      if(sound){
        sound.stop();
        sound.release();
      }
      dispatch({ type: 'meeting-errors-clear' });
      key && dispatch({ type: 'join', name, email});
      console.log('*****Joined*****VideoCaller.js effect cleaning', joined)
      clearInterval(ringtoneIntervalId);
      //clearTimeout(componentUnmountTimeoutId);
    }
  }, []);

  
  const getCalleeSocket = async () => {
    // get callee user socket_id related data
    get(`user/getSocket?&user_id=${calleeDetails.user_id}`, {
      auth_token: consulteaseUserProfileData.auth_token,
    })
      .then((data) => {
        console.log('getSocket.js, data', data);
        if (data.status == 200) {
          //
          data.body.status === 'Online' &&
            (data.body.socket_id !== (null || undefined || '')) &&
            (
              dispatch({ type: 'SET_CALLEE_SOCKET_ID', payload: data.body.socket_id }),
              dispatch({ type: 'SET_PEER_SOCKET_ID', payload: data.body.socket_id })
            )
            
          //
          console.log(
            '****** Successful  VideoCallerPromptScreen.js  getSocket() socket_id Get req 200 ******* data.body',
            data.body._id,
          );
        } else {
          console.log(
            '****** Unsuccessfull  VideoCallerPromptScreen.js  getSocket() socket_id Get req ******* data',
            data.body,
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error occurred during API call: VideoCallerPromptScreen.js 186 getSocket.js',
          error,
        );
      });
  };

  const initCall = async () => {
    await post(
      'call/init',
      {
        from_user: consulteaseUserProfileData._id, //caller user_id
        to_user: calleeDetails.user_id, // callee user id,
        category: consulteaseUserProfileData.auth_token,
      },
      { auth_token: consulteaseUserProfileData.auth_token },
    )
      .then((data) => {
        console.log('postSocket.js, data', data);
        if (data.status == 200) {
          dispatch({ type: 'SET_CALL_INSTANCE_DATA', payload: data.body });
          dispatch({ type: 'meeting-key', value: xss(data.body._id) });
          data.body._id ? dispatch({ type: 'meeting-errors-clear' }) : null;
          console.log(
            '******Successful  VideoCallerPromptScreen.js  initcall() call init POST req 200      *******',
            data.body,
            ' data.body._id',
            data.body._id,
          );
        } else {
          console.log(
            '******Unsuccessfull  VideoCallerPromptScreen.js  initcall()  call init  POST req       *******',
          );
        }
      })
      .catch((error) => {
        console.error(
          'Error occurred during API call: VideoCallerPromptScreen.js during fetchData()',
          error,
        );
      });
  };
 

  const handleCameraFacing = () => {
    setCameraIsFacingUser((cameraIsFacingUser)=>(!cameraIsFacingUser))
    dispatch(Actions.Media.flipCamera())
  };

  const handleRingtoneSpeakerOutput = () => {
    InCallManager.setSpeakerphoneOn(!ringtoneOnSpeaker);
    setRingtoneOnSpeaker(!ringtoneOnSpeaker);
  }

  const handleMicToggle = () => {
    setIsMicOn(isMicOn => !isMicOn);
    isMicOn ? dispatch(Actions.Media.releaseLocalAudio()) : dispatch(Actions.Media.getLocalAudio())
    
  };

  const handleCameraToggle = () => {
    setIsCameraOn((isCameraOn) => !isCameraOn);
    isCameraOn ? dispatch(Actions.Media.releaseLocalVideo()) : dispatch(Actions.Media.getLocalVideo())
  };

  const handleCallDisconnect = () => {
    if (socketId) {
      (socketId && Utils.socket) ? (
        Utils.socket.emit("messageDirectPrivate",
        {
          type: 'callerResponse',
          from: socketId,
          to: calleeSocketId,
          response: 'disconnectedByCallerBeforeCalleeResponse',
        }
      )) : null;
  
      console.log('Call disconnected by caller')
    }
    dispatch(Actions.Media.releaseLocalVideo());
    dispatch(Actions.Media.releaseLocalAudio());
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
    navigation.navigate('WebView', { key });
  }

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
    callPromptCallingName: {
        top: 10,
        fontSize: 25,
        color: "#cccccc",
    },
    callPromptCalling: {
        top: 10,
        fontSize: 15,
        color: "#cccccc",
    },
    callPromptCallCategory: {
        top: 10,
        marginTop: 10,
        fontSize: 25,
        marginBottom: 10,
        color: "#cccccc",
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
                    {/* <TouchableOpacity onPress={ ()=>{
                      dispatch(Actions.Media.releaseLocalVideo());
                      dispatch(Actions.Media.releaseLocalAudio());
                      dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
                      dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
                      }}>  
                        <GoBack1
                        width={30} 
                        height={30}
                        fill="white"
                        />                      
                        <SvgUri
                        width="25"
                        height="25"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/GoBack.svg')}
                        // source={require('../../assets/images/GoBack.svg')}
                        />
                    </TouchableOpacity> */}
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
                    <TouchableOpacity onPress={handleRingtoneSpeakerOutput}>
                        {ringtoneOnSpeaker ?
                          <SpeakerOn
                          width={35} 
                          height={35}
                          fill="white"
                        />
                        :
                        <SpeakerOff
                          width={35} 
                          height={35}
                          fill="white"
                        />
                        }
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
                    <TouchableOpacity onPress={handleCallDisconnect}>
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
