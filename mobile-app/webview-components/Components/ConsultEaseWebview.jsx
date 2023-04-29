/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useState, useRef, useEffect} from 'react';
import {
  AppRegistry,
  Platform,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Immersive from 'react-native-immersive';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {WebView} from 'react-native-webview';

// import StartCamera from './StartCamera';
// import CameraStream from './CameraStream';

function ConsultEaseWebview({setIsCallViewOn, setCalleeDetails}) {
  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const dispatch = useDispatch();

  const [renderedOnce, setRenderedOnce] = useState(false);
  const webviewRef = useRef();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const updateSource = () => {
    setRenderedOnce(true);
  };

  function alert(arg0) {
    throw new Error('Function not implemented.');
  }

  const runScript = `
  // document.body.style.backgroundColor = 'red';
  // setTimeout(function() { window.alert('hi') }, 2000);
  true; // note: this is required, or you'll sometimes get silent failures
  `;

  // handles msg received from webview components

  const handleWebViewMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    const messageType = message.messageType;
    const messageData = message.messageData;

    console.log("message received" ,message ,messageType,"messagedata typeof", messageData)
    // Use the messageType to distinguish between messages from different components
    switch (messageType) {
      case 'calleeDetails':
        {
          console.log(
            'Message received to turn camera On from ConsultEase(InputVideoCallDetails.jsx)!!!',
            "**message type**", messageType,
            "**message data**", messageData.name,
          );
          dispatch({ type: 'SET_CALL_VIEW_ON', payload: true });
          dispatch({ type: 'SET_CALLEE_DETAILS', payload: messageData })
        }
        break;
      case 'consulteaseUserProfileData':
        {
          console.log(
            'Message received to set consulteaseUserProfileData from ConsultEase(InputVideoCallDetails.jsx)!!!',
            "**message type**", messageType,
            "**message data**", messageData.fname,
          );
          if (messageData !== ({} || undefined) ) {
            dispatch({ type: 'SET_CONSULTEASE_USER_PROFILE_DATA', payload: messageData })
          }
          // set consulteaseUserProfileData on locally storage
          // AsyncStorage.setItem('consulteaseUserProfileData', JSON.stringify(messageData))
          // .then(() => {
          //   console.log('consulteaseUserProfileData saved successfully comp:ConsultEaseWebview');
          // })
          // .catch((error) => {
          //   console.log('Error saving consulteaseUserProfileData: ', error);
          // })
        }
        break;
      default:
        // Handle messages from unknown components
        break;
    }
  }

  // useEffect(() => {
  //   Immersive.on();
  //   return () => {
  //     Immersive.off();
  //   };
  // });

  function postMessageToWeb(){
    //asdf
  }

  return (
    <View
      style={{
        flex: 1,
        // width: useWindowDimensions().width,
        // height: useWindowDimensions().height,
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        //injectedJavaScript={runScript}
        source={
          // renderedOnce
          //   ? 
          {
            // uri: 'http://10.0.2.2:3056',
            uri: 'http://192.168.0.138:3056',
            // uri: 'https://vocso.com',
            // uri: 'https://64461e51092a25761f28c8ac--consultease.netlify.app'
            
          }
            // : undefined
        }
        style={{ 
          flex: 1,
          minWidth: useWindowDimensions().width,
          maxHeight: useWindowDimensions().height,
          borderRadius: 1,
          borderBottomColor: '#396967',
        }}
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowsFullscreenVideo
        domStorageEnabled={true}
        javaScriptEnabled
        javaScriptEnabledAndroid={true}
        onLoad={updateSource}
        onMessage={ (event) => handleWebViewMessage(event) }
        scalesPageToFit={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default ConsultEaseWebview;
