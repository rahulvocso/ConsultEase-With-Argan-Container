import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import xss from 'xss';
import Utils from '../../utils';
import config from '../../../config';
import Theme from '../../theme';

const styles = StyleSheet.create({
  textInputWrapper: {
    paddingTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    backgroundColor: Theme.Variables.secondary,
    color: Theme.Variables.secondary,
  },
  helperText: {
    color: Theme.Variables.textSecondary,
  },
});

function MeetingURL() {
  const key = useSelector((state) => state.meeting.key);
  const dispatch = useDispatch();

  const url = `${config.url}/meeting/${key}`;

  return (
    <View style={styles.textInputWrapper}>
      <TextInput
        style={styles.textInput}
        label="Meeting URL"
        mode="flat"
        size="small"
        onChangeText={(text) => {
          dispatch({ type: 'user-name', value: xss((text || '').toLowerCase()) });
        }}
        value={url}
        activeUnderlineColor={Theme.Variables.primary}
        textColor={Theme.Variables.textPrimary}
        selectTextOnFocus
        onFocus={async () => {
          try {
            Clipboard.setString(url);
            dispatch({
              type: 'snack',
              content: 'Meeting URL copied to clipboard',
              icon: 'clipboard',
            });
          } catch (x) {
            Utils.logger.warn('could not copy url to clipboard');
          }
        }}
      />
      <HelperText type="info" style={styles.helperText}>
        Copy the meeting URL to your clipboard
      </HelperText>
    </View>
  );
}

export default MeetingURL;
