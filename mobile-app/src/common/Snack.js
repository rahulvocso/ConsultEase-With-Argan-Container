import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

function Snack() {
  const dispatch = useDispatch();
  const snack = useSelector((state) => state.snack);

  const onDismissSnackBar = () => dispatch({ type: 'snack-out' });

  return (
    <Snackbar
      visible={snack.open}
      duration={5000}
      onDismiss={onDismissSnackBar}
      action={{
        onPress: onDismissSnackBar,
      }}
      icon={snack.icon}
    >
      {snack.content}
    </Snackbar>
  );
}

export default Snack;
