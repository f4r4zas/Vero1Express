import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import asyncStorage from '../../services/asyncStorage';
import { useDispatch } from 'react-redux';
import { userData } from '../../reduxStore/actions/AuthActions';

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    gettingDataFromAsync();
  }, []);
  const gettingDataFromAsync = async () => {
    await asyncStorage.getItem('user_data').then(res => {
      if (res != null) {
        dispatch(userData(res));
        setTimeout(() => {
          setAnimating(false);
          navigation.replace('AuthNavigation', 'AppNavigation');
        }, 2000);
      } else {
        setTimeout(() => {
          setAnimating(false);
          navigation.replace('AuthNavigation', 'Login');
        }, 2000);
      }
    });
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/vero-logo.png')}
        style={{ width: '100%', resizeMode: 'contain' }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
