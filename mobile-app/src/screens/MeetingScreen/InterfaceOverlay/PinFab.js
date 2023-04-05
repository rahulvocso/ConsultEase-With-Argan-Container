import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Theme from '../../../theme';

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: 'black',
    marginTop: 3,
    marginRight: 4,
  },
});

function PinFab({ id }) {
  const dispatch = useDispatch();
  const pinned = useSelector((state) => state.media.settings.pinned);
  return (
    <FAB
      icon="pin"
      mode="flat"
      color={pinned === id ? Theme.Colors.Dark.primary : '#ffffff'}
      style={styles.fab}
      onPress={() => {
        if (pinned === id) {
          dispatch({ type: 'switch-ui', value: 'matrix', pin: null });
        } else {
          dispatch({ type: 'switch-ui', value: 'pinned', pin: id });
        }
      }}
    />
  );
}

PinFab.propTypes = {
  id: PropTypes.string,
};

export default PinFab;
