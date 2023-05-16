import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import Utils from '../../utils';
import Actions from '../../actions';
import Theme from '../../theme';
import UIMatrix from './UIMatrix';
import UIPinned from './UIPinned';
import MeetingBar from './MeetingBar';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.Variables.meeting.background,
  },
  meetingUI: {
    flex: 1,
  },
});

function MeetingManager() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const joined = useSelector((state) => state.media.joined);
  const ended = useSelector((state) => state.meeting.ended);

  useEffect(() => {
    if (ended) {
      navigation.popToTop();
    } else if (!joined) {
      navigation.goBack();
    } else {
      dispatch(Actions.Media.joinMeeting());
    }
  }, [joined]);

  useEffect(() => {
    console.log('****VIDEO****', video);
  }, [video]);

  return null;
}

function MeetingUI() {
  const orientation = Utils.useOrientation();
  const ui = useSelector((state) => state.media.settings.ui);
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.Variables.meeting.background} />
      <SafeAreaView
        edges={orientation === 'PORTRAIT' ? ['top', 'left', 'right'] : ['top']}
        flex={1}
      >
        <View style={styles.meetingUI}>
          {ui === 'matrix' && <UIMatrix />}
          {ui === 'pinned' && <UIPinned />}
        </View>
        <MeetingBar />
      </SafeAreaView>
    </View>
  );
}

function MeetingScreen() {
  return (
    <>
      <MeetingUI />
      <MeetingManager />
    </>
  );
}

export default MeetingScreen;
