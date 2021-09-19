import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './src/screens/splash/Splash';
import AuthNavigation from './src/AuthNavigation/AuthNavigation';
const Stack = createStackNavigator();
const App = ({}) => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false, animationTypeForReplace: 'pop'}}
          />
          <Stack.Screen
            name="AuthNavigation"
            component={AuthNavigation}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
