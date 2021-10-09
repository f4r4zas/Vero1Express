import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import FooterButton from '../../../common/FooterButton';
import {NativeBaseProvider, ScrollView} from 'native-base';
import {colors} from '../../../util/colors';
import CartCart from '../../../common/CartCart';
import {textStyle} from 'styled-system';
import AppService from '../../../services/AppService';
import Snackbar from 'react-native-snackbar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from '../../../common/Loader';

const Cart = props => {
  const [cartItems, setCartItems] = useState([]);
  let [totalPrice, setTotalPrice] = useState(0);
  const [loading, setloading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalProperties, setModalProperties] = useState({});
  const [walletData, setWalletData] = useState();
  const [amountToAdd, setAmountToAdd] = useState();
  const [paymentAmount, setPaymentAmount] = useState();
  const [hasWallet, setHasWallet] = useState(true);
  useEffect(async () => {
    if (props.route?.params?.isWallet) {
      setHasWallet(true);
    }
    getItemsFromCart();
  }, []);
  const getItemsFromCart = async () => {
    setloading(true);
    await AppService.getItemsFromCart().then(res => {
      // console.log('getItemsFromCart: ', res);
      if (res.data.status) {
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
        setCartItems(res.data.data);
        setTimeout(() => {
          totalCalculation(res.data.data);
          setloading(false);
        }, 1000);
      } else {
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
        setloading(false);
      }
    });
  };

  const addProduct = async item => {
    setloading(true);
    if (item.quantity > 0) {
      let payload = {
        items: [{product_id: item.product_id._id, quantity: 1}],
      };
      await AppService.updateItemToCart(payload).then(res => {
        // console.log('item updated to cart: ', res);
        if (res.data.status) {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          getItemsFromCart();
          setTimeout(() => {
            setloading(false);
          }, 1000);
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setloading(false);
          console.log('error: ', error.res.data);
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

  const removeProduct = async item => {
    setloading(true);
    if (item.quantity > 0) {
      let payload = {
        items: [{product_id: item.product_id._id, quantity: -1}],
      };
      await AppService.updateItemToCart(payload).then(res => {
        // console.log('item updated to cart: ', res);
        if (res.data.status) {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          getItemsFromCart();
          setTimeout(() => {
            setloading(false);
          }, 1000);
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setloading(false);
          console.log('error: ', error.res.data);
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

  const deleteProduct = async item => {
    setloading(true);
    let id = {id: item._id};
    try {
      await AppService.deleteItemFromCart(id).then(res => {
        console.log('deleteProduct: ', res);
        if (res.data.status) {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          getItemsFromCart();
          setTimeout(() => {
            setloading(false);
          }, 1000);
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setloading(false);
        }
      });
    } catch (error) {
      setloading(false);
      console.log(error.response);
    }
  };

  const totalCalculation = data => {
    let y = 0;
    for (let i = 0; i < data.items.length; i++) {
      let x = data.items[i].product_id.product_price * data.items[i].quantity;
      y = y + x;
      let parsing = parseFloat(y).toFixed(2);
      setTotalPrice(parsing);
    }
  };
  const EmptyListMessage = () => {
    return (
      <>
        {loading ? null : (
          <View
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: '50%',
            }}>
            <Text
              style={[
                styles.textStyle,
                {textAlign: 'center', color: colors.secondaryGray},
              ]}>
              No Data Found!
            </Text>
          </View>
        )}
      </>
    );
  };

  const pressHandler = async tag => {
    setloading(true);
    await AppService.getCustomerWallet().then(res => {
      if (res.data.status) {
        setWalletData(res.data.data);
        if (res.data.data?.wallet) {
          let paymentCal = res.data.data.wallet.amount - totalPrice;
          setPaymentAmount(paymentCal);
          if (paymentCal < 0) {
            let paymentSplit = paymentCal.toString().split('-');
            let paymentConvert = parseFloat(paymentSplit[1]).toFixed(2);
            setAmountToAdd(paymentConvert);
            let modalProperties = {
              title: tag,
              body: `Your Card Will be charged $${paymentConvert}! Are your sure want to continue.`,
              button1: 'Continue',
              button2: 'Cancel',
            };
            confirmationAlert(modalProperties);
          } else {
            let modalProperties = {
              title: tag,
              body: `Are your sure want to continue!`,
              button1: 'Continue',
              button2: 'Cancel',
            };
            confirmationAlert(modalProperties);
          }
        } else {
          let modalProperties = {
            title: 'Create Wallet',
            body: `Please Create Wallet First!`,
            button1: 'Continue',
            button2: 'Cancel',
          };
          setHasWallet(false);
          confirmationAlert(modalProperties);
        }
        setloading(false);
      } else {
        setloading(false);
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    });
  };
  const confirmationAlert = async item => {
    Alert.alert(item.tag, item.body, [
      {
        text: item.button1,
        onPress: () => onContinue(),
        style: item.button2,
      },
      {
        text: 'No',
        onPress: () => {
          setloading(false);
        },
      },
    ]);
  };
  const addAmount = async (arrItems, storeName) => {
    setloading(true);
    let payload = {
      total_amount: amountToAdd,
    };
    await AppService.addAmount(payload).then(res => {
      console.log('addAmountToWallet: ', res);
      if (res.data.status) {
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
          amountToAdd: '',
        });
        setloading(false);
        let payload = {
          service_type: 'item_purchase',
          payment_type: '1',
          item_purchases: {
            store: storeName,
            items: arrItems,
          },
        };
        console.log('payload: ', payload);
        props.navigation.navigate('UserDeliveryInfo', payload);
      } else {
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
        setloading(false);
      }
    });
  };
  const onContinue = () => {
    if (hasWallet === false) {
      let parameter = {
        isFromCart: true,
      };
      props.navigation.push('Wallet', parameter);
    } else {
      let arrItems = [];
      let storeName = cartItems.items[0].product_id.product_store;
      for (let i = 0; i < cartItems.items.length; i++) {
        arrItems.push({
          _id: cartItems.items[i].product_id._id,
          quantity: cartItems.items[i].quantity,
        });
      }
      if (paymentAmount < 0) {
        addAmount(arrItems, storeName);
      } else {
        let payload = {
          service_type: 'item_purchase',
          payment_type: '1',
          item_purchases: {
            store: storeName,
            items: arrItems,
          },
        };
        console.log('payload: ', payload);
        props.navigation.navigate('UserDeliveryInfo', payload);
      }
    }
  };
  return (
    <NativeBaseProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.gray,
        }}>
        <View style={{flexGrow: 1}}>
          <View style={styles.mainView}>
            <View style={styles.innerViews}>
              <View>
                <Text style={styles.textStyle}>Cart</Text>
              </View>
            </View>
            <ScrollView style={{maxHeight: '83%'}}>
              <View>
                <FlatList
                  data={cartItems.items}
                  keyExtractor={(item, index) => index + ''}
                  ListEmptyComponent={EmptyListMessage}
                  renderItem={({item, index}) => {
                    return (
                      <View>
                        <CartCart
                          onProductAdd={() => addProduct(item)}
                          onProductDelete={() => deleteProduct(item)}
                          onProductRemove={() => removeProduct(item)}
                          product_name={item.product_id.product_name}
                          product_price={item.product_id.product_price}
                          product_counut={item.quantity}
                          product_image={item.product_id.product_image}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
        <Loader loading={loading} />
        <View style={{position: 'absolute', bottom: 0, right: 0, left: 0}}>
          {cartItems.items != '' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '2%',
                marginRight: '2%',
              }}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    fontSize: 14,
                    color: colors.darkGrey,
                    marginTop: 5,
                  },
                ]}>
                Est:{'  '}
              </Text>
              <Text style={styles.textStyle}>${totalPrice} </Text>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => pressHandler('Precharge Wallet')}
              style={{marginLeft: '20%', marginTop: '10%'}}>
              <Text
                style={[
                  textStyle,
                  {color: 'red', textDecorationLine: 'underline'},
                ]}>
                Precharge Wallet
              </Text>
            </TouchableOpacity>
            <View style={{width: '80%'}}>
              <FooterButton
                title="Proceed To Checkout"
                onPress={() => pressHandler('Proceed To Checkout')}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
};
export default Cart;
const styles = StyleSheet.create({
  mainView: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '12%',
    backgroundColor: colors.gray,
  },
  innerViews: {
    marginBottom: '10%',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.primaryOrange,
  },
});
