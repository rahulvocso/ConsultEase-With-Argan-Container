import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: 'black',
    marginTop: 3,
    marginLeft: 4,
  },
});

function HideFab({ id }) {
  const dispatch = useDispatch();
  const hidden = useSelector((state) => state.media.settings.hidden);
  return (
    <FAB
      icon="eye"
      mode="flat"
      color="#ffffff"
      style={styles.fab}
      onPress={() => {
        if (hidden.set.has(id)) {
          dispatch({ type: 'interface-show', value: id });
        } else {
          dispatch({ type: 'interface-hide', value: id });
        }
      }}
    />
  );
}

HideFab.propTypes = {
  id: PropTypes.string,
};

export default HideFab;
