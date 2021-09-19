import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../util/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const walletCard = props => {
  const renderUri = itemImage => {
    if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
      return 'http:' + itemImage;
    } else {
      return itemImage;
    }
  };
  let TouchableCmp = TouchableOpacity;
  return (
    <View style={{...styles.card, ...props.style}}>
      {props.children}
      {/* <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderRightWidth: 50,
          borderTopWidth: 50,
          borderTopLeftRadius: 20,
          borderRightColor: 'transparent',
          borderTopColor: 'red',
          position: 'absolute',
          right: 0,
          transform: [{rotate: '90deg'}],
        }}></View> */}
      {/* <FontAwesome
        name="close"
        size={18}
        onPress={() => setCounter(counter - 1)}
        style={{position: 'absolute', right: 10, marginTop: 5}}
      /> */}
      <View style={styles.touchable}>
        {/* <TouchableCmp onPress={props.onSelect} useForeground> */}
        <View style={{flexDirection: 'row'}}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={props.image} />
          </View>
          <View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price}</Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </View>
        {/* </TouchableCmp> */}
      </View>
      {/* <View
        style={{
          position: 'absolute',
          right: 10,
          top: 100,
          marginTop: '3%',
          // marginRight: '10%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <FontAwesome
            name="minus"
            color={colors.secondaryGray}
            size={18}
            onPress={() => setCounter(counter - 1)}
            // style={{marginRight: '10%'}}
          />
        </View>
        <View
          style={{
            height: 20,
            width: 20,
            alignItems: 'center',
            bottom: 3,
            marginLeft: 8,
            marginRight: 5,
          }}>
          <Text
            style={[
              styles.textStyle,
              {fontSize: 18, color: colors.secondaryGray},
            ]}></Text>
        </View>
        <View
          style={{
            height: 20,
            width: 20,
            alignItems: 'center',
            borderRadius: 20 / 2,
            backgroundColor: colors.gray,
          }}>
          <FontAwesome
            name="plus"
            color={colors.secondaryGray}
            size={18}
            onPress={() => setCounter(counter + 1)}></FontAwesome>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 5,
    backgroundColor: 'white',
    padding: 20,
  },
  imageContainer: {
    width: '25%',
    height: '80%',
    borderRadius: 10,

    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    // fontFamily:'open-sans-bold',
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  price: {
    //  fontFamily: 'open-sans',
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.primaryOrange,
  },
  description: {
    //  fontFamily: 'open-sans',
    fontSize: 14,
    color: 'black',
  },
  description1: {
    //  fontFamily: 'open-sans',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '23%',
    paddingHorizontal: 20,
  },
});

export default walletCard;
