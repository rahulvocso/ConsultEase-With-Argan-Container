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
import notifee, {AndroidImportance} from '@notifee/react-native';

import Actions from '../../actions';
import Theme from '../../theme';

import AvatarSample from '../../assets/images/AvatarSample.png';
// import CallAccept from '../../assets/images/CallAccept.svg';
import CallAccept from '../../../android/app/src/main/assets/CallAccept.svg';
import CallReject from '../../../android/app/src/main/assets/CallReject.svg';
// import CallReject from '../../assets/images/CallReject.svg';


const VideoCalleePromptScreen = () => {
  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const calleeDetails = useSelector(state => state.webview.calleeDetails);
  const dispatch = useDispatch();

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const video = useSelector((state) => state.media.local.video);
  const active = useSelector((state) => !!state.media.local.video);
  const navigation = useNavigation();
  const key = useSelector((state) => state.meeting.key);

  useLayoutEffect(() => {
    dispatch(Actions.Media.getLocalVideo());
    dispatch(Actions.Media.getLocalAudio());
    console.log('calleeDetails inside VideoCalleePrompt',calleeDetails)
    console.log('calleeDetails.photo inside VideoCalleePrompt', typeof calleeDetails.photo)

    // return () => {
    //     dispatch(Actions.Media.releaseLocalVideo());
    //     dispatch(Actions.Media.releaseLocalAudio());
    // }
  }, [])

  const returnToWebview = () => {
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    dispatch(Actions.Media.releaseLocalVideo());
    dispatch(Actions.Media.releaseLocalAudio());
  };

//   if (!video || !video.stream) {
//     return null;
//   }

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
            streamURL={video && video.stream && video.stream?.toURL()}
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
                source={ calleeDetails.length!= 0 && calleeDetails.photo ? 
                  {uri: calleeDetails.photo} :
                  AvatarSample
                }
                // defaultSource={FallbackImage}
                // accessibilityLabel={alt}
                />

                <Text style={styles.callPromptCallingName}>
                  {Object.keys(calleeDetails).length !== 0 && calleeDetails.name ? calleeDetails.name :"Name Unavailable"}
                </Text>

                <Text style={styles.callPromptCalling}>Calling</Text>

                <Text style={styles.callPromptCallCategory}>
                  {Object.keys(calleeDetails).length !== 0 && calleeDetails.callCategory ? calleeDetails.callCategory : "Call Category Unavailable"}
                </Text>
            </View>

            <View style={styles.callPromptBottomContainer}>
                <TouchableOpacity onPress={returnToWebview} >
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
                    //setCallPromptView(false);
                    navigation.navigate('VideoCall', { key });
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