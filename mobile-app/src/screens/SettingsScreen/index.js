import { Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from 'react-native-paper';
import logo from '../../assets/images/logo.png';
import NameInput from './NameInput';
import EmailInput from './EmailInput';
import Theme from '../../theme';
import FacingModeToggle from './FacingModeToggle';
import SaveButton from './SaveButton';
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
  facingModeWrapper: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  facingModeTextWrapper: {
    marginBottom: 12,
  },
});

function SettingsScreen() {
  const facingMode = useSelector((state) => state.media.settings.facingMode);
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
            General Settings
          </Text>
        </View>
        <View style={styles.facingModeWrapper}>
          <Text variant="titleSmall" style={styles.text}>
            Facing mode:
          </Text>
          <FacingModeToggle />
        </View>
        <View style={styles.facingModeTextWrapper}>
          <Text variant="titleSmall" style={styles.text}>
            Camera will face the {facingMode}
          </Text>
        </View>
        <NameInput />
        <EmailInput />
        <SaveButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SettingsScreen;
