import { useDispatch, useSelector } from 'react-redux';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Actions from '../../actions';
import Theme from '../../theme';

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 32,
    backgroundColor: 'black',
    marginTop: -32,
    marginBottom: 32,
    marginHorizontal: 10,
  },
});

function MicrophoneToggle() {
  const available = useSelector((state) => state.media.devices.audio);
  const active = useSelector((state) => !!state.media.local.audio);
  const switching = useSelector((state) => state.media.switching);
  const dispatch = useDispatch();

  return (
    <FAB
      icon={active ? 'microphone' : 'microphone-off'}
      mode="flat"
      color={active && !switching ? '#000000' : '#ffffff'}
      style={{
        ...styles.fab,
        backgroundColor: active && !switching ? '#feb100' : '#000000',
      }}
      onPress={() => {
        if (active) {
          dispatch(Actions.Media.releaseLocalAudio());
        } else {
          dispatch(Actions.Media.getLocalAudio());
        }
      }}
      disabled={!available || switching}
    />
  );
}

export default MicrophoneToggle;
