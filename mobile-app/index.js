import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import App from './App';
import store from './src/store';
import { name as appName } from './app.json';
import Theme from './src/theme';

import { useRef } from 'react';

notifee.registerForegroundService(() => {
  return new Promise(() => {});
});

function Main() {
  const navigationRef = useRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <PaperProvider theme={Theme.Base}>
        <Provider store={store}>
          <App indexJsNavigationRef={navigationRef} />
        </Provider>
      </PaperProvider>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => Main);
