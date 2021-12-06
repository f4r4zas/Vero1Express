/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeBaseProvider, Separator, Body, Spinner } from 'native-base';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
// import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import FooterButton from '../../common/FooterButton';
import { colors } from '../../util/colors';
// import FooterButton from '../../common/FooterButton';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-community/async-storage';
import AppService from '../../services/AppService';
import Snackbar from 'react-native-snackbar';
import Loader from '../../common/Loader';

export default class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstItem: false,
      secondItem: false,
      isEditing: false,
      errorText: '',
      creditCard: '',
      expMonth: '',
      expYear: '',
      CVV: '',
      Token: '',
      loading: false,
      logoCheck: '',
      cardAvailable: false,
      lastFour: '',
      amountToAdd: '',
    };
  }

  async componentDidMount() {
    let newState = {
      loading: true,
    };
    this.setState(newState);
    this.getWallet();
    // this.backhandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   // this.signInHandler,
    // );
  }

  getWallet = async () => {
    try {
      await AppService.getCustomerWallet()
        .then(res => {
          console.log('getCustomerWallet: ', res);
          if (res.data.status) {
            let newState = {
              loading: false,
              cardAvailable: true,
              // lastFour: response.data.data.cards[0].last4,
              // expMonth: response.data.data.cards[0].exp_month,
              // expYear: response.data.data.cards[0].exp_year,
            };
            this.setState(newState);
            // this.props.handleScreen();
          } else {
            let newState = {
              loading: false,
            };
            this.setState(newState);
          }
        })
        .catch(error => {
          console.log('error: ', error);
          console.log('error.response: ', error.response);
          this.setState({ loading: false });
          Snackbar.show({
            text: error.response.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
        });
    } catch (error) {
      let res = error?.response?.data?.message;
      if (res) {
        Snackbar.show({
          text: res,
          duration: Snackbar.LENGTH_LONG,
        });
        let newState = {
          // createWallet: true,
          loading: false,
        };
        this.setState(newState);
      } else {
        let newState = {
          loading: false,
        };
        this.setState(newState);
      }

      console.log(error.response);
    }
  };

  changeIcon1 = () => {
    this.setState({
      firstItem: !this.state.firstItem,
    });
  };
  changeIcon2 = () => {
    this.setState({
      secondItem: !this.state.secondItem,
    });
  };

  pressHandler = async () => {
    this.setState({ loading: true });
    var validation = true;
    if (
      this.state.creditCard == '' ||
      this.state.expMonth == '' ||
      this.state.expYear == '' ||
      this.state.CVV == ''
    ) {
      this.setState({
        errorText: '*All fields are required',
        loading: false,
      });
      validation = false;
    }
    var d = new Date();
    var n = d.getFullYear();
    if (this.state.expMonth > '12') {
      this.setState({
        errorText: '*Please enter valid Month',
        loading: false,
      });
      validation = false;
    }
    let y = n.toString();
    let splitYear = y.slice('2');
    console.log(splitYear);

    if (this.state.expYear < splitYear) {
      this.setState({
        errorText: '*Please enter valid Year',
        loading: false,
      });
      validation = false;
    }

    var data = {
      number: this.state.creditCard,
      exp_month: this.state.expMonth,
      exp_year: this.state.expYear,
      cvc: this.state.CVV,
    };

    var that = this;

    if (validation) {
      await AppService.createWallet(data)
        .then(res => {
          console.log('createWallet response: ', res);
          if (res.data.status) {
            let newState = { loading: false, cardAvailable: true };
            that.setState(newState);
            Snackbar.show({
              text: res.data.message,
              duration: Snackbar.LENGTH_LONG,
            });
            this.props.handleScreen();
          } else {
            let newState = { loading: false, cardAvailable: false };
            that.setState(newState);
            Snackbar.show({
              text: res.data.message,
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch(function (error) {
          that.setState({ loading: false });
          console.log('Error:', error);
          console.log('Error:', error.response);
          // this.props.handleScreen();
          Snackbar.show({
            text: error.response.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
        })
        .catch(error => {
          console.log('error: ', error);
          console.log('error.response: ', error.response);
          this.setState({ loading: false });
          Snackbar.show({
            text: error.response.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
        });
    } else {
      let newState = {
        loading: false,
      };
      this.setState(newState);
    }
  };
  confirmAddAmount = () => {
    Alert.alert(
      '',
      `Are you sure you want to Add Amount $ ${this.state.amountToAdd}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.onPressAddAmount();
          },
          style: 'cancel',
        },
        {
          text: 'No',
          // onPress: () => ,
        },
      ],
    );
  };

  onPressAddAmount = async () => {
    this.setState({ loading: true });
    let payload = {
      total_amount: Number(this.state.amountToAdd),
    };

    if (this.state.amountToAdd !== '') {
      await AppService.addAmount(payload)
        .then(res => {
          console.log('addAmountToWallet: ', res);
          if (res.data.status) {
            Snackbar.show({
              text: res.data.message,
              duration: Snackbar.LENGTH_LONG,
              amountToAdd: '',
            });
            let newState = {
              loading: false,
            };
            this.setState(newState);
            this.props.handleScreen();
          } else {
            Snackbar.show({
              text: res.data.message,
              duration: Snackbar.LENGTH_LONG,
            });
            let newState = {
              loading: false,
            };
            this.setState(newState);
          }
        })
        .catch(error => {
          console.log('error: ', error);
          console.log('error.response: ', error.response);
          this.setState({ loading: false });
          Snackbar.show({
            text: error.response.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
        });
    } else {
      this.setState({
        errorText: '*Please enter amount',
        loading: false,
      });
      // validation = false;
    }
  };

  render() {
    console.log('this.state.cardAvailable: ', this.state.cardAvailable);
    return (
      <NativeBaseProvider>
        <View style={{ flexGrow: 1, backgroundColor: colors.gray }}>
          <View style={{ flex: 1 }}>
            <View style={styles.mainView}>
              <View style={styles.innerViews}>
                <View style={{ marginBottom: 40 }}>
                  <Image
                    resizeMode={'center'}
                    source={require('../../assets/vero-logo.png')}
                    style={styles.logoStyle}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.textStyle}>
                      {this.props.addAmount ? 'Add Amount' : 'Add your'}
                    </Text>
                    <Text style={styles.textStyle}>
                      {this.props.addAmount
                        ? 'in your Wallet'
                        : 'payment method'}
                    </Text>
                  </View>
                  {/* {this.props.isFromWallet ? ( */}
                  {/* <View> */}
                  {/* <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this.pressHandler}
                        disabled={this.state.loading}> */}
                  {/* <Text
                          style={[
                            styles.textStyle,
                            {color: colors.primaryOrange, fontSize: 16},
                          ]}>
                          Create Wallet
                          <AntDesign
                            type="AntDesign"
                            name="right"
                            style={{
                              color: colors.primaryOrange,
                              fontWeight: 'bold',
                            }}
                          />
                        </Text> */}
                  {/* <Text style={styles.skipText}>Create</Text> */}
                  {/* </TouchableOpacity>
                    </View> */}
                  {/* // ) : null} */}
                </View>
              </View>

              <View style={{ marginLeft: '10%' }}>
                {!this.props.addAmount ? (
                  <View style={styles.creditView}>
                    {this.state.logoCheck === '3782' ? (
                      <View style={styles.bottomIconView2}>
                        <Image
                          source={require('../../assets/american-express.png')}
                          style={styles.bottomImagesSize}
                        />
                      </View>
                    ) : this.state.logoCheck === '4242' ? (
                      <View style={styles.bottomIconView2}>
                        <Image
                          source={require('../../assets/visa-icon.jpg')}
                          style={styles.bottomImagesSize}
                        />
                      </View>
                    ) : this.state.logoCheck === '6011' ? (
                      <View style={styles.bottomIconView2}>
                        <Image
                          source={require('../../assets/discover-icon.png')}
                          style={styles.bottomImagesSize}
                        />
                      </View>
                    ) : this.state.logoCheck === '5555' ? (
                      <View style={styles.bottomIconView2}>
                        <Image
                          source={require('../../assets/masterCardNew.png')}
                          style={styles.bottomImagesSize}
                        />
                      </View>
                    ) : (
                      <View style={{ marginTop: 10 }}>
                        <Octicons
                          type="Octicons"
                          name="credit-card"
                          size={26}
                          color="#022651"
                        />
                      </View>
                    )}

                    <View style={{ width: '90%', margin: '3%' }}>
                      <Collapse
                        onToggle={() => this.changeIcon1()}
                        isCollapsed={true}>
                        <CollapseHeader>
                          <View style={styles.separatorStyle}>
                            <Text style={styles.creditTextStyle}>
                              Credit Card
                            </Text>
                            <View>
                              {this.state.firstItem ? (
                                <MaterialIcons
                                  type="MaterialIcons"
                                  name="keyboard-arrow-up"
                                  style={styles.dropDownIcon}
                                />
                              ) : (
                                <MaterialIcons
                                  type="MaterialIcons"
                                  name="keyboard-arrow-down"
                                  style={styles.dropDownIcon}
                                />
                              )}
                            </View>
                          </View>
                        </CollapseHeader>

                        <CollapseBody style={styles.collapseBodyStyle}>
                          <View
                            style={[styles.inputTextView, { width: '100%' }]}>
                            <TextInputMask
                              type="only-numbers"
                              value={this.state.creditCard}
                              maxLength={16}
                              keyboardType="phone-pad"
                              placeholder={
                                'Credit Card Number'
                                // this.state.cardAvailable
                                //   ? `**** **** **** ${this.state.lastFour}`
                                //   : 'Credit Card Number'
                              }
                              placeholderTextColor="#7892ab"
                              maxLength={16}
                              onChangeText={text =>
                                this.setState({
                                  creditCard: text,
                                  logoCheck: text.substring(0, 4),
                                  errorText: '',
                                })
                              }
                              returnKeyLabel="Next"
                              returnKeyType="next"
                            />
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={styles.inputTextView}>
                              <TextInputMask
                                type="only-numbers"
                                value={this.state.expMonth}
                                maxLength={2}
                                keyboardType="phone-pad"
                                placeholder={
                                  'Exp Month'
                                  // this.state.cardAvailable
                                  //   ? `${this.state.lastFour}`
                                  //   : 'Exp Month'
                                }
                                placeholderTextColor="#7892ab"
                                placeholderTextColor="#7892ab"
                                onChangeText={text => {
                                  if (parseInt(text) > 12)
                                    this.setState({
                                      expMonth: text,
                                      errorText: 'Please enter valid month',
                                    });
                                  else
                                    this.setState({
                                      expMonth: text,
                                      errorText: '',
                                    });
                                }}
                                returnKeyLabel="Next"
                                returnKeyType="next"
                              />
                            </View>
                            <View style={styles.inputTextView}>
                              <TextInputMask
                                type="only-numbers"
                                value={this.state.expYear}
                                maxLength={2}
                                keyboardType="phone-pad"
                                placeholder={
                                  'Exp Year'
                                  // this.state.cardAvailable
                                  //   ? `${this.state.lastFour}`
                                  //   : 'Exp Year'
                                }
                                placeholderTextColor="#7892ab"
                                placeholderTextColor="#7892ab"
                                onChangeText={text =>
                                  this.setState({
                                    expYear: text,
                                    errorText: '',
                                  })
                                }
                                returnKeyLabel="Next"
                                returnKeyType="next"
                              />
                              {/* <TextInput 
                                                    keyboardType="numeric"
                                                    placeholder="Exp Year" 
                                                    placeholderTextColor="#7892ab" 
                                                    maxLength={2}
                                                    onChangeText={(text) => this.setState({ expYear: text, errorText: '' })}
                                                /> */}
                            </View>
                            <View style={styles.inputTextView}>
                              <TextInputMask
                                type="only-numbers"
                                value={this.state.CVV}
                                maxLength={3}
                                keyboardType="phone-pad"
                                placeholder={
                                  'CVV'
                                  // this.state.cardAvailable ? '***' : 'CVV'
                                }
                                placeholderTextColor="#7892ab"
                                onChangeText={text =>
                                  this.setState({ CVV: text, errorText: '' })
                                }
                                returnKeyLabel="Done"
                                returnKeyType="done"
                              />
                            </View>
                          </View>
                        </CollapseBody>
                      </Collapse>

                      {this.state.errorText ? (
                        <Text
                          style={{
                            color: 'red',
                            textAlign: 'center',
                            marginTop: 10,
                            alignSelf: 'flex-end',
                          }}>
                          {this.state.errorText}{' '}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <>
                    {this.state.cardAvailable ? (
                      <View
                        style={{
                          width: '95%',
                          alignItems: 'center',
                          marginTop: this.props.addAmount ? '10%' : 0,
                        }}>
                        <View
                          style={[
                            styles.inputTextView,
                            { alignSelf: 'center', marginBottom: '12%' },
                          ]}>
                          <Text
                            style={[
                              styles.selectTextStyle,
                              { color: colors.primaryOrange, fontSize: 16 },
                            ]}>
                            Add Amount
                          </Text>
                          <TextInputMask
                            type="only-numbers"
                            value={this.state.amountToAdd}
                            maxLength={4}
                            keyboardType="phone-pad"
                            placeholder="Enter Amount"
                            placeholderTextColor="#7892ab"
                            placeholderTextColor="#7892ab"
                            onChangeText={text =>
                              this.setState({
                                amountToAdd: text,
                                errorText: '',
                              })
                            }
                            returnKeyLabel="Done"
                            returnKeyType="done"
                          />
                        </View>
                        {this.state.errorText ? (
                          <Text
                            style={{
                              color: 'red',
                              textAlign: 'center',
                              marginTop: 10,
                              alignSelf: 'flex-end',
                            }}>
                            {this.state.errorText}{' '}
                          </Text>
                        ) : null}

                        {/* <TouchableOpacity
                          onPress={() => this.confirmAddAmount()}
                          style={{
                            width: '75%',
                            height: 35,
                            backgroundColor: 'orange',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: 10,
                            marginBottom: '10%',
                          }}>
                          {this.state.loading ? (
                            <Spinner size={30} color={'#fff'} />
                          ) : (
                            <Text style={{color: '#fff', fontSize: 20}}>
                              Add Amount
                            </Text>
                          )}
                        </TouchableOpacity> */}
                      </View>
                    ) : null}
                  </>
                )}
                {/* Paypal Structure */}
                {/* <View style={[styles.creditView, { marginBottom: 60 }]}>
                            <View style={{ marginTop: 7, marginRight: 9 }}>
                                <Foundation type="Foundation" name="paypal" size={26} color="#022651" />
                            </View>
                            <View style={{ width: '95%' }}>
                                <Collapse onToggle={() => this.changeIcon2()}>
                                    <CollapseHeader>
                                        <Separator style={styles.separatorStyle}>
                                            <View>
                                                <Text style={[styles.creditTextStyle, { color: '#022651' }]}>Paypal</Text>
                                            </View>
                                            <View>
                                                {this.state.secondItem ?
                                                    <MaterialIcons type="MaterialIcons" name="keyboard-arrow-up" style={styles.dropDownIcon} />
                                                    :
                                                    <MaterialIcons type="MaterialIcons" name="keyboard-arrow-down" style={styles.dropDownIcon} />
                                                }
                                            </View>
                                        </Separator>
                                    </CollapseHeader>

                                    <CollapseBody style={styles.collapseBodyStyle} />
                                </Collapse>
                            </View>
                        </View> */}
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView1} />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 30,
                  justifyContent: 'center',
                }}>
                <FontAwesome5
                  type="FontAwesome5"
                  name="lock"
                  size={12}
                  color="#7b93a8"
                />
                <Text style={styles.bottomTextStyle}>
                  Your payment info will be stored securely
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignSelf: 'center',
                }}>
                <View style={styles.bottomIconView}>
                  <Image
                    source={require('../../assets/paypal-logo.png')}
                    style={styles.bottomImagesSize}
                  />
                </View>
                <View style={styles.bottomIconView}>
                  <Image
                    source={require('../../assets/american-express.png')}
                    style={styles.bottomImagesSize}
                  />
                </View>
                <View style={styles.bottomIconView}>
                  <Image
                    source={require('../../assets/discover-icon.png')}
                    style={styles.bottomImagesSize}
                  />
                </View>
                <View style={styles.bottomIconView}>
                  <Image
                    source={require('../../assets/visa-icon.jpg')}
                    style={styles.bottomImagesSize}
                  />
                </View>
                <View style={styles.bottomIconView}>
                  <Image
                    source={require('../../assets/master-icon.png')}
                    style={styles.bottomImagesSize}
                  />
                </View>
              </View>
            </View>
            {this.props.isFromWallet ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: this.props.addAmount ? '10%' : '20%',
                  marginRight: '10%',
                  marginLeft: '10%',
                  // alignSelf: 'flex-end',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.props.handleScreen()}
                  disabled={this.state.loading}>
                  <Text
                    style={[
                      styles.textStyle,
                      { color: colors.primaryOrange, fontSize: 16 },
                    ]}>
                    <AntDesign
                      type="AntDesign"
                      name="left"
                      style={{
                        color: colors.primaryOrange,
                        fontWeight: 'bold',
                      }}
                    />
                    Back
                  </Text>
                  {/* <Text style={styles.skipText}>Create</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={
                    this.props.addAmount
                      ? this.confirmAddAmount
                      : this.pressHandler
                  }
                  disabled={this.state.loading}>
                  <Text
                    style={[
                      styles.textStyle,
                      { color: colors.primaryOrange, fontSize: 16 },
                    ]}>
                    {this.props.addAmount ? 'Add Amount' : 'Create Wallet'}
                    <AntDesign
                      type="AntDesign"
                      name="right"
                      style={{
                        color: colors.primaryOrange,
                        fontWeight: 'bold',
                      }}
                    />
                  </Text>
                  {/* <Text style={styles.skipText}>Create</Text> */}
                </TouchableOpacity>
              </View>
            ) : null}
            <Loader loading={this.state.loading} />
          </View>

          {/* <FooterButton
            title="Create Wallet"
            onPress={this.pressHandler}
            disabled={this.state.loading}
          /> */}
        </View>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  // mainView: {
  //   margin: 20,
  //   backgroundColor: '#fcfcfc',
  // },
  // textStyle: {
  //   fontWeight: 'bold',
  //   fontSize: 25,
  //   color: '#022651',
  // },
  mainView: {
    // margin: '10%',
    backgroundColor: colors.gray,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  innerViews: {
    marginBottom: 60,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    margin: '10%',
  },
  dottedView1: {
    backgroundColor: colors.darkGrey,
    width: 10,
    height: 5,
    borderRadius: 5,
    marginRight: 3,
  },
  dottedView2: {
    backgroundColor: colors.secondaryGray,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 3,
  },
  // dottedView1: {
  //   backgroundColor: '#022651',
  //   width: 10,
  //   height: 5,
  //   borderRadius: 5,
  //   marginRight: 3,
  // },
  // dottedView2: {
  //   backgroundColor: '#7893a7',
  //   width: 5,
  //   height: 5,
  //   borderRadius: 2.5,
  //   marginRight: 3,
  // },
  logoStyle: {
    height: 60,
    width: 90,
    margin: -12,
  },
  skipText: {
    color: '#7d92a7',
    textDecorationLine: 'underline',
  },

  separatorStyle: {
    backgroundColor: 'transparent',
    //padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '97%',
  },
  collapseBodyStyle: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    width: '100%',
  },
  creditView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  creditTextStyle: {
    color: '#ff8800',
    fontWeight: 'bold',
    fontSize: 18,
  },
  inputTextView: {
    borderBottomWidth: 2,
    borderBottomColor: '#e8e8e8',
    marginLeft: 20,
  },
  dropDownIcon: {
    fontSize: 20,
  },
  bottomTextStyle: {
    fontSize: 14,
    color: '#7b93a8',
    marginLeft: 5,
  },
  bottomIconView: {
    width: 40,
    height: 20,
    marginRight: 10,
  },
  bottomIconView2: {
    width: 26,
    height: 16,
    marginTop: 11,
  },
  bottomImagesSize: {
    width: '100%',
    height: '100%',
  },

  //Footer Style:-

  footerStyle: {
    width: '85%',
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  footerTabStyle: {
    backgroundColor: '#ff8800',
    justifyContent: 'flex-end',
    borderTopLeftRadius: 60,
  },
  footerTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
    flexDirection: 'row',
  },
  touchableOpacityStyle: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerTextStyle: {
    color: '#fff',
    marginRight: 6,
  },
  selectTextStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#022651',
    // paddingStart: '10%',
  },
});
