import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, List } from 'react-native-paper';
import gravatar from 'gravatar';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.Colors.Dark.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Theme.Colors.Dark.background,
  },
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: Theme.Colors.Dark.background,
    paddingLeft: 24,
    paddingVertical: 8,
  },
  listItem: {
    width: '100%',
  },
  avatar: {
    backgroundColor: Theme.Variables.meeting.avatar,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

function UserAvatar({ email }) {
  const [error, setError] = useState(false);

  if (error) {
    return <Avatar.Icon size={48} icon="account" style={styles.avatar} color="#121212" />;
  }

  return (
    <Avatar.Image
      size={48}
      source={{
        uri: gravatar.url(email, {
          size: 96,
          protocol: 'https',
          default: '404',
          rating: 'g',
        }),
      }}
      onError={() => setError(true)}
      style={styles.avatar}
    />
  );
}

UserAvatar.propTypes = {
  email: PropTypes.string,
};

function MeetingPeople() {
  const interfaces = useSelector((state) => state.media.interfaces);
  const pinned = useSelector((state) => state.media.settings.pinned);
  const hidden = useSelector((state) => state.media.settings.hidden);
  const dispatch = useDispatch();
  const getPeerType = (peer) => {
    if (peer.screen) {
      return 'Screen share';
    }
    if (peer.video && !peer.audio) {
      return 'Video only';
    }
    if (peer.audio && !peer.video) {
      return 'Audio only';
    }
    return 'Silent listener';
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
      >
        {interfaces.map((peer) => (
          <List.Item
            key={peer.uuid}
            style={styles.listItem}
            title={peer.name}
            description={getPeerType(peer)}
            left={() => <UserAvatar email={peer.email} />}
            right={() => (
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() => {
                    if (pinned === peer.id) {
                      dispatch({ type: 'switch-ui', value: 'matrix', pin: null });
                    } else {
                      dispatch({ type: 'switch-ui', value: 'pinned', pin: peer.id });
                    }
                  }}
                >
                  <Icon
                    name="pin"
                    size={24}
                    color={pinned === peer.id ? Theme.Colors.Dark.primary : '#ffffff'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (hidden.set.has(peer.id)) {
                      dispatch({ type: 'interface-show', value: peer.id });
                    } else {
                      dispatch({ type: 'interface-hide', value: peer.id });
                    }
                  }}
                  style={{ marginLeft: 8 }}
                >
                  <Icon
                    name={!hidden.set.has(peer.id) ? 'eye' : 'eye-off'}
                    size={24}
                    color={!hidden.set.has(peer.id) ? Theme.Colors.Dark.primary : '#ffffff'}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default MeetingPeople;
