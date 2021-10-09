import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../util/colors';

const InputField = ({
  value,
  placeholder,
  placeholderTextColor,
  returnKeyType,
  onChangeText,
  style,
  error,
  isValid,
  initialIcon,
  inputIconShow,
  inputIcon,
  label,
  onFocus,
  name,
  multiline,
  numberOfLines,
}) => {
  return (
    <View style={styles.personalInfo}>
      {label ? (
        <Text style={[styles.textStyle, {fontSize: 16}]}>{label}</Text>
      ) : null}
      <View style={[styles.borderStyle, styles.view1]}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          returnKeyType={returnKeyType}
          name={name}
          multiline={multiline}
          numberOfLines={numberOfLines}
          // error={error}
          onChangeText={onChangeText}
          onFocus={onFocus}
          style={
            style
              ? [style, {width: '90%'}]
              : [
                  styles.textStyle2,
                  {
                    height: multiline == true && value ? 80 : 30,
                    alignItems: 'center',
                    padding: 0,
                    width: '90%',
                  },
                ]
          }
        />
        {error ? (
          <Entypo
            type="Entypo"
            name={error == isValid ? 'check' : 'cross'}
            style={{fontSize: 15}}
            color={error == true ? '#006400' : '#FF0000'}
          />
        ) : null}
        {initialIcon == false ? null : inputIconShow ? (
          <Text style={{marginRight: '5%'}}>{inputIcon}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  textStyle2: {
    fontSize: 15,
    color: colors.secondaryGray,
  },
  borderStyle: {
    borderBottomWidth: 2,
    borderColor: colors.inputUnderLine,
    paddingBottom: 2,
  },
  personalInfo: {
    marginTop: '8%',
  },
  view1: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default InputField;
