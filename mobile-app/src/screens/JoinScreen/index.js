import { Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Text } from 'react-native-paper';
import logo from '../../assets/images/logo.png';
import NameInput from './NameInput';
import EmailInput from './EmailInput';
import JoinButton from './JoinButton';
import MeetingURL from './MeetingURL';
import CameraToggle from './CameraToggle';
import MicrophoneToggle from './MicrophoneToggle';
import LocalVideo from './LocalVideo';
import Actions from '../../actions';
import Theme from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Theme.Variables.background,
  },
  scrollView: {
    paddingHorizontal: 24,
    backgroundColor: Theme.Variables.background,
  },
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: Theme.Variables.background,
    paddingBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  titleWrapper: {
    paddingTop: 16,
  },
  logoWrapper: {
    paddingTop: 24,
  },
  togglesWrapper: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 16,
    maxWidth: 480,
  },
  text: {
    color: Theme.Variables.textPrimary,
  },
});

function JoinManager() {
  const key = useSelector((state) => state.meeting.key);
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.id);

  useEffect(() => {
    if (socket) {
      dispatch(Actions.IO.joinRoom(key));
    }
  }, [socket]);

  return null;
}

function JoinUI() {
  const key = useSelector((state) => state.meeting.key);
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled
      keyboardVerticalOffset={64 + insets.top}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.logoWrapper}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.titleWrapper}>
          <Text variant="titleSmall" style={styles.text}>
            Meeting ID: {key}
          </Text>
        </View>
        <NameInput />
        <EmailInput />
        <LocalVideo />
        <View style={styles.togglesWrapper}>
          <MicrophoneToggle />
          <CameraToggle />
        </View>
        <JoinButton />
        <MeetingURL />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function JoinScreen() {
  return (
    <>
      <JoinUI />
      <JoinManager />
    </>
  );
}

export default JoinScreen;
