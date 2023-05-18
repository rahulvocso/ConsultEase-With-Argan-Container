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

import SvgUri from 'react-native-svg-uri';
import notifee, {AndroidImportance} from '@notifee/react-native';

import Actions from '../../actions';
import Theme from '../../theme';
import Utils from '../../utils';

import AvatarSample from '../../assets/images/AvatarSample.png';
// import CallAccept from '../../assets/images/CallAccept.svg';
import CallAccept from '../../assets/images/CallAccept.svg';
import CallReject from '../../assets/images/CallReject.svg';
// import CallReject from '../../assets/images/CallReject.svg';

const VideoCalleePromptScreen = () => {
  const navigation = useNavigation();

  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const calleeDetails = useSelector(state => state.webview.calleeDetails);
  const callerDetails = useSelector(state => state.webview.callerDetails);
  const incomingCallDetails = useSelector((state) => state.webview.incomingCallDetails);
  const name = useSelector((state) => state.user.name);
  const email = useSelector((state) => state.user.email);
  const joined = useSelector((state) => state.media.joined);
  const ended = useSelector((state) => state.meeting.ended);
  const consulteaseUserProfileData = useSelector((state) =>
  state.webview.consulteaseUserProfileData ? state.webview.consulteaseUserProfileData : {},
  );
  const callInstanceData = useSelector((state)=> state.webview.callInstanceData);
  const callId = useSelector((state)=> state.webview.callInstanceData._id)

  const dispatch = useDispatch();
  const socketId = useSelector((state) => state.socket.id);

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  const [shouldComponentUnmount, setShouldComponentUnmount] = useState(false);

  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const video = useSelector((state) => state.media.local.video);
  const active = useSelector((state) => !!state.media.local.video);
  const key = useSelector((state) => state.meeting.key);
  const [incomingCallAnswer, setIncomingCallAnswer]  = useState();

  useEffect(() => {
    if (socketId && callId) {
      dispatch(Actions.IO.joinRoom(callId));
    }
  }, [socketId, callId]);

  function handleCallAccept(){
    // key ? dispatch(Actions.IO.joinRoom(key)) : null;
    if (socketId) {
      (socketId && Utils.socket) ? (
        Utils.socket.emit("messageDirectPrivate",{
          type: 'calleeResponse',
          from: socketId,
          to: incomingCallDetails.from,
          response: 'accepted'
      })) : null;
      navigation.navigate('Meeting', {key: callInstanceData._id});
      console.log('log below -> send call-pickup event by private-socket-message')
    }  
  }

  useEffect(() => {
    dispatch(Actions.Media.getLocalVideo());
    dispatch(Actions.Media.getLocalAudio());
    console.log('callerDetails inside VideoCalleePrompt',callerDetails)
    console.log('callerDetails.photo inside VideoCalleePrompt', typeof callerDetails.photo)
    // Initialize the Sound object with the audio file
    const audioPath = 'path_to_your_audio_file.mp3';
    Sound.setCategory('Playback');
    const sound = new Sound('../../assets/audio/InstagramVideoCallTone.mp3', Sound.MAIN_BUNDLE, error => { // testing('' in place of Sound.MAIN_BUNDLE) 
      if (error) {
        console.log('******Failed to load the sound', error);
      } else {
        console.log('******Ringtone set', error);
        setRingtone(sound);
      }
    });
    sound.play((success) => {
      if (success) {
        console.log('****Ringtone Sound played successfully');
      } else {
        console.log('**** Ringtone Sound playback failed');
      }
    });
    // Set the audio mode to earpiece initially
    // InCallManager.start({ media: 'audio' });
    // InCallManager.setForceSpeakerphoneOn(false);

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



  function handleCallReject(){
    if (socketId) {
      (socketId && Utils.socket) ? (
        Utils.socket.emit("messageDirectPrivate",
        {
          type: 'calleeResponse',
          from: socketId,
          to: incomingCallDetails.from,
          response: 'rejected',
        }
      )) : null;
  
      console.log('log below -> send call-pickup event by private-socket-message')
    }
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
    dispatch(Actions.Media.releaseLocalVideo());
    dispatch(Actions.Media.releaseLocalAudio());
    navigation.navigate('WebView');
  }

  const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 24,
        backgroundColor: Theme.Variables.background,
      },
    container: {
      flex: 1,
      //backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      height: deviceHeight,
      width: deviceWidth,
    },
    localVideoWrapper: {
      marginTop: 16,
      marginBottom: 8,
      maxWidth: '100%',
      width: deviceWidth,
      height: deviceHeight / 4,
    },
    localVideo: {
      flex: 1,
      backgroundColor: '#000000',
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
    rtcViewReplacingView: {
      flex: 1,
      height: deviceHeight,
      width: deviceWidth,
      backgroundColor: "grey"
    },
    callPromptContainer: {
      height: deviceHeight,
      width: deviceWidth,
      position: 'absolute',
      top: 0,
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
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
      borderColor: 'red',
      // marginLeft: deviceWidth / 20,
      // marginRight: deviceWidth / 20,
    },
    callPromptCallingName: {
      top: 10,
      fontSize: 25,
      color: '#cccccc',
    },
    callPromptCalling: {
      top: 10,
      fontSize: 15,
      color: '#cccccc'
    },
    callPromptCallCategory: {
      top: 10,
      marginTop: 10,
      fontSize: 25,
      color: '#cccccc',
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

    callPromptBottomContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      // backgroundColor: '#ffffff1a',
      alignItems: 'center', //to lower call buttons
      alignContent: 'center',
      position: 'absolute',
      bottom: 8,
      // borderWidth: 2,
      // borderColor: 'red',
      width: deviceWidth,
      height: deviceHeight / 4,
      //backgroundColor: '#435a6433',
      //backgroundColor: '#075e54',
    },

  });


  return (
    <View style={styles.container}>
      <View>
        <View>
          {video ? 
            <RTCView
            // ref={rtcRef}
            streamURL={video && video.stream && video.stream.toURL()}
            style={styles.rtcView}
            zOrder={-1}
            objectFit='cover'
            mirror={true}
            />
            :
            <View style={styles.rtcViewReplacingView}></View>
          }
        </View>
        <View style={styles.callPromptContainer}>
            <View style={styles.callPromptAvatar}>
                <Image
                style={{width: 80, height: 80, borderRadius: 50, objectFit: "contain"}}
                source={ callerDetails.length!= 0 && callerDetails.photo ? 
                  {uri: callerDetails.photo} :
                  AvatarSample
                }
                // defaultSource={FallbackImage}
                // accessibilityLabel={alt}
                />

                <Text style={styles.callPromptCallingName}>
                  {Object.keys(callerDetails).length !== 0 && callerDetails.name ? callerDetails.name :"Name Unavailable"}
                </Text>

                <Text style={styles.callPromptCalling}>Calling</Text>

                <Text style={styles.callPromptCallCategory}>
                  {Object.keys(callerDetails).length !== 0 && callerDetails.callCategory ? callerDetails.callCategory : "Call Category Unavailable"}
                </Text>
            </View>

            <View style={styles.callPromptBottomContainer}>
                <TouchableOpacity onPress={()=>{
                  handleCallReject();
                }} >
                  <CallReject
                    width={60} 
                    height={60}
                    fill="red"
                  />
                {/* <SvgUri
                    width="60"
                    height="60"
                    fill="red"
                    // source={require('../../assets/images/CallReject.svg')}
                    source={require('../../../android/app/src/main/assets/CallReject.svg')}
                /> */}
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                    handleCallAccept();
                    setIncomingCallAnswer(true)
                }}>
                  <CallAccept
                    width={60} 
                    height={60}
                    fill="green"
                  />
                {/* <SvgUri
                    width="60"
                    height="60"
                    fill="green"
                    // source={require('../../assets/images/CallAccept.svg')}   
                    source={require('../../../android/app/src/main/assets/CallAccept.svg')}                   
                /> */}
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
};

export default VideoCalleePromptScreen;
