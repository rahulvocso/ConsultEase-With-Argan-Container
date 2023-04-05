import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Theme from '../../theme';

const styles = StyleSheet.create({
  textWrapper: {
    paddingTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: Theme.Variables.textPrimary,
  },
});

function DemoText() {
  return (
    <View style={styles.textWrapper}>
      <Text style={styles.text} variant="titleSmall">
        The entire source code of this app is available for sale on CodeCanyon. Please do not hold
        your business meetings on this server.
      </Text>
    </View>
  );
}

export default DemoText;
