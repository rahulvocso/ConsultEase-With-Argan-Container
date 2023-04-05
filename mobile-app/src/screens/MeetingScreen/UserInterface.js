import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import gravatar from 'gravatar';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { RTCView } from 'react-native-webrtc';
import { useSelector } from 'react-redux';
import Theme from '../../theme';
import InterfaceOverlay from './InterfaceOverlay';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Variables.meeting.background,
    borderColor: Theme.Variables.meeting.border,
    borderWidth: 1,
  },
  textWrapper: {
    paddingTop: 8,
  },
  text: {
    color: Theme.Variables.textPrimary,
  },
  avatar: {
    backgroundColor: Theme.Variables.meeting.avatar,
  },
});

function UserContent({ peer, small, row, index }) {
  const cover = useSelector((state) => state.media.settings.cover[peer.uuid]);
  const [error, setError] = useState(false);

  if (peer.more) {
    return (
      <View style={styles.root}>
        <Avatar.Text
          size={small ? 32 : 64}
          style={styles.avatar}
          color="#121212"
          label={peer.peers}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.text}>more peers</Text>
        </View>
      </View>
    );
  }

  if (!peer.video) {
    return (
      <>
        <View style={styles.root}>
          {peer.email && !error && (
            <Avatar.Image
              size={small ? 32 : 64}
              source={{
                uri: gravatar.url(peer.email, {
                  size: small ? 64 : 128,
                  protocol: 'https',
                  default: '404',
                  rating: 'g',
                }),
              }}
              onError={() => setError(true)}
              style={styles.avatar}
            />
          )}
          {error && (
            <Avatar.Icon
              size={small ? 32 : 64}
              icon="account"
              style={styles.avatar}
              color="#121212"
            />
          )}
          <View style={styles.textWrapper}>
            <Text style={styles.text}>{peer.name || 'Guest'}</Text>
          </View>
        </View>
        <InterfaceOverlay peer={peer} small={small} row={row} index={index} />
      </>
    );
  }

  return (
    <>
      <View style={styles.root}>
        <RTCView
          mirror={!peer.screen && peer.facingMode === 'user'}
          objectFit={cover && !peer.screen ? 'cover' : 'contain'}
          streamURL={peer.video.stream.toURL()}
          zOrder={0}
          style={{ flex: 1, width: '100%', height: '100%' }}
        />
      </View>
      <InterfaceOverlay peer={peer} small={small} row={row} index={index} />
    </>
  );
}

UserContent.propTypes = {
  peer: PropTypes.object,
  small: PropTypes.bool,
  row: PropTypes.number,
  index: PropTypes.number,
};

function UserInterface({ peer, small, row, index }) {
  const uuid = useSelector((state) => state.media.uuid);

  if (peer.audio && peer.uuid !== uuid) {
    return (
      <>
        <UserContent peer={peer} small={small} />
        <RTCView streamURL={peer.audio.stream.toURL()} zOrder={-1} />
      </>
    );
  }
  return <UserContent peer={peer} small={small} row={row} index={index} />;
}

UserInterface.propTypes = {
  peer: PropTypes.object,
  small: PropTypes.bool,
  row: PropTypes.number,
  index: PropTypes.number,
};

export default UserInterface;
