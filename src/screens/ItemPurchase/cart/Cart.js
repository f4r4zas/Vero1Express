import React, {useState, useEffect} from 'react';
import {View, TextInput, Text, StyleSheet, FlatList} from 'react-native';
// import {connect} from 'react-redux';
import FooterButton from '../../../common/FooterButton';
import {
  NativeBaseProvider,
  // Select,
  // Checkbox,
  ScrollView,
  // Spinner,
} from 'native-base';
import {colors} from '../../../util/colors';
import CartCart from '../../../common/CartCart';
import {textStyle} from 'styled-system';
// import {useSelector, useDispatch} from 'react-redux';
import AppService from '../../../services/AppService';
import Snackbar from 'react-native-snackbar';
// import Modal from '../../../common/Modal';
// import asyncStorage from '../../../services/asyncStorage';
import ModalPopUp from '../../../common/Modal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from '../../../common/Loader';

const Cart = props => {
  const [cartItems, setCartItems] = useState([]);
  let [totalPrice, setTotalPrice] = useState(0);
  // const [quantity, setQuantity] = useState([]);
  const [loading, setloading] = useState(true);
  // const {counter, cart} = useSelector(state => state.auth);
  // const [countProduct, setcountProduct] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalProperties, setModalProperties] = useState({});
  const [walletData, setWalletData] = useState();
  const [amountToAdd, setAmountToAdd] = useState();
  const [paymentAmount, setPaymentAmount] = useState();
  const [hasWallet, setHasWallet] = useState(true);
  // const dispatch = useDispatch();
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
      // let quantity = item.quantity - 1;
      console.log('updateItemToCart: ', item);
      let payload = {
        // items:[{product_id: item.product_id._id,
        // quantity: item.quantity,}]
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
      // let quantity = item.quantity - 1;
      // console.log('updateItemToCart: ', item);
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
    // console.log('id: ', item);
    try {
      await AppService.deleteItemFromCart(id).then(res => {
        // console.log('deleteProduct: ', res);
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
          Your Cart Is Empty!
        </Text>
      </View>
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
            setModalProperties(modalProperties);
            setShowModal(true);
          } else {
            let modalProperties = {
              title: tag,
              body: `Are your sure want to continue!`,
              button1: 'Continue',
              button2: 'Cancel',
            };
            setModalProperties(modalProperties);
            setShowModal(true);
          }
        } else {
          let modalProperties = {
            title: 'Create Wallet',
            body: `Please Create Wallet First!`,
            button1: 'Continue',
            button2: 'Cancel',
          };
          setHasWallet(false);
          setModalProperties(modalProperties);
          setShowModal(true);
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
        // debugger;
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
        // debugger;
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
  const modalHandling = () => {
    setShowModal(false);
  };
  const onContinue = () => {
    if (hasWallet === false) {
      setShowModal(false);
      let parameter = {
        isFromCart: true,
      };
      props.navigation.push('Wallet', parameter);
      // console.log('pop from wallet: ', x);
    } else {
      let arrItems = [];
      let storeName = cartItems.items[0].product_id.product_store;
      for (let i = 0; i < cartItems.items.length; i++) {
        arrItems.push({
          _id: cartItems.items[i].product_id._id,
          quantity: cartItems.items[i].quantity,
        });
      }
      setShowModal(false);
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
        // debugger;
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
          // position: 'absolute',
          // left: 0,
          // right: 0,
          // top: 0,
          // bottom: 0,
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

          <ModalPopUp
            showModal={showModal}
            modalHandling={modalHandling}
            modalProperties={modalProperties}
            onPositiveResponse={onContinue}
            // title={modalTitle}
            // body={modalBody}
            // button1={modalButton1}
            // button2={modalButton2}
          />
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