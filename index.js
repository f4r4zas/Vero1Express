/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import AppContext from './appContext';
// import history from '@history';
import { Provider } from 'react-redux';
import { Store } from './src/reduxStore/Store';

const RNRedux = () => {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  // PushNotification.configure({
  //   // (optional) Called when Token is generated (iOS and Android)
  //   onRegister: function (token) {
  //     console.log('TOKEN:', token);
  //   },

  //   // (required) Called when a remote is received or opened, or local notification is opened
  //   onNotification: function (notification) {
  //     console.log('NOTIFICATION:', notification);

  //     // process the notification

  //     // (required) Called when a remote is received or opened, or local notification is opened
  //     notification.finish(
  //       PushNotification.localNotification({
  //         title: notification.title,
  //         message: notification.message,
  //       }),
  //     );
  //   },

  //   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  //   onAction: function (notification) {
  //     console.log('ACTION:', notification.action);
  //     console.log('NOTIFICATION:', notification);

  //     // process the action
  //   },

  //   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  //   onRegistrationError: function (err) {
  //     console.error(err.message, err);
  //   },

  //   // IOS ONLY (optional): default: all - Permissions to register.
  //   permissions: {
  //     alert: true,
  //     badge: true,
  //     sound: true,
  //   },

  //   // Should the initial notification be popped automatically
  //   // default: true
  //   popInitialNotification: true,

  //   /**
  //    * (optional) default: true
  //    * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //    * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //    * - if you are not using remote notification or do not have Firebase installed, use this:
  //    *     requestPermissions: Platform.OS === 'ios'
  //    */
  //   requestPermissions: Platform.OS === 'ios',
  // });
  return (
    // <AppContext.Provider value={{routes}}>
    <Provider store={Store}>
      <App />
    </Provider>
    // </AppContext.Provider>
  );
};

// AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
