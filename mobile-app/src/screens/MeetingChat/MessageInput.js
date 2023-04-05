import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import xss from 'xss';
import { useState } from 'react';
import Utils from '../../utils';
import Theme from '../../theme';
import Actions from '../../actions';

const styles = StyleSheet.create({
  textInputWrapper: {
    paddingTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#171717',
    color: Theme.Variables.secondary,
  },
  helperText: {
    color: Theme.Variables.textSecondary,
  },
});

function MessageInput() {
  const [text, setText] = useState('');
  const error = useSelector((state) => state.user.errors.name);
  const dispatch = useDispatch();

  const send = () => {
    if (!text || text === '') {
      return;
    }
    dispatch(Actions.IO.sendMessage({ content: xss(text) }));
    setText('');
  };

  return (
    <View style={styles.textInputWrapper}>
      <TextInput
        style={styles.textInput}
        label="Type a message"
        mode="flat"
        size="small"
        onChangeText={async (text) => {
          const value = xss(text || '');
          setText(value);
        }}
        value={text}
        error={!!error}
        activeUnderlineColor={Theme.Variables.primary}
        textColor={Theme.Variables.textPrimary}
        right={<TextInput.Icon icon="send" onPress={send} />}
      />
    </View>
  );
}

export default MessageInput;
