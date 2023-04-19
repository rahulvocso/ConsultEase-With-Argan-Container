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

import {WebView} from 'react-native-webview';

// import StartCamera from './StartCamera';
// import CameraStream from './CameraStream';

function ConsultEaseWebview({setIsCallViewOn, setCalleeDetails}) {
  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const dispatch = useDispatch();

  const [renderedOnce, setRenderedOnce] = useState(false);
  const webviewRef = useRef();
  const isDarkMode = useColorScheme() === 'dark';

  // useEffect(() => {
  //   if (isCameraViewOn) {
  //     // Call the Hooks that should only be used when the camera view is on
  //   } else {
  //     // Call the Hooks that should only be used when the camera view is off
  //     //setIsCameraViewOn();
  //   }
  // }, [isCameraViewOn]);

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

  // useEffect(() => {
  //   Immersive.on();
  //   return () => {
  //     Immersive.off();
  //   };
  // });

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
                // uri: 'http://192.168.0.138:3000',
                uri: 'https://vocso.com',
                uri: 'https://6437e2e60a49181ac33828c4--super-cajeta-000cea.netlify.app/'
                
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
        onMessage={event => {
          console.log(
            'Message received to turn camera On from ConsultEase(InputVideoCallDetails.jsx)!!!',
            event.nativeEvent.data,
            "**event**",
            JSON.parse(event.nativeEvent.data),
          );
          if (event.nativeEvent.data !== '') {
            // setCalleeDetails( JSON.parse(event.nativeEvent.data) );
            // setIsCallViewOn(true);
            dispatch({ type: 'SET_CALL_VIEW_ON', payload: true });
            dispatch({ type: 'SET_CALLEE_DETAILS', payload: JSON.parse(event.nativeEvent.data) })
          }
        }}
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
