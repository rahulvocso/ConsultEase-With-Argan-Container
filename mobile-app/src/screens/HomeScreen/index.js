import { Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import logo from '../../assets/images/logo.png';
import MeetingKeyInput from './MeetingKeyInput';
import config from '../../../config';
import GoToButton from './GoToButton';
import GenerateRandomButton from './GenerateRandomButton';
import DemoButton from './DemoButton';
import DemoText from './DemoText';
import Theme from '../../theme';

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
    paddingBottom: 24,
    backgroundColor: Theme.Variables.background,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  titleWrapper: {
    paddingTop: 24,
  },
  logoWrapper: {
    paddingTop: 24,
  },
  text: {
    color: Theme.Variables.textPrimary,
  },
});

function HomeScreen() {
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
            Enterprise Meetings Platform
          </Text>
        </View>
        {config.demo && <DemoButton />}
        <MeetingKeyInput />
        <Text variant="titleSmall" style={styles.text }>
          - or -
        </Text>
        <GenerateRandomButton />
        {config.demo && <DemoText />}
        <GoToButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default HomeScreen;
