import { Button, Dialog, FAB, Portal, Text } from 'react-native-paper';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Theme from '../../theme';
import CameraToggle from './CameraToggle';
import MicrophoneToggle from './MicrophoneToggle';
import FlipButton from './FlipButton';
import Actions from '../../actions';

const styles = StyleSheet.create({
  meetingBar: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Variables.meeting.bar,
  },
  transparentFab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: 'transparent',
    marginHorizontal: 8,
  },
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: 'black',
    marginTop: -24,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

function MeetingBar() {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <View style={styles.meetingBar}>
      <FAB
        icon="phone-off"
        mode="flat"
        style={styles.transparentFab}
        color="#f44336"
        onPress={() => setConfirmationOpen(true)}
      />
      <View style={styles.controls}>
        <FlipButton />
        <MicrophoneToggle />
        <CameraToggle />
      </View>
      <FAB
        icon="message-text"
        mode="flat"
        color="#ffffff"
        style={styles.transparentFab}
        onPress={() => navigation.openDrawer()}
      />
      <Portal>
        <Dialog
          style={{ backgroundColor: '#434343' }}
          visible={confirmationOpen}
          onDismiss={() => setConfirmationOpen(false)}
        >
          <Dialog.Title>Leave</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to leave the meeting?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={Theme.Variables.primary} onPress={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
          </Dialog.Actions>
          <Dialog.Actions>
            <Button
              textColor={Theme.Variables.primary}
              onPress={() => {
                dispatch(Actions.Media.leaveMeeting());
              }}
            >
              Get out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

export default MeetingBar;
