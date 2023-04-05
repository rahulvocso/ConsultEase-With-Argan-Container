import { useDispatch, useSelector } from 'react-redux';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Actions from '../../actions';

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: 'black',
    marginTop: -24,
  },
});

function FlipButton() {
  const dispatch = useDispatch();
  const video = useSelector((state) => state.media.local.video);
  const switching = useSelector((state) => state.media.switching);

  return (
    <FAB
      icon="camera-flip"
      mode="flat"
      color="#ffffff"
      style={styles.fab}
      onPress={() => {
        dispatch(Actions.Media.flipCamera());
      }}
      disabled={!video || switching}
    />
  );
}

export default FlipButton;
