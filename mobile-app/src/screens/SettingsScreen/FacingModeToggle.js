import { useDispatch, useSelector } from 'react-redux';
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Theme from '../../theme';

const styles = StyleSheet.create({
  toggle: {
    flex: 1,
    marginLeft: 24,
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

function FacingModeToggle() {
  const facingMode = useSelector((state) => state.media.settings.facingMode);
  const switching = useSelector((state) => state.media.switching);
  const dispatch = useDispatch();

  return (
    <SegmentedButtons
      style={styles.toggle}
      value={facingMode}
      exclusive
      onValueChange={() => {
        dispatch({ type: 'facing-mode' });
      }}
      buttons={[
        {
          value: false,
          icon: 'account',
          style: facingMode === 'user' ? styles.activeButton : styles.button,
        },
        {
          value: true,
          icon: 'image',
          style: facingMode === 'environment' ? styles.activeButton : styles.button,
        },
      ]}
      disabled={switching}
    />
  );
}

export default FacingModeToggle;
