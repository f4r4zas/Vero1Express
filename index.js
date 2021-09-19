/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import AppContext from './appContext';
// import history from '@history';
import {Provider} from 'react-redux';
import {Store} from './src/reduxStore/Store';
// const MyHeadlessTask = async () => {
//   console.log('Receiving LMIS!');
//   setTimeout(() => {
//     // store.dispatch(setHeartBeat(false));
//   }, 3000);
// };

const RNRedux = () => (
  // <AppContext.Provider value={{routes}}>
  <Provider store={Store}>
    <App />
  </Provider>
  // </AppContext.Provider>
);

// AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
