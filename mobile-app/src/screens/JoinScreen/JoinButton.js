import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useState } from 'react';
import Validator from 'validator';
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

function JoinButton() {
  const [loading] = useState();
  const socketId = useSelector((state) => state.socket.id);
  const name = useSelector((state) => state.user.name);
  const email = useSelector((state) => state.user.email);
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
            dispatch({ type: 'user-errors-clear' });
            if (Utils.isEmpty(name)) {
              dispatch({ type: 'user-errors-name', error: 'Name required' });
              return;
            }
            if (Utils.isEmpty(email)) {
              dispatch({ type: 'user-errors-email', error: 'Email required' });
              return;
            }
            const isValidEmail = Validator.isEmail(email);
            if (!isValidEmail) {
              dispatch({ type: 'user-errors-email', error: 'Invalid email' });
              return;
            }
            if (name && isValidEmail) {
              dispatch({ type: 'join', name, email });
              navigation.navigate('Meeting', { key });
            }
          }}
          uppercase
          disabled={loading || !socketId}
        >
          Join the Meeting
        </Button>
      </View>
    </View>
  );
}

export default JoinButton;
