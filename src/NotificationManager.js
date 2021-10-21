import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default class NotificationManager {
  static configure = (
    onRegister,
    onNotification,
    onOpenNotification,
    senderID,
  ) => {
    PushNotification.configure({
      onRegister: function (token) {
        onRegister(token.token);
        console.log('NotificationManager onRegister:', token.token);
      },
      onNotification: function (notification) {
        console.log('NotificationManager:', notification);
        debugger;
        if (Platform.OS === 'ios') {
          if (notification.data.openedInForeground) {
            notification.userInteraction = true;
          }
        }
        if (notification.userInteraction) {
          onOpenNotification(notification);
        } else {
          onNotification(notification);
        }
        if (Platform.OS === 'android') {
          notification.userInteraction = true;
        }
        if (Platform.OS === 'ios') {
          if (!notification.data.openedInForeground) {
            notification.finish('BackgroundFetchResultNoData');
          }
        } else {
          notification.finish('BackgroundFetchResultNoData');
        }
        senderID: senderID;
        // notification.finish(
        //   PushNotification.localNotification({
        //     title: notification.title,
        //     message: notification.message,
        //   }),
        // );
      },
    });
  };

  static _buildAndroidNotification = (
    id,
    title,
    message,
    data = {},
    options = {},
  ) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_launcher',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || false,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };
  //   static _buildIOSNotification = (
  //     id,
  //     title,
  //     message,
  //     data = {},
  //     options = {},
  //   ) => {
  //     return {
  //       alertAction: options.alertAction || 'view',
  //       category: options.category || '',
  //       userInfo: {
  //         id: id,
  //         item: data,
  //       },
  //     };
  //   };
  static showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...this._buildAndroidNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      //   userInteraction: false,
    });
  };

  static cancelAllLocalNotification = () => {
    if (Platform.OS === 'ios') {
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  static unregister = () => {
    PushNotification.unregister;
  };
}
