import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import xss from 'xss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Utils from '../../utils';
import Theme from '../../theme';

const styles = StyleSheet.create({
  textInputWrapper: {
    paddingTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: Theme.Variables.secondary,
    color: Theme.Variables.secondary,
  },
  helperText: {
    color: Theme.Variables.textSecondary,
  },
});

function EmailInput() {
  const email = useSelector((state) => state.user.email);
  const error = useSelector((state) => state.user.errors.email);
  const dispatch = useDispatch();

  return (
    <View style={styles.textInputWrapper}>
      <TextInput
        style={styles.textInput}
        label="Type your email"
        mode="flat"
        size="small"
        onChangeText={async (text) => {
          const value = xss((text || '').toLowerCase());
          dispatch({ type: 'user-email', value });
          try {
            await AsyncStorage.setItem('email', value);
          } catch (e) {
            Utils.logger.error('could not save user email to async storage');
          }
        }}
        value={email}
        error={!!error}
        activeUnderlineColor={Theme.Variables.primary}
        textColor={Theme.Variables.textPrimary}
      />
      <HelperText type={error ? 'error' : 'info'} style={styles.helperText}>
        {error || "Your Gravatar email, others won't see it"}
      </HelperText>
    </View>
  );
}

export default EmailInput;
