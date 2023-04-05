import { useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { RTCView } from 'react-native-webrtc';

const styles = StyleSheet.create({
  localVideoWrapper: {
    marginTop: 16,
    marginBottom: 8,
    maxWidth: '100%',
    width: 240,
    height: 135,
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

function LocalVideo() {
  const video = useSelector((state) => state.media.local.video);

  if (!video || !video.stream) {
    return null;
  }

  return (
    <View style={styles.localVideoWrapper}>
      <RTCView
        style={styles.localVideo}
        mirror={true}
        objectFit="cover"
        streamURL={video.stream.toURL()}
        zOrder={0}
      />
    </View>
  );
}

export default LocalVideo;
