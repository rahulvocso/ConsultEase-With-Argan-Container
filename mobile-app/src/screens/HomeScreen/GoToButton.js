import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Utils from '../../utils';
import Theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    paddingTop: 32,
    paddingBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 480,
  },
  button: {
    width: '100%',
    maxWidth: 480,
  },
});

function GoToButton() {
  const key = useSelector((state) => state.meeting.key);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View style={styles.root}>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.button}
          buttonColor={Theme.Variables.primary}
          textColor={Theme.Variables.textOnPrimary}
          mode="contained"
          onPress={() => {
            dispatch({ type: 'meeting-errors-clear' });
            if (Utils.isEmpty(key)) {
              dispatch({ type: 'meeting-errors-key', error: 'Meeting key required' });
              return;
            }
            const regex = /^[a-zA-Z0-9-]+$/;
            if (key.search(regex) === -1) {
              dispatch({ type: 'meeting-errors-key', error: 'Only alphanumerical and dashes' });
              return;
            }
            if (key) {
              navigation.navigate('Join', { key });
            }
          }}
          uppercase
        >
          Go To Meeting
        </Button>
      </View>
    </View>
  );
}

export default GoToButton;
