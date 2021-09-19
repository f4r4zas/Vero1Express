import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../util/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReadMore from 'react-native-read-more-text';

const CartCart = ({
  onProductRemove,
  onProductAdd,
  onProductDelete,
  product_name,
  product_price,
  product_counut,
  product_image,
}) => {
  const renderUri = itemImage => {
    if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
      return 'http:' + itemImage;
    } else {
      return itemImage;
    }
  };
  const _renderTruncatedFooter = () => {
    return;
  };
  return (
    <View style={{flex: 1}}>
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
            transform: [{rotate: '90deg'}],
          }}></View>
        <FontAwesome
          name="close"
          size={18}
          onPress={onProductDelete}
          style={{position: 'absolute', right: 10, marginTop: 5}}
        />
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignSelf: 'center',
          }}>
          <View style={{marginRight: 10}}>
            <Image
              resizeMode={'center'}
              source={{uri: renderUri(product_image)}}
              style={{width: 50, height: 60}}
            />
          </View>
          <View style={{width: '70%'}}>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={_renderTruncatedFooter}>
              <Text style={[styles.textStyle, {fontSize: 12}]}>
                {product_name}
              </Text>
            </ReadMore>

            {/* <Text style={[styles.textStyle, {fontSize: 16, width: '70%'}]}>
              {product_name}
            </Text> */}
            <Text
              style={[
                styles.textStyle,
                {fontSize: 14, marginTop: 2, color: colors.primaryOrange},
              ]}>
              ${product_price}
            </Text>
          </View>
        </View>
        <View style={{position: 'absolute', bottom: '5%', right: '10%'}}>
          <View
            style={{
              width: '20%',
              marginTop: '3%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <FontAwesome
                name="minus"
                color={colors.secondaryGray}
                size={18}
                onPress={onProductRemove}
              />
            </View>
            <View
              style={{
                height: 20,
                width: 30,
                alignItems: 'center',
                bottom: 3,
                marginLeft: 8,
                marginRight: 5,
              }}>
              <Text
                style={[
                  styles.textStyle,
                  {fontSize: 18, color: colors.secondaryGray},
                ]}>
                {product_counut}
              </Text>
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
                onPress={onProductAdd}
              />
            </View>
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

export default CartCart;
