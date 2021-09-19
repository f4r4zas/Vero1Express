import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import {
  Container,
  NativeBaseProvider,
  Content,
  Footer,
  FooterTab,
  Input,
  Spinner,
} from 'native-base';

import {useSelector, useDispatch} from 'react-redux';
import FooterButton from '../../../common/FooterButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  addToCart,
  removeFromCart,
} from '../../../reduxStore/actions/AuthActions';
// import * as cartActions from '../../store/actions/cart';
import {colors} from '../../../util/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppService from '../../../services/AppService';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../common/Loader';

const renderUri = itemImage => {
  if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
    return 'http:' + itemImage;
  } else {
    return itemImage;
  }
};
const ItemDetails = props => {
  const [countProduct, setcountProduct] = useState(1);
  const [loading, setloading] = useState(false);
  const [item, setItem] = useState(props.route.params.item);
  const [product_description, setproduct_description] = useState('');
  const [storeData, setStoreData] = useState(props.route.params.storeData);

  const pressHandler = async () => {
    setloading(true);
    if (countProduct > 0) {
      let payload = {
        items: [{product_id: item._id, quantity: countProduct}],
        store_name: storeData.store_name,
      };
      await AppService.addItemToCart(payload).then(res => {
        if (res.data.status) {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setloading(false);
          props.navigation.navigate('Cart');
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setloading(false);
        }
      });
    } else {
      Snackbar.show({
        text: 'Please enter quantity',
        duration: Snackbar.LENGTH_LONG,
      });
      setloading(false);
    }
  };
  useEffect(() => {
    if (item.product_description != '' || item.product_description != null) {
      let htmlString = item.product_description;
      let plainString = htmlString.replace(/<[^>]+>/g, '');
      setproduct_description(plainString);
    } else {
      setproduct_description('');
    }
  }, []);
  return (
    <NativeBaseProvider>
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <View style={{flex: 1}}>
          <View style={styles.mainView}>
            <View>
              <Image
                resizeMode={'center'}
                source={{
                  uri: 'http://157.230.183.30:3000/' + storeData.store_logo,
                }}
                style={{
                  width: 35,
                  height: 20,
                }}
              />
            </View>
            <View>
              <View style={{marginBottom: '7%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.textStyle,
                      {fontSize: 12, color: colors.secondaryGray},
                    ]}>
                    Baby & Child <AntDesign type="AntDesign" name="right" />{' '}
                  </Text>
                  <Text
                    style={[
                      styles.textStyle,
                      {fontSize: 12, color: colors.primaryOrange},
                    ]}>
                    Baby & Skincare
                  </Text>
                </View>
              </View>
              <Image
                style={{height: 200, width: '100%'}}
                resizeMode="center"
                source={{
                  uri: renderUri(item.product_image),
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: '7%',
                  marginBottom: '3%',
                }}>
                <Text style={[styles.textStyle, {fontSize: 16, width: '90%'}]}>
                  {item.product_name}
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {fontSize: 15, color: colors.primaryOrange},
                  ]}>
                  ${item.product_price}
                </Text>
              </View>
              <View style={{height: '30%'}}>
                <ScrollView>
                  <Text style={styles.description}>
                    {product_description ? product_description : ''}
                  </Text>
                </ScrollView>
              </View>
              <View
                style={{
                  marginBottom: '25%',
                  marginTop: '7%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.compare}>Compare</Text>
                <View
                  style={{
                    marginTop: '3%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <FontAwesome
                      name="minus"
                      color={colors.secondaryGray}
                      size={18}
                      onPress={() => {
                        let count = countProduct - 1;
                        if (count >= 0) {
                          setcountProduct(count);
                        }
                      }}
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
                      {countProduct ? countProduct : 0}
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
                      onPress={() => {
                        setcountProduct(countProduct + 1);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Loader loading={loading} />
        </View>

        <FooterButton
          title="Add To Cart"
          onPress={pressHandler}
          disabled={loading}
          style={{width: '50%'}}
        />
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginTop: '10%',
    margin: '10%',
    backgroundColor: colors.white,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  description: {
    fontSize: 12,
    color: colors.secondaryGray,
  },
  compare: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primaryOrange,
  },
});

export default ItemDetails;
