import { Alert, AppState, Keyboard, Linking, Platform, StatusBar, View, Text } from 'react-native';
import { NativeModules } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import xss from 'xss';
import Screens from './src/screens';
import VideoCalleePromptScreen from './src/screens/CallScreen/VideoCalleePromptScreen';
import VideoCallerPromptScreen from './src/screens/CallScreen/VideoCallerPromptScreen';
import VideoCallScreen from './src/screens/CallScreen/VideoCallScreen';
import CallRatingScreen from './src/screens/CallScreen/CallRatingScreen';
import NativeServiceTest from './src/foreground-background-services/NativeServiceTest';
import InternetServiceTest from './src/foreground-background-services/InternetServiceTest';

import Common from './src/common';
import Utils from './src/utils';
import Theme from './src/theme';
import Actions from './src/actions';
import config from './config';

import SystemNavigationBar from 'react-native-system-navigation-bar';

// import Sound from 'react-native-sound';
import ConsultEaseWebview from './webview-components/Components/ConsultEaseWebview';
import postSocket from './src/foreground-background-services/postSocket';
import useFetch from './src/hooks/useFetch';
import getSocket from './src/foreground-background-services/getSocket';
import initCallDetailsGetRoom from './src/screens/CallScreen/initCallDetailsGetRoom';
// import CheckInternetService from './src/foreground-background-services/InternetStatus';

function CustomAppBar({ navigation, route }) {
  const theme = useTheme();
  const openInAppBrowser = async () => {
    try {
      const url = 'https://www.honeyside.it';
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'done',
          preferredBarTintColor: theme.colors.background,
          preferredControlTintColor: theme.colors.onBackground,
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: theme.colors.background,
          secondaryToolbarColor: theme.colors.background,
          navigationBarColor: theme.colors.background,
          navigationBarDividerColor: theme.colors.onBackground,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        await Linking.openURL(url);
        yarn;
      }
    } catch (e) {
      Alert.alert('Could not open the in-app browser. Your device might be too old.');
    }
  };

  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: Theme.Variables.secondary }}>
      {route.name === 'Join' && (
        <Appbar.BackAction color={Theme.Variables.textPrimary} onPress={navigation.goBack} />
      )}
      {route.name === 'Settings' && (
        <Appbar.BackAction color={Theme.Variables.textPrimary} onPress={navigation.goBack} />
      )}
      {route.name === 'Home' && (
        <Appbar.Action
          color={Theme.Variables.textPrimary}
          style={{ transform: [{ rotate: '90deg' }] }}
          icon="hexagon-multiple"
          onPress={openInAppBrowser}
        />
      )}
      <Appbar.Content
        color={Theme.Variables.textPrimary}
        title={config.appTitle}
        titleStyle={{ fontFamily: 'KaushanScript-Regular' }}
      />
      {route.name !== 'Settings' && (
        <Appbar.Action
          color={Theme.Variables.textPrimary}
          icon="cog"
          onPress={() => navigation.navigate('Settings')}
        />
      )}
    </Appbar.Header>
  );
}

CustomAppBar.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

function ConditionalAppBar({ route, navigation }) {
  return route.name !== 'Meeting' &&
    route.name !== 'MeetingContent' &&
    route.name !== 'VideoCalleePrompt' &&
    route.name !== 'VideoCallerPrompt' &&
    route.name !== 'VideoCall' &&
    route.name !== 'CallRating'
    ? CustomAppBar({ route, navigation })
    : null;
}

ConditionalAppBar.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const Tab = createMaterialTopTabNavigator();

const Drawer = createDrawerNavigator();

function DrawerTabs() {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [bottom, setBottom] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isDrawerOpen) {
      Keyboard.dismiss();
      setBottom(0);
    }
  }, isDrawerOpen);

  useEffect(() => {
    function onKeyboardChange(e) {
      if (e.endCoordinates.screenY <= e.startCoordinates.screenY) {
        setBottom(e.endCoordinates.height / 2 - (42 + insets.top) + insets.bottom / 2);
      } else setBottom(0);
    }

    if (Platform.OS === 'ios') {
      const subscription = Keyboard.addListener('keyboardWillChangeFrame', onKeyboardChange);
      return () => subscription.remove();
    }

    const subscriptions = [
      Keyboard.addListener('keyboardDidHide', onKeyboardChange),
      Keyboard.addListener('keyboardDidShow', onKeyboardChange),
    ];
    return () => {
      Keyboard.dismiss();
      setBottom(0);
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return (
    <SafeAreaView flex={1} style={{ backgroundColor: Theme.Variables.background }}>
      <NavigationContainer independent>
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            tabBarShowIcon: true,
            tabBarIconStyle: { width: 50, alignItems: 'center' },
            tabBarIndicatorStyle: { backgroundColor: Theme.Variables.primary },
            tabBarStyle: { backgroundColor: Theme.Variables.secondary },
          }}
          style={{ paddingBottom: bottom, backgroundColor: Theme.Variables.background }}
        >
          <Tab.Screen
            name="Chat"
            component={Screens.MeetingChat}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  name="message-text"
                  size={30}
                  color={focused ? Theme.Variables.primary : Theme.Variables.textPrimary}
                />
              ),
            }}
          />
          <Tab.Screen
            name="People"
            component={Screens.MeetingPeople}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  name="account-multiple"
                  size={30}
                  color={focused ? Theme.Variables.primary : Theme.Variables.textPrimary}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

function MeetingNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={DrawerTabs}
      screenOptions={{
        header: ConditionalAppBar,
        drawerType: 'front',
        drawerPosition: 'right',
        drawerStyle: { width: Platform.isPad ? 360 : '85%' },
      }}
    >
      <Drawer.Screen name="MeetingContent" component={Screens.MeetingScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);
  const appState = useRef(AppState.currentState);

  const getUrlAsync = async () => {
    // Get the deep link used to open the app
    const initialUrl = await Linking.getInitialURL();
    setUrl(initialUrl);
    setProcessing(false);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        getUrlAsync();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    getUrlAsync();
  }, []);

  return { url, processing };
};

// APP COMPONENT
function App() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { url: initialUrl } = useInitialURL();
  const socketId = useSelector((state) => state.socket.id);
  const device = useSelector((state) => state.media.device);
  const isCallViewOn = useSelector((state) => state.webview.isCallViewOn);
  const calleeDetails = useSelector((state) => state.webview.calleeDetails);
  //Consulteas user profile data received from webview
  const consulteaseUserProfileData = useSelector((state) =>
    state.webview.consulteaseUserProfileData ? state.webview.consulteaseUserProfileData : {},
  );

  // const consulteaseUserProfileData = {
  //   _id: '639854af79cea626807688ba',
  //   auth_token:
  //     'eyJhbGciOiJIUzI1NiJ9.NjM5ODU0YWY3OWNlYTYyNjgwNzY4OGJh.Z9xf4J2JpqUEb_2-5ObYFLrCbRRe8IeJZ3NDwXltKkE',
  // };

  const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');

  // post socket_id to server as and when socketId changes
  useEffect(() => {
    console.log('useEffect consulteasedata', consulteaseUserProfileData.fname, calleeDetails.name);
    if (
      Object.keys(consulteaseUserProfileData).length !== 0 &&
      consulteaseUserProfileData.auth_token &&
      consulteaseUserProfileData._id
    ) {
      socketId ? postSocket(consulteaseUserProfileData, socketId, post) : null;
      calleeDetails.user_id &&
        initCallDetailsGetRoom(
          (from_user = consulteaseUserProfileData._id),
          (to_user = calleeDetails.user_id),
          (auth_token = consulteaseUserProfileData.auth_token),
          (callCategory = calleeDetails.callCategory),
        );
    }

    // getSocket(consulteaseUserProfileData, socketId, get);
  }, [socketId]);

  useEffect(() => {
    // SystemNavigationBar.stickyImmersive();
    // SystemNavigationBar.immersive();
    // SystemNavigationBar.leanBack();
    SystemNavigationBar.navigationHide();
    SystemNavigationBar.setNavigationBarDividerColor('#ffffff');
    SystemNavigationBar.setNavigationColor('#ffffff', 'light', 'navigation'); // '#3db271'
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content');
    // SystemNavigationBar.setBarMode('light', 'both');
    //***foreground service start***
    // HeadlessJsTaskService.register(CheckInternetService, 'CheckInternetTask');

    console.log(
      'In Native Container UseEffect calleeDetails',
      'socket id',
      socketId,
      calleeDetails,
      'isCallViewOn',
      isCallViewOn,
    );
    return () => {};
  }, [calleeDetails, isCallViewOn, socketId]);

  // if isCallViewOn is false/off set data derived from webview to empty/null/initial redux state;
  useState(() => {
    isCallViewOn ? null : dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
  }, [isCallViewOn]);
  //

  useEffect(() => {
    AsyncStorage.getItem('name')
      .then((text) => {
        dispatch({ type: 'user-name', value: text || '' });
      })
      .catch((e) => {
        Utils.logger.error('could not read user name from async storage', e);
      });
    AsyncStorage.getItem('email')
      .then((text) => {
        dispatch({ type: 'user-email', value: text || '' });
      })
      .catch((e) => {
        Utils.logger.error('could not read user email from async storage', e);
      });
  }, []);

  useEffect(() => {
    let url = initialUrl;
    if (url) {
      if (url.endsWith('/')) {
        url = url.slice(0, url.length - 1);
      }
      const array = url.split('/');
      const key = array[array.length - 1];
      dispatch({ type: 'meeting-key', value: xss((key || '').toLowerCase()) });
      navigation.navigate('Join', { key });
    }
  }, [initialUrl]);

  useEffect(() => {
    if (!socketId) {
      dispatch(Actions.IO.setupSocket());
    }
    // update socketId in
    // socketId ? dispatch(Actions.Media.setupMedia()) : null;
  }, [socketId]);

  useEffect(() => {
    if (socketId && !device) {
      dispatch(Actions.Media.setupMedia());
    }
  }, [socketId, device]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.Variables.background }}>
      {/* Theme.Variables.background */}
      {/* {isCallViewOn ? ( */}
      <>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          screenOptions={{
            header: ConditionalAppBar,
          }}
        >
          {/* <Stack.Screen name="InternetServiceTest" component={InternetServiceTest} /> */}
          {/* <Stack.Screen name="VideoCallerPrompt" component={VideoCallerPromptScreen} />
            <Stack.Screen name="VideoCalleePrompt" component={VideoCalleePromptScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
            <Stack.Screen name="CallRating" component={CallRatingScreen} /> */}
          <Stack.Screen name="Home" component={Screens.HomeScreen} />
          <Stack.Screen name="Join" component={Screens.JoinScreen} />
          <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
          <Stack.Screen name="Meeting" component={MeetingNavigator} />
        </Stack.Navigator>
        <Common.Snack />
      </>
      {/* ) : (
        <ConsultEaseWebview />
      )} */}
    </SafeAreaView>
  );
}

export default App;
