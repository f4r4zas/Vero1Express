import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../util/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SelectField = ({
  value,
  placeholder,
  placeholderTextColor,
  returnKeyType,
  onChangeText,
  style,
  error,
  //   isValid,
  //   initialIcon,
  //   inputIconShow,
  //   inputIcon,
  label,
  //   onFocus,
  name,
  multiline,
  numberOfLines,
  dropDownData,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  console.log('dropdowndata: ', dropDownData);
  const toggleShowDropDown = val => {
    setIsEditable(false);
    let value = !val;
    setShowDropDown(value);
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: 'auto',
          backgroundColor: colors.primaryOrange,
        }}
      />
    );
  };
  const handleSelectValue = item => {
    setIsEditable(true);
    setShowDropDown(false);
    onChangeText(item);
  };
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
          onFocus={() => {
            toggleShowDropDown(showDropDown);
          }}
          editable={isEditable}
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
        <AntDesign
          type="AntDesign"
          name="caretdown"
          style={{fontSize: 12, marginRight: '5%'}}
          color="#000"
          onPress={() => {
            toggleShowDropDown(showDropDown);
          }}
        />
        {/* <Text style={{marginRight: '5%'}}>{inputIcon}</Text> */}
      </View>
      {showDropDown ? (
        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            padding: '5%',
            elevation: 5,
            // position: 'absolute',
            // top: hp('8%'),
          }}>
          <FlatList
            data={dropDownData}
            keyExtractor={(item, index) => index + ''}
            //   ListEmptyComponent={EmptyListMessage}
            ItemSeparatorComponent={renderSeparator}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    // marginBottom: '1%',
                    marginTop: '3%',
                    height: hp('5%'),
                  }}>
                  <TouchableOpacity onPress={() => handleSelectValue(item)}>
                    <Text style={[styles.textStyle, {fontSize: 14}]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      ) : null}
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

export default SelectField;
