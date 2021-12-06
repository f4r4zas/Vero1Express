import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';

export default class CommonCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };

    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground(
      (notification: Notification, completion) => {
        completion({ alert: false, sound: false, badge: false });
      },
    );

    Notifications.events().registerNotificationOpened(
      (notification: Notification, completion) => {
        completion();
      },
    );
  }

  async componentDidMount() {
    var notificationOpen = await messaging().getInitialNotification();
    this.checkPermission();

    this.messageListener = messaging().onMessage(notification => {
      console.log('(notification: ', notification);
    });

    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      notificationOpen => {
        console.log('notificationOpen: ', notificationOpen);
      },
    );

    this.messageSentListener = messaging().onMessageSent(message => {
      console.log('message sent to fcm: ', message);
    });

    this.onSendErrorListener = messaging().onSendError((messageid, error) => {
      console.log('an error occured when sending message: ', messageid, error);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!: ', remoteMessage);
    });
  }

  componentWillUnmount() {
    // this.notificationDisplayedListener();
    // this.notificationListener();
    // this.notificationOpenedListener();
    this.messageListener();
    this.notificationOpenedListener();
    this.messageSentListener();
    this.onSendErrorListener();
  }

  async checkPermission() {
    const enabled = await messaging().hasPermission();
    debugger;
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //   //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('getToken called from Check.js: ', fcmToken);
    debugger;
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    debugger;
    try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  render() {
    return (
      <View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});
