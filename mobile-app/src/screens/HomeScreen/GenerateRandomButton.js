import { useDispatch } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Theme from '../../theme';

const styles = StyleSheet.create({
  buttonWrapper: {
    paddingTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 480,
    borderColor: Theme.Variables.primary,
  },
});

function GenerateRandomButton() {
  const dispatch = useDispatch();
  return (
    <View style={styles.root}>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.button}
          textColor={Theme.Variables.primary}
          icon="shuffle"
          mode="outlined"
          onPress={() => {
            dispatch({ type: 'meeting-key-random' });
          }}
          uppercase
        >
          Generate Random
        </Button>
      </View>
    </View>
  );
}

export default GenerateRandomButton;
