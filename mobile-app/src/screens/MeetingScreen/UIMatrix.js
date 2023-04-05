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
      {row.map((peer, index) => {
        return <UserInterface peer={peer} key={uuidv4()} row={row.length} index={index} />;
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
  const more = useSelector((state) => state.media.settings.more);

  const filteredInterfaces = interfaces.filter((e) => !hidden.set.has(e.id));

  const shownInterfaces =
    filteredInterfaces.length <= more.matrix
      ? filteredInterfaces
      : [
          ...[...filteredInterfaces].slice(0, more.matrix - 1),
          {
            id: uuidv4(),
            more: true,
            peers: filteredInterfaces.length - more.matrix + 1,
          },
        ];

  if (filteredInterfaces.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Theme.Variables.textPrimary, textAlign: 'center' }}>
          All peers hidden ({interfaces.length})
        </Text>
      </View>
    );
  }

  const radix = Math.floor(Math.sqrt(shownInterfaces.length || 1));
  const columns = Math.ceil(shownInterfaces.length / radix);
  const remainder = shownInterfaces.length % radix;

  const matrix = [];

  for (let i = 0; i < columns; i++) {
    matrix[i] = [];
    for (let j = 0; j < radix; j++) {
      if (i === columns - 1 && j === radix - remainder - 1) {
        matrix[i][j] = { ...shownInterfaces[i * radix + j], span: remainder + 1 };
      } else if (i === columns - 1 && j > radix - remainder - 1) {
        // do nothing
      } else {
        matrix[i][j] = shownInterfaces[i * radix + j];
      }
    }
  }

  return (
    <Column>
      {matrix.map((row) => {
        return <Row row={row} key={uuidv4()} />;
      })}
    </Column>
  );
}

export default UIMatrix;
