import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
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

function SaveButton() {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.button}
          buttonColor={Theme.Variables.primary}
          textColor={Theme.Variables.textOnPrimary}
          mode="contained"
          onPress={() => {
            navigation.goBack();
          }}
          uppercase
        >
          Save
        </Button>
      </View>
    </View>
  );
}

export default SaveButton;
