import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/home'
import Login from '../Screens/Login'
import { createStackNavigator } from '@react-navigation/stack';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


  
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={Login} />
    </Tab.Navigator>
  );
}
export default BottomTabNavigator;