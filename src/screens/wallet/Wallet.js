import React, {Component} from 'react';
import WalletCard from '../../common/walletCard';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';
import {NativeBaseProvider, Separator, Body, Spinner} from 'native-base';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
// import Foundation from 'react-native-vector-icons/Foundation';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {
//   Collapse,
//   CollapseHeader,
//   CollapseBody,
// } from 'accordion-collapse-react-native';
// import FooterButton from '../../common/FooterButton';
import {colors} from '../../util/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PaymentMethod from './PaymentMethod';
import AppService from '../../services/AppService';
import Snackbar from 'react-native-snackbar';
import LoaderModal from '../../common/LoaderModal';
import {tSDeclareFunction} from '@babel/types';
import asyncStorage from '../../services/asyncStorage';
import FooterButton from '../../common/FooterButton';
import Loader from '../../common/Loader';
export class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      createWallet: false,
      loading: true,
      wallet: '',
      cards: [],
      default_card: '',
      deleteCard: false,
      modalState: false,
      modalText: '',
      modalRef: '',
      addAmount: false,
      user_api: '',
    };
  }

  async componentDidMount() {
    this.getCustomerWallet();
  }
  getCustomerWallet = async () => {
    // this.refs.modal1.open();
    let isLoading = {
      loading: true,
      // modalState: true,
    };
    this.setState(isLoading);
    // try {
    await AppService.getCustomerWallet().then(res => {
      console.log('getCustomerWallet: ', res);
      // debugger;
      if (res.data.status) {
        let newState = {
          loading: false,
          wallet: res.data.data.wallet,
          cards: res.data.data.cards,
          default_card: res.data.data.default_card,
          createWallet: res.data.data.wallet ? false : true,
          // createWallet: true,
        };
        this.setState(newState);
      } else {
        let newState = {
          loading: false,
        };
        this.setState(newState);
        // Snackbar.show({
        //   text: res.data.message,
        //   duration: Snackbar.LENGTH_LONG,
        // });
      }
    });
  };
  renderUri(itemImage) {
    if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
      return 'http:' + itemImage;
    } else {
      return itemImage;
    }
  }
  handleTab = activeTab => {
    let newState = {
      activeTab: activeTab,
    };
    this.setState(newState);
  };
  handleScreen = () => {
    let newState = {createWallet: false};
    this.setState(newState);
    this.getCustomerWallet();
  };
  deletePaymentMethod = async item => {
    console.log(item);
    let newState = {loading: true};
    this.setState(newState);
    let payload = {
      card_id: item.id,
    };
    await AppService.deleteCardFromWallet(payload).then(res => {
      console.log('deleteCardFromWallet: ', res);
      if (res.data.status) {
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
        let newState = {
          loading: false,
          deleteCard: false,
        };
        this.getCustomerWallet();
      } else {
        Snackbar.show({
          text: res.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
        let newState = {
          loading: false,
          deleteCard: false,
        };
        this.setState(newState);
      }
    });
  };
  checkAddAmount = () => {
    if (this.state.cards.length > 0) {
      let newState = {addAmount: true, createWallet: true};
      this.setState(newState);
    } else {
      Snackbar.show({
        text: 'No Payment Method Found!',
        duration: Snackbar.LENGTH_LONG,
      });
      let newState = {addAmount: false, createWallet: true};
      this.setState(newState);
    }
  };
  render() {
    console.log('this.state.dataWallet.cards: ', this.props);
    console.log('this.state.dataWallet.cards: ', this.state.createWallet);
    if (this.state.createWallet) {
      return (
        <>
          <PaymentMethod
            handleScreen={this.handleScreen}
            isFromWallet={true}
            addAmount={this.state.addAmount}
          />
        </>
      );
    } else {
      return (
        <NativeBaseProvider>
          <View style={{flex: 1, backgroundColor: colors.gray}}>
            <View style={{flexGrow: 1}}>
              <View style={styles.mainView}>
                <View style={styles.innerViews}>
                  <View>
                    <Text style={styles.textStyle}>Wallet</Text>
                  </View>
                  <View style={{marginRight: '2%'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={this.checkAddAmount}
                      disabled={this.state.loading}>
                      <Text
                        style={[
                          styles.textStyle,
                          {color: colors.primaryOrange, fontSize: 16},
                        ]}>
                        <FontAwesome
                          type="FontAwesome"
                          name="dollar"
                          size={15}
                          style={{
                            color: colors.primaryOrange,
                            fontWeight: 'bold',
                          }}
                        />{' '}
                        Add Amount
                      </Text>
                      {/* <Text style={styles.skipText}>Create</Text> */}
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.cardBalance}>
                  <Text style={styles.textBAlance1}>Total Balance</Text>
                  <Text style={styles.textBAlance2}>
                    ${this.state.wallet.amount ? this.state.wallet.amount : '0'}
                  </Text>
                </View>
                <View style={styles.textView}>
                  <TouchableOpacity onPress={() => this.handleTab(0)}>
                    <Text
                      style={
                        this.state.activeTab == 0
                          ? [
                              styles.textStyle,
                              {fontSize: 14, color: colors.primaryOrange},
                            ]
                          : [
                              styles.textStyle,
                              {fontSize: 14, color: colors.secondaryGray},
                            ]
                      }>
                      Transaction History
                    </Text>
                    <Entypo
                      name="dot-single"
                      // color={colors.primaryOrange}
                      // size={14}
                      style={
                        this.state.activeTab == 0
                          ? [
                              styles.textStyle,
                              {
                                // fontSize: 14,
                                color: colors.primaryOrange,
                                textAlign: 'center',
                              },
                            ]
                          : [
                              styles.textStyle,
                              {
                                // fontSize: 14,
                                color: colors.secondaryGray,
                                textAlign: 'center',
                              },
                            ]
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.handleTab(1)}>
                    <Text
                      style={
                        this.state.activeTab == 1
                          ? [
                              styles.textStyle,
                              {fontSize: 14, color: colors.primaryOrange},
                            ]
                          : [
                              styles.textStyle,
                              {fontSize: 14, color: colors.secondaryGray},
                            ]
                      }>
                      Payment Method
                    </Text>
                    <Entypo
                      name="dot-single"
                      // color={colors.primaryOrange}
                      // size={40}
                      style={
                        this.state.activeTab == 1
                          ? [
                              styles.textStyle,
                              {
                                // fontSize: 20,
                                color: colors.primaryOrange,
                                textAlign: 'center',
                              },
                            ]
                          : [
                              styles.textStyle,
                              {
                                // fontSize: 20,
                                color: colors.secondaryGray,
                                textAlign: 'center',
                              },
                            ]
                      }
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{height: '45%'}}>
                  {
                    this.state.activeTab == 0 ? (
                      <>
                        <View style={styles.walletCard}>
                          <View style={{height: 90}}>
                            <Image
                              resizeMode={'center'}
                              source={require('../../assets/cvs.png')}
                              // source={{
                              //   uri:
                              //     'http://157.230.183.30:3000/' +
                              //     item.store_logo,
                              // }}
                              style={{height: 100, width: 100}}
                            />
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-around',
                              }}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {fontSize: 14, width: '60%'},
                                ]}>
                                Electician fair
                              </Text>
                              <Text style={[styles.textStyle, {fontSize: 14}]}>
                                $120.25
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    fontSize: 10,
                                    color: colors.secondaryGray,
                                    width: '71%',
                                  },
                                ]}>
                                <Entypo
                                  name="location-pin"
                                  color={colors.primaryOrange}
                                  size={10}
                                />
                                10/10 Garden Road, Street 20
                              </Text>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {fontSize: 10, color: 'red'},
                                ]}>
                                -$20
                              </Text>
                            </View>
                            <View style={{marginTop: '5%'}}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {fontSize: 10, color: colors.secondaryGray},
                                ]}>
                                Dec 17, 08:57 PM
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.walletCard}>
                          <View style={{height: 90}}>
                            <Image
                              resizeMode={'center'}
                              source={require('../../assets/cvs.png')}
                              // source={{
                              //   uri:
                              //     'http://157.230.183.30:3000/' +
                              //     item.store_logo,
                              // }}
                              style={{height: 100, width: 100}}
                            />
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-around',
                              }}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {fontSize: 14, width: '60%'},
                                ]}>
                                Electician fair
                              </Text>
                              <Text style={[styles.textStyle, {fontSize: 14}]}>
                                $120.25
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    fontSize: 10,
                                    color: colors.secondaryGray,
                                    width: '71%',
                                  },
                                ]}>
                                <Entypo
                                  name="location-pin"
                                  color={colors.primaryOrange}
                                  size={10}
                                />
                                10/10 Garden Road, Street 20
                              </Text>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {fontSize: 10, color: 'red'},
                                ]}>
                                -$20
                              </Text>
                            </View>
                            <View style={{marginTop: '5%'}}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {fontSize: 10, color: colors.secondaryGray},
                                ]}>
                                Dec 17, 08:57 PM
                              </Text>
                            </View>
                          </View>
                        </View>
                      </>
                    ) : (
                      <View>
                        {this.state.cards.length > 0 ? (
                          this.state.cards.map((item, index) => {
                            return (
                              <>
                                <View style={styles.walletCard}>
                                  {this.state.deleteCard ? (
                                    <>
                                      <View
                                        style={{
                                          width: 0,
                                          height: 0,
                                          backgroundColor: 'transparent',
                                          borderStyle: 'solid',
                                          borderRightWidth: 50,
                                          borderTopWidth: 50,
                                          // borderTopLeftRadius: 20,
                                          borderRightColor: 'transparent',
                                          borderTopColor: 'red',
                                          position: 'absolute',
                                          right: 0,
                                          transform: [{rotate: '90deg'}],
                                        }}></View>
                                      <FontAwesome
                                        name="close"
                                        size={18}
                                        onPress={() =>
                                          this.deletePaymentMethod(item)
                                        }
                                        style={{
                                          position: 'absolute',
                                          right: 10,
                                          marginTop: 5,
                                        }}
                                      />
                                    </>
                                  ) : null}
                                  <View style={{height: 90}}>
                                    {/* <Image
                                        resizeMode={'center'}
                                        source={require('../../assets/cvs.png')}
                                        // source={{
                                        //   uri:
                                        //     'http://157.230.183.30:3000/' +
                                        //     item.store_logo,
                                        // }}
                                        style={{height: 100, width: 100}}
                                      /> */}
                                    {item.brand === '3782' ? (
                                      <Image
                                        source={require('../../assets/american-express.png')}
                                        style={{height: 100, width: 100}}
                                      />
                                    ) : item.brand === 'Visa' ? (
                                      <Image
                                        source={require('../../assets/visa-icon.jpg')}
                                        style={{
                                          height: 100,
                                          width: 100,
                                          borderTopLeftRadius: 30,
                                          borderBottomLeftRadius: 30,
                                        }}
                                      />
                                    ) : item.brand === '6011' ? (
                                      <Image
                                        source={require('../../assets/discover-icon.png')}
                                        style={{height: 100, width: 100}}
                                      />
                                    ) : item.brand === '5555' ? (
                                      <Image
                                        source={require('../../assets/masterCardNew.png')}
                                        style={{height: 100, width: 100}}
                                      />
                                    ) : (
                                      <View style={{marginTop: 10}}>
                                        <Octicons
                                          type="Octicons"
                                          name="credit-card"
                                          size={26}
                                          color="#022651"
                                        />
                                      </View>
                                    )}
                                  </View>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      marginLeft: '2%',
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <Text
                                        style={[
                                          styles.textStyle,
                                          {fontSize: 14, width: '71%'},
                                        ]}>
                                        **** **** **** {item.last4}
                                      </Text>
                                      <Text
                                        style={[
                                          styles.textStyle,
                                          {fontSize: 14},
                                        ]}>
                                        {item.country}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <Text
                                        style={[
                                          styles.textStyle,
                                          {
                                            fontSize: 10,
                                            color: colors.secondaryGray,
                                            width: '70%',
                                          },
                                        ]}>
                                        <Entypo
                                          name="location-pin"
                                          color={colors.primaryOrange}
                                          size={10}
                                        />
                                        {item.address_city}
                                      </Text>
                                      <Text
                                        style={[
                                          styles.textStyle,
                                          {fontSize: 10, color: 'red'},
                                        ]}>
                                        {item.address_zip}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        marginTop: '5%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        width: '15%',
                                      }}>
                                      <Text
                                        style={[
                                          styles.textStyle,
                                          {
                                            fontSize: 10,
                                            color: colors.secondaryGray,
                                          },
                                        ]}>
                                        {item.exp_month}
                                      </Text>
                                      <Text
                                        style={[
                                          styles.textStyle,
                                          {
                                            fontSize: 10,
                                            color: colors.secondaryGray,
                                          },
                                        ]}>
                                        {item.exp_year}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </>
                            );
                          })
                        ) : (
                          <View
                            style={{
                              marginTop: '30%',
                            }}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  fontSize: 16,
                                  color: colors.secondaryGray,
                                  textAlign: 'center',
                                },
                              ]}>
                              No Payment Method Found
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            marginTop: '10%',
                            // marginRight: '5%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                              this.setState({
                                createWallet: true,
                                addAmount: false,
                              })
                            }
                            disabled={this.state.loading}>
                            <Text style={[styles.textStyle, {fontSize: 16}]}>
                              <FontAwesome
                                type="FontAwesome"
                                name="plus-circle"
                                size={20}
                                style={{
                                  fontWeight: 'bold',
                                }}
                              />{' '}
                              Add Payment Method
                            </Text>
                            {/* <Text style={styles.skipText}>Create</Text> */}
                          </TouchableOpacity>
                          {this.state.cards.length == 0 ? null : (
                            <>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    marginLeft: '2%',
                                    marginRight: '2%',
                                    marginBottom: '5%',
                                  },
                                ]}>
                                /
                              </Text>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                  this.state.deleteCard
                                    ? this.setState({deleteCard: false})
                                    : this.setState({deleteCard: true})
                                }
                                disabled={this.state.loading}>
                                <Text
                                  style={[styles.textStyle, {fontSize: 16}]}>
                                  {/* <FontAwesome
                                  type="FontAwesome"
                                  name="edit"
                                  size={20}
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                /> */}
                                  {this.state.deleteCard
                                    ? 'Cancel'
                                    : 'Delete Card'}
                                </Text>
                                {/* <Text style={styles.skipText}>Create</Text> */}
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    )
                    // <PaymentMethod />
                  }
                </ScrollView>
              </View>
              <Loader loading={this.state.loading} />
            </View>
          </View>

          {this.props.route.params?.isFromCart ? (
            <View style={{position: 'absolute', right: 0, bottom: 0}}>
              <FooterButton
                title="Continue"
                onPress={() =>
                  this.props.navigation.navigate('Cart', {isWallet: true})
                }
                disabled={this.state.loading}
              />
            </View>
          ) : null}
        </NativeBaseProvider>
      );
    }
  }
}

export default Wallet;
const styles = StyleSheet.create({
  mainView: {
    // flex: 1,
    marginTop: '10%',
    marginLeft: '10%',
    backgroundColor: colors.gray,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  innerViews: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTab: {
    marginTop: '5%',
    marginLeft: '10%',
    fontSize: 15,
    color: colors.darkGrey,
    fontWeight: 'bold',
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '10%',
    marginBottom: '1%',
    marginLeft: '-10%',
    // width: '80%',
  },
  textHeading: {
    marginTop: '10%',
    marginLeft: '10%',
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
  cardBalance: {
    // marginTop: '5%',
    // marginLeft: '10%',
    // width: '90%',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryOrange,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 5,
    height: 120,
  },
  textBAlance1: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',

    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  textBAlance2: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',

    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  walletCard: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    marginLeft: '5%',
    // width: '90%',
    marginTop: '3%',
    marginBottom: '3%',
    backgroundColor: colors.gray,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 5,
    height: 100,
  },
});
