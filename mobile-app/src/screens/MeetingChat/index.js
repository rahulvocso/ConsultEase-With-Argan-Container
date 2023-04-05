import { KeyboardAvoidingView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import { v4 as generateUUID } from 'uuid';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import striptags from 'striptags';
import RenderHtml from 'react-native-render-html';
import { Card, Text } from 'react-native-paper';
import MessageInput from './MessageInput';
import Theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 16,
  },
  messageWrapper: {
    width: '100%',
  },
  message: {
    margin: 4,
    flexDirection: 'column',
    display: 'flex',
  },
  authorTime: {
    marginTop: 2,
    marginBottom: 4,
  },
  authorTimeText: {
    fontSize: 11,
  },
  cardEnd: {
    padding: 10,
    flexGrow: 0,
    minWidth: 0,
    alignSelf: 'flex-end',
    backgroundColor: Theme.Colors.Dark.primary,
  },
  cardStart: {
    padding: 10,
    flexGrow: 0,
    minWidth: 0,
    alignSelf: 'flex-start',
    backgroundColor: Theme.Colors.Dark.background,
  },
  systemMessageCard: {
    backgroundColor: '#2a2a2a',
    flexGrow: 0,
    minWidth: 0,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 12,
  },
  systemMessageCardText: {
    color: '#ffffff',
    fontSize: 12,
  },
});

function Content({ message }) {
  const { width } = useWindowDimensions();
  const convertUrls = (text) => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  };

  const prefix = `<div style="color: ${
    message.isMine ? '#121212' : '#ffffff'
  }; background: transparent;">`;
  const postfix = '</div>';

  return (
    <Card style={message.isMine ? styles.cardEnd : styles.cardStart}>
      <RenderHtml
        contentWidth={width}
        source={{
          html: `${prefix}${convertUrls(
            striptags((message.content || '').replaceAll('\n', '<br />'), [
              'a',
              'strong',
              'b',
              'i',
              'em',
              'u',
              'br',
            ]),
          )}${postfix}`,
        }}
      />
    </Card>
  );
}

Content.propTypes = {
  message: PropTypes.object,
};

function Message({ message, next }) {
  const isNextFromDifferentAuthor = !next || message.uuid !== next.uuid;
  const isPreviousFarInTime =
    next && dayjs(next.date).subtract(4, 'minutes').isAfter(dayjs(message.date));

  return (
    <View style={{ ...styles.message, alignItems: message.isMine ? 'flex-end' : 'flex-start' }}>
      <Content message={message} />
      {(isNextFromDifferentAuthor || isPreviousFarInTime) && (
        <View style={styles.authorTime}>
          <Text style={styles.authorTimeText}>
            {!message.isMine && `${message.name} - `}
            {dayjs(message.date).format('MMM D, h:mm A')}
          </Text>
        </View>
      )}
    </View>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  next: PropTypes.object,
};

function MeetingChat() {
  const messages = useSelector((state) => state.chat.messages);
  const uuid = useSelector((state) => state.media.uuid);
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.root}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.message} textAlign="center">
            <Card style={styles.systemMessageCard}>
              <Text style={styles.systemMessageCardText}>ROOM JOINED</Text>
            </Card>
          </View>
          {messages.map((message, index) => {
            message.isMine = uuid === message.uuid;
            return (
              <View style={styles.messageWrapper} key={generateUUID()}>
                <Message
                  message={message}
                  next={index < messages.length - 1 ? messages[index + 1] : null}
                />
              </View>
            );
          })}
        </ScrollView>
        <MessageInput />
      </View>
    </KeyboardAvoidingView>
  );
}

export default MeetingChat;
