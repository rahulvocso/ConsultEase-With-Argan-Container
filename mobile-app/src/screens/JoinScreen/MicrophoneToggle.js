import { useDispatch, useSelector } from 'react-redux';
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Actions from '../../actions';
import Theme from '../../theme';

const styles = StyleSheet.create({
  toggle: {
    marginHorizontal: 12,
    flex: 1,
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

function MicrophoneToggle() {
  const active = useSelector((state) => !!state.media.local.audio);
  const switching = useSelector((state) => state.media.switching);
  const dispatch = useDispatch();

  return (
    <SegmentedButtons
      style={styles.toggle}
      value={active}
      exclusive
      onValueChange={() => {
        if (active) {
          dispatch(Actions.Media.releaseLocalAudio());
        } else {
          dispatch(Actions.Media.getLocalAudio());
        }
      }}
      buttons={[
        {
          value: false,
          icon: 'microphone-off',
          style: active ? styles.button : styles.activeButton,
        },
        {
          value: true,
          icon: 'microphone',
          style: active ? styles.activeButton : styles.button,
        },
      ]}
      disabled={switching}
    />
  );
}

export default MicrophoneToggle;
