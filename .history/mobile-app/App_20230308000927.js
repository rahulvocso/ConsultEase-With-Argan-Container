import { Alert, AppState, Keyboard, Linking, Platform, StatusBar } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import xss from 'xss';
import Screens from './src/screens';
import Common from './src/common';
import Utils from './src/utils';
import Theme from './src/theme';
import Actions from './src/actions';
import config from './config';

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
  return route.name !== 'Meeting' && route.name !== 'MeetingContent'
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

function App() {
  const { url: initialUrl } = useInitialURL();
  const socketId = useSelector((state) => state.socket.id);
  const device = useSelector((state) => state.media.device);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
  }, [socketId]);

  useEffect(() => {
    if (socketId && !device) {
      dispatch(Actions.Media.setupMedia());
    }
  }, [socketId, device]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Theme.Variables.secondary} />
      <Stack.Navigator
        screenOptions={{
          header: ConditionalAppBar,
        }}
      >
        <Stack.Screen name="Home" component={Screens.HomeScreen} />
        <Stack.Screen name="Join" component={Screens.JoinScreen} />
        <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
        <Stack.Screen name="Meeting" component={MeetingNavigator} />
      </Stack.Navigator>
      <Common.Snack />
    </>
  );
}

export default App;
