import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import UserInterface from './UserInterface';
import Utils from '../../utils';
import Theme from '../../theme';

function Row({ row }) {
  const orientation = Utils.useOrientation();
  return (
    <View style={{ flex: 1, flexDirection: orientation === 'PORTRAIT' ? 'row' : 'column' }}>
      {row.map((peer) => {
        return <UserInterface peer={peer} key={uuidv4()} small={true} />;
      })}
    </View>
  );
}

Row.propTypes = {
  row: PropTypes.any,
};

function Column({ children }) {
  const orientation = Utils.useOrientation();
  return (
    <View style={{ flex: 1, flexDirection: orientation === 'PORTRAIT' ? 'column' : 'row' }}>
      {children}
    </View>
  );
}

Column.propTypes = {
  children: PropTypes.any,
};

function UIMatrix() {
  const interfaces = useSelector((state) => state.media.interfaces);
  const hidden = useSelector((state) => state.media.settings.hidden);
  const pinned = useSelector((state) => state.media.settings.pinned);
  const more = useSelector((state) => state.media.settings.more);
  const orientation = Utils.useOrientation();

  const pinnedInterface = interfaces.find((e) => e.id === pinned);
  const filteredInterfaces = interfaces.filter((e) => e.id !== pinned && !hidden.set.has(e.id));

  const shownInterfaces =
    filteredInterfaces.length <= more.pinned.mobile
      ? filteredInterfaces
      : [
          ...[...filteredInterfaces].slice(0, more.pinned.mobile - 1),
          {
            id: uuidv4(),
            more: true,
            peers: filteredInterfaces.length - more.pinned.mobile + 1,
          },
        ];

  if (filteredInterfaces.length === 0 && hidden.set.has(pinned)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Theme.Variables.textPrimary, textAlign: 'center' }}>
          All peers hidden ({interfaces.length})
        </Text>
      </View>
    );
  }

  return (
    <Column>
      {shownInterfaces.length > 0 && <Row row={shownInterfaces} />}
      <View
        style={{
          width: orientation === 'PORTRAIT' ? '100%' : (shownInterfaces.length > 0 ? '80%' : '100%'),
          height: orientation === 'PORTRAIT' ? (shownInterfaces.length > 0 ? '80%' : '100%') : '100%',
        }}
      >
        <View style={{ flex: 1, flexDirection: orientation === 'PORTRAIT' ? 'row' : 'column' }}>
          {pinnedInterface && <UserInterface peer={pinnedInterface} key={uuidv4()} />}
        </View>
      </View>
    </Column>
  );
}

export default UIMatrix;
