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
  },
});

function CoverFab({ uuid, screen }) {
  const dispatch = useDispatch();
  const cover = useSelector((state) => state.media.settings.cover[uuid]);
  const hasVideo = useSelector((state) => state.media.settings.hasVideo[uuid]);
  return (
    <FAB
      icon={cover ? 'fullscreen-exit' : 'fullscreen'}
      mode="flat"
      color="#ffffff"
      style={styles.fab}
      onPress={() => {
        dispatch({ type: 'interface-cover', uuid, value: !cover });
      }}
      disabled={!hasVideo || screen}
    />
  );
}

CoverFab.propTypes = {
  uuid: PropTypes.string,
  screen: PropTypes.bool,
};

export default CoverFab;
