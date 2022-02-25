import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../util/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ParcelProductCard = ({
  cancelParcel,
  packageType,
  size,
  itemWeight,
  product_image,
  fragile,
}) => {
  const renderUri = itemImage => {
    if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
      return 'http:' + itemImage;
    } else {
      return itemImage;
    }
  };
  console.log(itemWeight);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.modalStyle} activeOpacity={0.8}>
        <View
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
            transform: [{ rotate: '90deg' }],
          }}></View>
        <FontAwesome
          name="close"
          size={18}
          onPress={cancelParcel}
          style={{ position: 'absolute', right: 10, marginTop: 5 }}
        />
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignSelf: 'center',
          }}>
          <View style={{ marginRight: 10 }}>
            <Image
              resizeMode={'center'}
              source={{ uri: product_image }}
              style={{ width: 50, height: 60 }}
            />
          </View>
          <View style={{ width: '70%', marginTop: 10 }}>
            <Text style={[styles.textStyle, { fontSize: 15 }]}>
              {packageType + ' ' + size + ' Size'}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { fontSize: 13, marginTop: 3, color: colors.primaryOrange },
              ]}>
              {itemWeight} {' Ibs '} {fragile ? fragile : ''}
            </Text>
          </View>
        </View>
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
  modalStyle: {
    height: 100,
    marginBottom: '5%',
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 5,
    padding: '5%',
  },
  modalStyleOnPress: {
    marginBottom: '5%',
    width: '100%',
    // justifyContent: 'space-between',
    backgroundColor: colors.gray,
    borderRadius: 15,
    alignSelf: 'center',
    borderColor: colors.primaryOrange,
    borderWidth: 3,
    borderRadius: 40,
    elevation: 5,
    padding: '12%',
  },
  modalInnerView: {
    // alignSelf: 'left',
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.darkGrey,
  },
});

export default ParcelProductCard;
