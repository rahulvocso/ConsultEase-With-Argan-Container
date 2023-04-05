import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import xss from 'xss';
import Theme from '../../theme';

const styles = StyleSheet.create({
  textInputWrapper: {
    paddingTop: 32,
    paddingBottom: 8,
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

function MeetingKeyInput() {
  const key = useSelector((state) => state.meeting.key);
  const error = useSelector((state) => state.meeting.errors.key);
  const dispatch = useDispatch();

  return (
    <View style={styles.textInputWrapper}>
      <TextInput
        style={styles.textInput}
        label="Type your meeting key"
        mode="flat"
        size="small"
        onChangeText={(text) => {
          dispatch({ type: 'meeting-key', value: xss((text || '').replace(/[^-A-Za-z0-9]+/g, '-').toLowerCase()) });
        }}
        value={key}
        error={!!error}
        activeUnderlineColor={Theme.Variables.primary}
        textColor={Theme.Variables.textPrimary}
      />
      <HelperText type={error ? 'error' : 'info'} style={styles.helperText}>
        {error || 'Alphanumerical characters and dashes'}
      </HelperText>
    </View>
  );
}

export default MeetingKeyInput;
