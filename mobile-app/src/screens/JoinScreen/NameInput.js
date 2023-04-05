import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import xss from 'xss';
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

function NameInput() {
  const name = useSelector((state) => state.user.name);
  const error = useSelector((state) => state.user.errors.name);
  const dispatch = useDispatch();

  return (
    <View style={styles.textInputWrapper}>
      <TextInput
        style={styles.textInput}
        label="Type your name"
        mode="flat"
        size="small"
        onChangeText={async (text) => {
          const value = xss(text || '');
          dispatch({ type: 'user-name', value });
          try {
            await AsyncStorage.setItem('name', value);
          } catch (e) {
            Utils.logger.error('could not save user name to async storage');
          }
        }}
        value={name}
        error={!!error}
        activeUnderlineColor={Theme.Variables.primary}
        textColor={Theme.Variables.textPrimary}
      />
      <HelperText type={error ? 'error' : 'info'} style={styles.helperText}>
        {error || 'Your display name, to be seen by others'}
      </HelperText>
    </View>
  );
}

export default NameInput;
