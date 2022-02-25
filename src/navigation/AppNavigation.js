import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyTabBar from '../common/BottomNavigation';
import Theme from '../util/colors';
import Home from '../screens/home/Home';
import Wallet from '../screens/wallet/Wallet';

import Store from '../screens/ItemPurchase/stores/Stores';
import ItemList from '../screens/ItemPurchase/itemLists/ItemList';
import ItemCart from '../screens/ItemPurchase/itemCart.js/ItemCart';

import ItemDetails from '../screens/ItemPurchase/itemDetails/ItemDetails';
import Cart from '../screens/ItemPurchase/cart/Cart';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../util/colors';
import { Alert, View } from 'react-native';
import asyncStorage from '../services/asyncStorage';
import UserDeliveryInfo from '../screens/ItemPurchase/userDeliveryInfo/UserDeliveryInfo';
import RequestDriver from '../screens/requestDriver/RequestDriver';
import ItemReturnsOrExchange from '../screens/ItemReturn&Exchange/ItemReturnsOrExchange';
import ItemReturnsOrExchangeCheckout from '../screens/ItemReturn&Exchange/ItemReturnsOrExchangeCheckout';
import PackagePickupAndDelivery from '../screens/PackagePickup&Delivery/PackagePickup&Delivery';
import PackagePickupAndDeliveryCheckout from '../screens/PackagePickup&Delivery/PackagePickup&DeliveryCheckout';
import DriverResponse from '../screens/requestDriver/DriverResponse';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
import Jobs from '../screens/jobs/Jobs';
import Notification from '../screens/notifications/Notifications';
import Map from '../screens/map/Map';
import ContactsList from '../screens/phoneContactList/Contacts';
import JobDetails from '../screens/jobs/JobDetails';
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const AppNavigation = (props, { navigation }) => {
  const [screen, setScreen] = useState('');
  const [rideStatus, setRideStatus] = useState('');
  useEffect(() => {
    getScreen();
    firebaseNotificationHandler();
    Notifications.registerRemoteNotifications();
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log(`Notification received in foreground: ${notification}`);
        completion({ alert: false, sound: false, badge: false });
      },
    );
    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log(`Notification opened: ${notification}`);
        completion();
      },
    );
    Notifications.events().registerNotificationReceivedBackground(
      (notification, completion) => {
        console.log('Notification Received - Background: ', notification);
        completion({ alert: true, sound: true, badge: false });
      },
    );
  }, [screen, rideStatus]);
  useEffect(() => {
    getScreen();
    firebaseNotificationHandler();
    Notifications.registerRemoteNotifications();
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log(`Notification received in foreground: ${notification}`);
        completion({ alert: false, sound: false, badge: false });
      },
    );
    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log(`Notification opened: ${notification}`);
        completion();
      },
    );
    Notifications.events().registerNotificationReceivedBackground(
      (notification, completion) => {
        console.log('Notification Received - Background: ', notification);
        completion({ alert: true, sound: true, badge: false });
      },
    );
  }, []);
  // componentWillUnmount() {
  //   // this.notificationDisplayedListener();
  //   // this.notificationListener();
  //   // this.notificationOpenedListener();
  //   this.messageListener();
  //   this.notificationOpenedListener();
  //   this.messageSentListener();
  //   this.onSendErrorListener();
  // }
  const getScreen = async () => {
    let x = '';
    await AsyncStorage.getItem('screen').then(res => {
      if (res) {
        x = res;
      }
    });
    console.log('Screen : ', x);
    setScreen(x);
  };
  const firebaseNotificationHandler = async () => {
    const fcmToken = await asyncStorage.getItem('fcmToken');
    const checkToken = await asyncStorage.getItem('token');
    const driverId = await asyncStorage.getItem('DriverID');
    const notificationOpen = await messaging().getInitialNotification();
    checkPermission();
    // debugger;

    // this.messageListener =
    await messaging().onMessage(notification => {
      debugger;
      if (notification.data.message == 'Driver has cancelled the ride') {
        asyncStorage.removeItem('DriverID');
        asyncStorage.removeItem('PurchaseID');
        asyncStorage.removeItem('RideStatus');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notification.data.message);
      } else if (notification.data.message == 'Driver has started ride') {
        asyncStorage.setItem('RideStatus', 'Driver has started ride');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notification.data.message);
      } else if (notification.data.message == 'Driver has ended ride') {
        asyncStorage.setItem('RideStatus', 'Driver has ended ride');
        asyncStorage.setItem('screen', 'RequestDriver');
        console.log('on notification', notification.data);
        setScreen('RequestDriver');
        setRideStatus(notification.data.message);
      } else if (notification.data.driver_status == 'ride-accepted') {
        asyncStorage.setItem('RideStatus', 'ride-accepted');
        asyncStorage.setItem('DriverName', notification.data.driver_name);
        asyncStorage.setItem('DriverID', notification.data.driver_id);
        asyncStorage.setItem('DriverLat', notification.data.driver_laongitude);
        asyncStorage.setItem('DriverLong', notification.data.driver_latitude);
        asyncStorage.setItem(
          'DriverNumber',
          notification.data.driver_mobile_number,
        );
        asyncStorage.setItem('DriverProfile', notification.data.driver_avatar);
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus('ride-accepted');
      }
      console.log('on notification', notification.data);
    });

    // this.notificationOpenedListener =
    await messaging().onNotificationOpenedApp(notificationOpen => {
      console.log('notificationOpen: ', notificationOpen);
      debugger;
      // if (notificationOpen !== null) {
      if (notificationOpen.data.message == 'Driver has cancelled the ride') {
        asyncStorage.removeItem('DriverID');
        asyncStorage.removeItem('PurchaseID');
        asyncStorage.removeItem('RideStatus');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notificationOpen.data.message);
      } else if (notificationOpen.data.message == 'Driver has started ride') {
        asyncStorage.setItem('RideStatus', 'Driver has started ride');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notificationOpen.data.message);
      } else if (notificationOpen.data.message == 'Driver has ended ride') {
        asyncStorage.setItem('RideStatus', 'Driver has ended ride');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notificationOpen.data.message);
      } else if (notificationOpen.data.driver_status == 'ride-accepted') {
        asyncStorage.setItem('DriverName', notificationOpen.data.driver_name);
        asyncStorage.setItem('DriverID', notificationOpen.data.driver_id);
        asyncStorage.setItem(
          'DriverLat',
          notificationOpen.data.driver_laongitude,
        );
        asyncStorage.setItem(
          'DriverLong',
          notificationOpen.data.driver_latitude,
        );
        asyncStorage.setItem(
          'DriverNumber',
          notificationOpen.data.driver_mobile_number,
        );
        asyncStorage.setItem(
          'DriverProfile',
          notificationOpen.data.driver_avatar,
        );
        asyncStorage.setItem('RideStatus', notificationOpen.data.driver_status);
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus('ride-accepted');
      }
      // } else {
      //   // debugger;
      //   if (checkToken) {
      //     setTimeout(function () {
      //       asyncStorage.setItem('screen', 'RequestDriver');

      //       // Actions.serviceLocation();
      //     }, 9000);
      //   } else {
      //     setTimeout(function () {
      //       asyncStorage.setItem('screen', 'RequestDriver');

      //       // Actions.phoneNumberScreen();
      //     }, 9000);
      //   }
      // }
    });

    // this.messageSentListener =
    await messaging().onMessageSent(message => {
      console.log('message sent to fcm: ', message);
      // debugger;
    });

    // this.onSendErrorListener =
    await messaging().onSendError((messageid, error) => {
      console.log('an error occured when sending message: ', messageid, error);
      // debugger;
    });

    // Register background handler
    await messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!: ', remoteMessage);
      // debugger;
    });
    // debugger;
    if (notificationOpen !== null) {
      // debugger;
      console.log('Last Noti: ', notificationOpen);
      if (notificationOpen.data.message == 'Driver has cancelled the ride') {
        asyncStorage.removeItem('DriverID');
        asyncStorage.removeItem('PurchaseID');
        asyncStorage.removeItem('RideStatus');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notificationOpen.data.message);
      } else if (notificationOpen.data.message == 'Driver has started ride') {
        asyncStorage.setItem('RideStatus', 'Driver has started ride');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notificationOpen.data.message);
      } else if (notificationOpen.data.message == 'Driver has ended ride') {
        asyncStorage.setItem('RideStatus', 'Driver has ended ride');
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus(notificationOpen.data.message);
      } else if (notificationOpen.data.driver_status == 'ride-accepted') {
        asyncStorage.setItem('DriverName', notificationOpen.data.driver_name);
        asyncStorage.setItem('DriverID', notificationOpen.data.driver_id);
        asyncStorage.setItem(
          'DriverLat',
          notificationOpen.data.driver_laongitude,
        );
        asyncStorage.setItem(
          'DriverLong',
          notificationOpen.data.driver_latitude,
        );
        asyncStorage.setItem(
          'DriverNumber',
          notificationOpen.data.driver_mobile_number,
        );
        asyncStorage.setItem(
          'DriverProfile',
          notificationOpen.data.driver_avatar,
        );
        asyncStorage.setItem('RideStatus', notificationOpen.data.driver_status);
        asyncStorage.setItem('screen', 'RequestDriver');
        setScreen('RequestDriver');
        setRideStatus('ride-accepted');
      }
    }
  };
  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    // debugger;
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  };
  const getToken = async () => {
    let fcmToken = await asyncStorage.getItem('fcmToken');
    console.log('getToken called from Check.js: ', fcmToken);
    // debugger;
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await asyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };
  const requestPermission = async () => {
    // debugger;
    try {
      await messaging().requestPermission();
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  };

  const handleLogOut = async () => {
    Alert.alert('', 'Are you sure you want to logout?', [
      {
        text: 'Yes',
        onPress: () => {
          removeData();
        },
        style: 'cancel',
      },
      {
        text: 'No',
        // onPress: () => ,
      },
    ]);
  };
  const removeData = async () => {
    await asyncStorage.removeItem('token');
    await asyncStorage.getItem('user_data').then(value => {
      messaging().unsubscribeFromTopic('ride-accepted-' + value._id);
      messaging().unsubscribeFromTopic('ride-started-' + value._id);
      messaging().unsubscribeFromTopic('ride-ended-' + value._id);
      messaging().unsubscribeFromTopic('ride-cancelled-' + value._id);
    });
    const clearAsyncStorage = await asyncStorage.clear();
    if (clearAsyncStorage == undefined) {
      setTimeout(() => {
        props.navigation.replace('AuthNavigation');
      }, 500);
    }
  };
  const goToCart = () => {
    props.navigation.navigate('Cart');
  };

  return (
    <Stack.Navigator initialRouteName={screen ? screen : ''}>
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
          headerLeft: false,
        }}
      />
      <Stack.Screen
        name="Store"
        component={Store}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="ItemCart"
        component={ItemCart}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="ItemList"
        component={ItemList}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetails}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{ color: colors.secondaryGray, marginRight: 10 }}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{ color: colors.secondaryGray }}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="Jobs"
        component={Jobs}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          // headerRight: () => (
          //   <View style={{ flexDirection: 'row' }}>
          //     <Zocial
          //       onPress={goToCart}
          //       name="cart"
          //       size={22}
          //       style={{ color: colors.secondaryGray, marginRight: 10 }}
          //     />
          //     <MaterialCommunityIcons
          //       name="logout"
          //       size={22}
          //       onPress={handleLogOut}
          //       style={{ color: colors.secondaryGray }}
          //     />
          //   </View>
          // ),
          // headerRightContainerStyle: {
          //   marginRight: 20,
          // },
        }}
      />
      <Stack.Screen
        name="UserDeliveryInfo"
        component={UserDeliveryInfo}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          // headerRight: () => (
          //   <View style={{flexDirection: 'row'}}>
          //     <Zocial
          //       onPress={goToCart}
          //       name="cart"
          //       size={22}
          //       style={{color: colors.secondaryGray, marginRight: 10}}
          //     />
          //     <MaterialCommunityIcons
          //       name="logout"
          //       size={22}
          //       onPress={handleLogOut}
          //       style={{color: colors.secondaryGray}}
          //     />
          //   </View>
          // ),
          // headerRightContainerStyle: {
          //   marginRight: 20,
          // },
        }}
      />
      <Stack.Screen
        name="ItemReturnsOrExchange"
        component={ItemReturnsOrExchange}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="ItemReturnsOrExchangeCheckout"
        component={ItemReturnsOrExchangeCheckout}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="PackagePickupAndDelivery"
        component={PackagePickupAndDelivery}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="PackagePickupAndDeliveryCheckout"
        component={PackagePickupAndDeliveryCheckout}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="RequestDriver"
        component={RequestDriver}
        options={{
          headerShown: false,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="DriverResponse"
        component={DriverResponse}
        options={{
          headerShown: false,
          headerTitle: false,
        }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="ContactsList"
        component={ContactsList}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetails}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        overflow: 'hidden',
        activeTintColor: 'white',
        inactiveTintColor: '#8b8b8b',
        showLabel: true,
        activeBackgroundColor: colors.primaryOrange,
        tabStyle: {
          borderRadius: 10,
          height: 50,
          width: 4,
          margin: 12,
        },

        shadowOffset: { width: 0, height: 0 },
        style: {
          position: 'absolute',
          bottom: 0,
          elevation: 0,
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={Jobs}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="wallet-outline"
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notification}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="more"
        component={Home}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="dots-vertical"
              color={color}
              size={35}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;
