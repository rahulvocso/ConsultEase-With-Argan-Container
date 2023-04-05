import { useDispatch, useSelector } from 'react-redux';
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Actions from '../../actions';
import Theme from '../../theme';

const styles = StyleSheet.create({
  toggle: {
    flex: 1,
    marginHorizontal: 12,
    borderColor: Theme.Variables.segmentedButtons.border,
  },
  activeButton: {
    backgroundColor: Theme.Variables.segmentedButtons.active,
    borderColor: Theme.Variables.segmentedButtons.border,
  },
  button: {
    backgroundColor: Theme.Variables.background,
    borderColor: Theme.Variables.segmentedButtons.border,
  },
});

function CameraToggle() {
  const active = useSelector((state) => !!state.media.local.video);
  const switching = useSelector((state) => state.media.switching);
  const dispatch = useDispatch();

  return (
    <SegmentedButtons
      style={styles.toggle}
      value={active}
      exclusive
      onValueChange={() => {
        if (active) {
          dispatch(Actions.Media.releaseLocalVideo());
        } else {
          dispatch(Actions.Media.getLocalVideo());
        }
      }}
      buttons={[
        {
          value: false,
          icon: 'video-off',
          style: active ? styles.button : styles.activeButton,
        },
        {
          value: true,
          icon: 'video',
          style: active ? styles.activeButton : styles.button,
        },
      ]}
      disabled={switching}
    />
  );
}

export default CameraToggle;
