/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Footer, FooterTab, Spinner} from 'native-base';
import {colors} from '../util/colors';

const FooterButton = ({title, onPress, disabled, style}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{...styles.touchableOpacityStyle, ...style}}
      onPress={onPress}
      disabled={disabled}>
      {disabled ? (
        <Spinner size={30} color={colors.white} />
      ) : (
        <>
          <Text style={styles.footerTextStyle}>{title}</Text>
          <AntDesign type="AntDesign" name="right" style={{color: '#fff'}} />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    justifyContent: 'flex-end',
    paddingRight: 40,
    alignItems: 'center',
    width: '85%',
    height: 50,
    borderTopLeftRadius: 60,
    flexDirection: 'row',
    backgroundColor: '#ff8800',
    alignSelf: 'flex-end',
  },
  footerTextStyle: {
    color: '#fff',
    marginRight: 6,
  },
});

export default FooterButton;
