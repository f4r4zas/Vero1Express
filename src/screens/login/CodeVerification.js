import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NativeBaseProvider, Spinner} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import asyncStorage from '../../services/asyncStorage';
import FooterButton from '../../common/FooterButton';
import {connect} from 'react-redux';
import {
  verifyMobileVerification,
  verifyUser,
} from '../../reduxStore/actions/AuthActions';
import {sendMobileVerification} from '../../reduxStore/actions/AuthActions';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import {colors} from '../../util/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class CodeVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: false,
      errorText: '',
      phone_num: '',
      vCode: '',
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
      input6: '',
      timer: 30,
      loading: false,
    };
  }

  backPressHandler = () => {
    Alert.alert(
      'Exit',
      'Are you sure you want to exit registration?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.props.navigation.popToTop()},
      ],
      {cancelable: false},
    );
    return true;
  };

  async componentDidMount() {
    this.backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backPressHandler,
    );
    var num = await asyncStorage.getItem('mobile_num');
    var code = await asyncStorage.getItem('verification_code');
    this.setState({
      phone_num: JSON.parse(num),
      vCode: code,
    });
    this.interval = setInterval(
      () => this.setState(prevState => ({timer: prevState.timer - 1})),
      1000,
    );
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.backhandler.remove();
  }

  startTimerAgain() {
    this.sendCodeAgain();
    this.setState({
      timer: 30,
    });
    var newInterval = setInterval(() => {
      this.setState(prevState => ({timer: prevState.timer - 1}));
      if (this.state.timer === 0) {
        clearInterval(newInterval);
      }
    }, 1000);
  }

  sendCodeAgain = async () => {
    var validation = true;
    var data = {
      mobile_number: this.state.phone_num,
    };
    if (validation == true) {
      this.setState({loading: true});
      if (validation == true) {
        await this.props.dispatch(sendMobileVerification(data));
        this.setState({loading: false});
      }
    }
  };

  tempFunc() {
    this.refs.modal1.open();
    setTimeout(() => {
      this.setState({
        modalState: true,
      });
      setTimeout(() => {
        this.props.navigation.navigate('personalInfo');
      }, 1000);
    }, 1000);
  }

  changeText1(text) {
    this.setState({
      input1: text,
      errorText: null,
    });
    if (text) {
      this.secondTextInput.focus();
    } else {
      this.firstTextInput.focus();
    }
  }

  changeText2(text) {
    this.setState({
      input2: text,
      errorText: null,
    });
    if (text) {
      this.thirdTextInput.focus();
    } else {
      this.firstTextInput.focus();
    }
  }

  changeText3(text) {
    this.setState({
      input3: text,
      errorText: null,
    });
    if (text) {
      this.fourthTextInput.focus();
    } else {
      this.secondTextInput.focus();
    }
  }

  changeText4(text) {
    this.setState({
      input4: text,
      errorText: null,
    });
    if (text) {
      this.fifthTextInput.focus();
    } else {
      this.thirdTextInput.focus();
    }
  }

  changeText5(text) {
    this.setState({
      input5: text,
      errorText: null,
    });
    if (text) {
      this.sixthTextInput.focus();
    } else {
      this.fourthTextInput.focus();
    }
  }

  changeText6(text) {
    this.setState({
      input6: text,
      errorText: null,
    });
    if (text == '') {
      this.fifthTextInput.focus();
    }
  }

  pressHandler = async () => {
    this.setState({loading: true});
    let validation = true;
    let MyNum =
      this.state.input1 +
      this.state.input2 +
      this.state.input3 +
      this.state.input4 +
      this.state.input5 +
      this.state.input6;
    let data = {
      mobile_number: this.state.phone_num,
      verification_code: MyNum,
    };
    if (MyNum.length !== 6) {
      this.setState({
        errorText: '*Please enter the valid 6-digit code',
        loading: false,
      });
      validation = false;
    }
    var that = this;

    if (validation == true) {
      that.refs.modal1.open();
      await this.props.dispatch(verifyMobileVerification(data));
      console.log('returningFromRedux: ', this.props.reduxState);
      this.setState({loading: false});
      if (this.props.reduxState.isCodeVerified) {
        await this.props.dispatch(verifyUser(data));
        let user_data = '';
        await AsyncStorage.getItem('user_data').then(res => {
          user_data = res;
        });
        let user_Info = JSON.parse(user_data);
        if (this.props.reduxState.isLogin && user_Info?.api_key) {
          that.setState({modalState: false});
          that.props.navigation.navigate('AppNavigation');
        } else {
          if (returningFromRedux.status == false) {
            this.setState({modalState: false});
            Snackbar.show({
              text: returningFromRedux.message,
              duration: Snackbar.LENGTH_LONG,
            });
            that.props.navigation.navigate('PersonalInfo');
          } else {
            that.setState({modalState: false});
          }
        }
      } else {
        this.setState({modalState: false});
        Snackbar.show({
          text: this.props.reduxState.codeVericifationError,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    }
    // this.props.navigation.navigate('AppNavigation');
  };

  render() {
    return (
      <NativeBaseProvider>
        <View style={{flex: 1, backgroundColor: colors.gray}}>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={{flex: 1}}
            enabled>
            <ScrollView>
              <View style={{flexGrow: 1, padding: 1}}>
                <View style={styles.mainView}>
                  <View style={{marginBottom: hp('15%')}}>
                    <Image
                      resizeMode={'center'}
                      source={require('../../assets/vero-logo.png')}
                      style={styles.logoStyle}
                    />
                  </View>

                  <View style={styles.innerViews}>
                    <Text style={styles.textStyle}>Verification Code</Text>
                  </View>
                  <View>
                    <Text style={[styles.textStyle, {fontSize: 16}]}>
                      Enter Verification Code
                    </Text>

                    <View style={{marginBottom: '30%'}}>
                      <View style={styles.vCodeInputView}>
                        <TextInput
                          style={styles.vCodeInputStyle}
                          maxLength={1}
                          ref={input => {
                            this.firstTextInput = input;
                          }}
                          keyboardType="phone-pad"
                          onChangeText={text => this.changeText1(text)}
                        />
                        <TextInput
                          style={styles.vCodeInputStyle}
                          maxLength={1}
                          ref={input => {
                            this.secondTextInput = input;
                          }}
                          keyboardType="phone-pad"
                          onChangeText={text => this.changeText2(text)}
                        />
                        <TextInput
                          style={styles.vCodeInputStyle}
                          maxLength={1}
                          ref={input => {
                            this.thirdTextInput = input;
                          }}
                          keyboardType="phone-pad"
                          onChangeText={text => this.changeText3(text)}
                        />
                        <TextInput
                          style={styles.vCodeInputStyle}
                          maxLength={1}
                          ref={input => {
                            this.fourthTextInput = input;
                          }}
                          keyboardType="phone-pad"
                          onChangeText={text => this.changeText4(text)}
                        />
                        <TextInput
                          style={styles.vCodeInputStyle}
                          maxLength={1}
                          ref={input => {
                            this.fifthTextInput = input;
                          }}
                          keyboardType="phone-pad"
                          onChangeText={text => this.changeText5(text)}
                        />
                        <TextInput
                          style={styles.vCodeInputStyle}
                          maxLength={1}
                          ref={input => {
                            this.sixthTextInput = input;
                          }}
                          keyboardType="phone-pad"
                          onChangeText={text => this.changeText6(text)}
                        />
                      </View>

                      {this.state.errorText ? (
                        <Text
                          style={{
                            color: 'red',
                            textAlign: 'center',
                            marginTop: 10,
                            marginRight: 12,
                            alignSelf: 'flex-end',
                          }}>
                          {this.state.errorText}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.dottedView2} />
                    <View style={styles.dottedView1} />
                    <View style={styles.dottedView2} />
                  </View>

                  {this.state.timer === 0 ? (
                    <View style={styles.resendTimerView}>
                      <TouchableOpacity onPress={() => this.startTimerAgain()}>
                        <Text
                          style={[
                            styles.inputTextStyle,
                            {textDecorationLine: 'underline'},
                          ]}>
                          Resend code
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.resendTimerView}>
                      <Text style={styles.inputTextStyle}>Resend code in </Text>
                      <Text style={{color: '#002655'}}>{this.state.timer}</Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Modal position={'center'} ref={'modal1'} style={styles.modalStyle}>
            {this.state.modalState ? (
              <View style={styles.modalInnerView}>
                <Text style={styles.modalText}>Verified</Text>
                <Ionicons
                  type="Ionicons"
                  name="ios-checkmark-circle-outline"
                  size={70}
                  color="#ff8800"
                />
              </View>
            ) : (
              <View style={styles.modalInnerView}>
                <Text style={styles.modalText}>Verifying</Text>
                <Spinner
                  color="#ff8800"
                  size={70}
                  style={{fontWeight: '100'}}
                />
              </View>
            )}
          </Modal>
          <FooterButton
            style={styles.footerTabStyle}
            title="Next"
            onPress={this.pressHandler}
            disabled={this.state.loading}
          />
        </View>
      </NativeBaseProvider>
    );
  }
}

// const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps: ', dispatch.auth);
  return {
    verifyMobileVerification: data => verifyMobileVerification(data),
    mobileVerification: data => sendMobileVerification(data),
    verifyUser: data => verifyUser(data),
    reduxState: dispatch.auth,
    // globalLoader: () => setGlobalLoader()
  };
};

export default connect(mapDispatchToProps)(CodeVerification);

const styles = StyleSheet.create({
  mainView: {
    marginLeft: '10%',
    marginTop: hp('5%'),
    backgroundColor: colors.gray,
  },
  innerViews: {
    marginBottom: hp('10%'),
  },
  logoStyle: {
    // height: 60,
    resizeMode: 'contain',
    width: 90,
    // margin: -12,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  dottedView1: {
    backgroundColor: colors.darkGrey,
    width: 10,
    height: 5,
    borderRadius: 5,
    marginRight: 3,
  },
  dottedView2: {
    backgroundColor: '#7893a7',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 3,
  },
  inputTextStyle: {
    fontSize: 15,
    color: '#7b93a8',
  },
  resendTimerView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 60,
  },
  vCodeInputView: {
    flexDirection: 'row',
    // alignSelf: 'center',
    marginTop: 15,
  },
  vCodeInputStyle: {
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#efefef',
    height: 55,
    width: 38,
    marginRight: 10,
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    fontSize: 22,
    color: colors.darkGrey,
  },

  //Modal Styling

  modalStyle: {
    height: 160,
    width: '75%',
    justifyContent: 'center',
    backgroundColor: '#fdfbfc',
    borderRadius: 30,
  },
  modalInnerView: {
    alignSelf: 'center',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },

  // footer style

  footerStyle: {
    width: '85%',
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  footerTabStyle: {
    borderTopLeftRadius: 60,
    position: 'absolute',
    top: hp('90.5%'),
    left: wp('21%'),
    overlayColor: 'transparent',
    borderRadius: 6,
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
});
