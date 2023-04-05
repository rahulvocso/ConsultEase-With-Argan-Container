import { Linking, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    paddingTop: 16,
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

function DemoButton() {
  const goToCodeCanyon = async () => {
    try {
      await Linking.openURL('https://codecanyon.net/user/honeyside/portfolio');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.button}
          buttonColor={Theme.Variables.primary}
          textColor={Theme.Variables.textOnPrimary}
          icon="open-in-new"
          mode="contained"
          onPress={goToCodeCanyon}
          uppercase
        >
          Buy source on CodeCanyon
        </Button>
      </View>
    </View>
  );
}

export default DemoButton;
