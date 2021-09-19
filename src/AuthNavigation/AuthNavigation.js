import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/login/Login';
import CodeVerification from '../screens/login/CodeVerification';
import PaymentMethod from '../screens/wallet/PaymentMethod';
import PersonalInfo from '../screens/login/PersonalInfo';
import AppNavigation from '../navigation/AppNavigation';

const Stack = createStackNavigator();

const AuthNavigation = (props, {navigation}) => {
  return (
    <Stack.Navigator initialRouteName={props.route.params}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false, animationTypeForReplace: 'pop'}}
      />
      <Stack.Screen
        name="CodeVerification"
        component={CodeVerification}
        options={{headerShown: false, animationTypeForReplace: 'pop'}}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{headerShown: false, animationTypeForReplace: 'pop'}}
      />
      {/* <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{headerShown: false, animationTypeForReplace: 'pop'}}
      /> */}
      <Stack.Screen
        name="AppNavigation"
        component={AppNavigation}
        options={{headerShown: false, animationTypeForReplace: 'pop'}}
      />
    </Stack.Navigator>
  );
};
export default AuthNavigation;
