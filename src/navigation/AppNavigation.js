import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MyTabBar from '../common/BottomNavigation';
import Theme from '../util/colors';
import Home from '../screens/home/Home';
import Wallet from '../screens/wallet/Wallet';

import Store from '../screens/ItemPurchase/stores/Stores';
import ItemList from '../screens/ItemPurchase/itemLists/ItemList';
import ItemCart from '../screens/ItemPurchase/itemCart.js/ItemCart';

import ItemDetails from '../screens/ItemPurchase/itemDetails/ItemDetails';
import Cart from '../screens/ItemPurchase/cart/Cart';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../util/colors';
import {Alert, View} from 'react-native';
import asyncStorage from '../services/asyncStorage';
import UserDeliveryInfo from '../screens/ItemPurchase/userDeliveryInfo/UserDeliveryInfo';
import RequestDriver from '../screens/requestDriver/RequestDriver';
import ItemReturnsOrExchange from '../screens/ItemReturn&Exchange/ItemReturnsOrExchange';
import ItemReturnsOrExchangeCheckout from '../screens/ItemReturn&Exchange/ItemReturnsOrExchangeCheckout';
import PackagePickupAndDelivery from '../screens/PackagePickup&Delivery/PackagePickup&Delivery';
import PackagePickupAndDeliveryCheckout from '../screens/PackagePickup&Delivery/PackagePickup&DeliveryCheckout';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const AppNavigation = (props, {navigation}) => {
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
    const clearAsyncStorage = await asyncStorage.clear();
    if (clearAsyncStorage == undefined) {
      props.navigation.replace('AuthNavigation');
    }
  };

  const goToCart = () => {
    props.navigation.navigate('Cart');
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          headerShown: true,
          headerTitle: false,
          headerTransparent: true,
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
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
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
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
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
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
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
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
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
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
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
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
            <View style={{flexDirection: 'row'}}>
              <Zocial
                onPress={goToCart}
                name="cart"
                size={22}
                style={{color: colors.secondaryGray, marginRight: 10}}
              />
              <MaterialCommunityIcons
                name="logout"
                size={22}
                onPress={handleLogOut}
                style={{color: colors.secondaryGray}}
              />
            </View>
          ),
          headerRightContainerStyle: {
            marginRight: 20,
          },
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

        shadowOffset: {width: 0, height: 0},
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

          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="jobs"
        component={Home}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({color}) => (
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
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="wallet-outline"
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="notification"
        component={Home}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="more"
        component={Home}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({color}) => (
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
