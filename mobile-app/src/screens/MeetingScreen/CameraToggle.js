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

function CameraToggle() {
  const available = useSelector((state) => state.media.devices.video);
  const active = useSelector((state) => !!state.media.local.video);
  const switching = useSelector((state) => state.media.switching);
  const dispatch = useDispatch();

  return (
    <FAB
      icon={active ? 'video' : 'video-off'}
      mode="flat"
      color={active && !switching ? '#000000' : '#ffffff'}
      style={{
        ...styles.fab,
        backgroundColor: active && !switching ? '#feb100' : '#000000',
      }}
      onPress={() => {
        if (active) {
          dispatch(Actions.Media.releaseLocalVideo());
        } else {
          dispatch(Actions.Media.getLocalVideo());
        }
      }}
      disabled={!available || switching}
    />
  );
}

export default CameraToggle;
