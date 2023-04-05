import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native-paper';
import PinFab from './PinFab';
import CoverFab from './CoverFab';
import HideFab from './HideFab';
import Utils from '../../../utils';
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 16,
  },
  name: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'row',
  },
});

function InterfaceOverlay({ peer, small, row, index }) {
  const pinned = useSelector((state) => state.media.settings.pinned);
  const boxRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const orientation = Utils.useOrientation();

  const handlePress = () => {
    setIsHovering(!isHovering);
  };

  if (small) {
    return null;
  }

  const rootStyle = {
    ...styles.root,
    width: orientation === 'LANDSCAPE' || row === 1 ? '100%' : '50%',
    left: orientation === 'LANDSCAPE' || index === 0 ? 0 : '50%',
    height: orientation === 'PORTRAIT' || row === 1 ? '100%' : '50%',
    top: orientation === 'PORTRAIT' || index === 0 ? 0 : '50%',
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        ref={boxRef}
        style={pinned === peer.id ? styles.root : rootStyle}
      >
        {isHovering && (
          <View style={styles.overlay}>
            <View style={styles.controls}>
              <PinFab id={peer.id} />
              <CoverFab uuid={peer.uuid} screen={peer.screen} />
              <HideFab id={peer.id} />
            </View>
            {peer.video && (
              <View style={styles.name}>
                {!peer.audio && (
                  <View style={{ opacity: 0, height: 0 }}>
                    <Icon name="microphone-off" size={16} color="#ffffff" />
                  </View>
                )}
                <View mx={1}>
                  <Text style={{ color: '#ffffff', textAlign: 'center' }}>{peer.name}</Text>
                </View>
                {!peer.audio && (
                  <View style={{ color: '#ffffff', marginTop: 0.1 }}>
                    <Icon name="microphone-off" size={16} color="#ffffff" />
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

InterfaceOverlay.propTypes = {
  peer: PropTypes.object,
  small: PropTypes.bool,
  row: PropTypes.number,
  index: PropTypes.number,
};

export default InterfaceOverlay;
