import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {connect} from 'react-redux';
import {sendMobileVerification} from '../../reduxStore/actions/AuthActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CountryPicker from 'react-native-country-picker-modal';
import FooterButton from '../../common/FooterButton';
import asyncStorage from '../../services/asyncStorage';
import Snackbar from 'react-native-snackbar';
import {colors} from '../../util/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

var check = false;

// var pakregex = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// var usregex = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{9}$)/;

var pakregex = /^\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{4}-\d{7}$/;
var usregex = /^\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{4}-\d{9}$/;
var pattern1 = new RegExp(pakregex);
var pattern2 = new RegExp(usregex);
var countryCode = '+1';
var validation = true;
var data;
var code = '+1';
var MyNum2;
class Login extends Component {
  constructor(props) {
    super(props);
    let callingCode = null;
    let cca2 = null;
    if (!cca2 || !userCountryData) {
      cca2 = 'US';
      callingCode = '1';
    } else {
      callingCode = userCountryData.callingCode;
    }

    this.state = {
      cca2,
      callingCode,
      Number: 0,
      loading: false,
      footerAppearance: true,
      mobile_number: '',
      errorText: '',
      myNum: '',
      num: '',
      initialIcon: true,
      inputIconShow: false,
      isValid: false,
      reduxState: '',
    };
  }

  GetCountry(value) {
    this.setState({
      cca2: value.cca2,
      callingCode: value.callingCode,
      errorText: '',
      inputIconShow: false,
    });
    countryCode = value.callingCode;
    code = '+' + countryCode;
  }

  onChangeHandler(num) {
    if (num.trim().length > 10 && (code == '+1' || code == '+92')) return;
    this.setState({
      errorText: '',
      initialIcon: false,
      inputIconShow: false,
      num: num,
    });
    try {
      if (code == '+1') {
        this.setState({errorText: ''});
        data = {mobile_number: `${code}${num}`};
        asyncStorage.setItem('mobile_number', data.mobile_number);
        check = pattern2.test(num);
        validation = pattern2.test(num);
      } else if (code == '+92') {
        this.setState({errorText: ''});
        data = {mobile_number: `${code}${num}`};
        asyncStorage.setItem('mobile_number', data.mobile_number);
        check = pattern1.test(num);
        validation = pattern1.test(num);
      } else {
        this.setState({errorText: '*Please Select a valid country'});
        check = false;
        validation = false;
      }
    } catch (error) {
      this.setState({loading: false});
    }
  }

  checkValidity = text => {
    if (text.trim().length < 10) {
      this.setState({
        isValid: true,
      });
    }
  };
  checkMobilNumber = text => {
    if (text.trim().length < 11 && code === '+92') {
      this.setState({
        validation: true,
      });
    } else {
      this.setState({
        validation: false,
      });
    }
  };

  pressHandler = async () => {
    // if (validation == true) {
    //   this.setState({loading: true});
    //   await this.props.dispatch(sendMobileVerification(data));
    //   if (this.props.reduxState.isMobileVerified) {
    //     setTimeout(() => {
    //       this.setState({loading: false});
    //       this.props.navigation.navigate('CodeVerification');
    //     }, 600);
    //   } else {
    //     this.setState({loading: false});
    //     Snackbar.show({
    //       text: this.props.reduxState.mobileVericifationError,
    //       duration: Snackbar.LENGTH_LONG,
    //     });
    //   }
    // } else {
    //   this.setState({
    //     inputIconShow: true,
    //     loading: false,
    //     errorText: '*Please enter valid mobile number',
    //   });
    // }
    this.props.navigation.navigate('CodeVerification');
  };

  render() {
    return (
      <NativeBaseProvider>
        <View style={{flex: 1, backgroundColor: colors.gray}}>
          <View style={{flexGrow: 1, padding: 0}}>
            <View style={styles.mainView}>
              <View style={{marginBottom: '15%'}}>
                <Image
                  source={require('../../assets/vero-logo.png')}
                  style={styles.logoStyle}
                />
              </View>

              <View style={styles.innerViews}>
                <Text style={styles.textStyle}>Enter your</Text>
                <Text style={styles.textStyle}>phone number to proceed</Text>
              </View>

              <View style={styles.innerViews}>
                <Text style={[styles.textStyle, {fontSize: hp('2.5%')}]}>
                  Enter Phone Number
                </Text>
                <View style={styles.phoneInputView}>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <CountryPicker
                      // countryList={NORTH_AMERICA}
                      onSelect={value => this.GetCountry(value)}
                      cca2={this.state.cca2}
                      translation="eng"
                      withFilter={true}
                      filterPlaceholder="Country Name"
                      countryCode={this.state.cca2}
                    />
                    <MaterialIcons
                      type="MaterialIcons"
                      name="arrow-drop-down"
                      style={styles.dropDownIcon}
                    />
                  </View>
                  <View style={styles.lineStyle} />
                  <View>
                    <Text style={styles.textStyle2}>+</Text>
                  </View>
                  <View style={styles.borderStyle}>
                    <Text
                      style={[
                        styles.textStyle2,
                        {height: hp('4%'), paddingTop: hp('0.7%')},
                      ]}>
                      {' '}
                      {this.state.callingCode}{' '}
                    </Text>
                  </View>
                  <View style={[styles.borderStyle, styles.view1]}>
                    <TextInput
                      type="only-numbers"
                      value={this.state.num}
                      // maxLength={3}
                      keyboardType="phone-pad"
                      placeholder="(355) 678-6828"
                      placeholderTextColor="#7892ab"
                      returnKeyType="done"
                      onChangeText={text => {
                        this.onChangeHandler(text);
                        this.checkValidity(text);
                      }}
                      style={[
                        styles.textStyle2,
                        {
                          height: hp('4%'),
                          alignItems: 'center',
                          padding: hp(0),
                        },
                      ]}
                    />
                    {this.state.isValid ? (
                      <Entypo
                        type="Entypo"
                        name={check == this.state.isValid ? 'check' : 'cross'}
                        style={{fontSize: hp('3%')}}
                        color={check == true ? '#006400' : '#FF0000'}
                      />
                    ) : null}
                  </View>
                </View>
                {this.state.errorText ? (
                  <Text
                    style={{
                      color: 'red',
                      textAlign: 'center',
                      marginTop: hp('10%'),
                      alignSelf: 'flex-end',
                    }}>
                    {this.state.errorText}{' '}
                  </Text>
                ) : null}
              </View>

              <View style={{flexDirection: 'row', marginTop: hp('10%')}}>
                <View style={styles.dottedView1} />
                <View style={styles.dottedView2} />
                <View style={styles.dottedView2} />
              </View>
            </View>
          </View>
          <FooterButton style={styles.footerTabStyle}
            title="Get Started"
            onPress={this.pressHandler}
            disabled={this.state.loading}
          />
        </View>
      </NativeBaseProvider>
    );
  }
}
const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps: ', dispatch.auth);
  return {
    mobileVerification: data => sendMobileVerification(data),
    reduxState: dispatch.auth,
  };
};

export default connect(mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  mainView: {
    marginLeft: wp('10%'),
    marginTop: hp('5%'),
    backgroundColor: colors.gray,
  },
  innerViews: {
    marginBottom: hp('10%'),
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: hp('3%'),
    color: colors.darkGrey,
  },
  textStyle2: {
    fontSize: hp('2%'),
    color: '#7893a9',
  },
  dottedView1: {
    backgroundColor: colors.darkGrey,
    width: wp('3%'),
    height: hp('0.5%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%'),
  },
  dottedView2: {
    backgroundColor: colors.secondaryGray,
    width: hp('1%'),
    height: hp('0.5%'),
    borderRadius: wp('1&'),
    marginRight: wp('1%'),
  },
  logoStyle: {
    // height: 60,
    resizeMode: 'contain',
    width: wp('20%'),
    // margin: -12,
  },
  dropDownIcon: {
    fontSize: wp('5%'),
  },
  lineStyle: {
    borderWidth: wp('0.2%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    borderColor: '#e2e2e2',
    height: hp('3%'),
  },
  borderStyle: {
    borderBottomWidth: wp('0.5%'),
    borderColor: '#002753',
    paddingBottom: hp('0.7%'),
  },
  phoneInputView: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  view1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('50%'),
  },
  footerTabStyle: {
    borderTopLeftRadius: 60,
    position: 'absolute',
    top: hp('90.5%'),
    left: wp("21%"),
    overlayColor: 'transparent',
    borderRadius: 6,
  },
});
