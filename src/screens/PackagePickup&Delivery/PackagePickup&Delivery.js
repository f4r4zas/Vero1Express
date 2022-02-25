import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Snackbar from 'react-native-snackbar';
import InputField from '../../common/InputField';
import {
  ASPECT_RATIO,
  colors,
  footerButtonStyle,
  headingTextStyle,
  height,
  mainView,
  width,
} from '../../util/colors';
import FooterButton from '../../common/FooterButton';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Map from '../../common/map/Map';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import asyncStorage from '../../services/asyncStorage';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../common/Loader';
import ContactsList from '../../common/phoneContactList/Contacts';

var pakregex = /^\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{4}-\d{7}$/;
var usregex = /^\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{4}-\d{9}$/;
var pattern1 = new RegExp(pakregex);
var pattern2 = new RegExp(usregex);
class PackagePickupAndDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pickupLocation: '',
      pickupLocationData: '',
      pickupLocationError: '',
      dropoffLocation: '',
      dropoffLocationError: '',
      dropoffLocationData: '',
      phoneNumber: '',
      phoneNumberError: '',
      specificInstruction: '',
      screen: 0,
      isValid: false,
      error: false,
      locationType: '',
      selectContacts: false,
      updateScreen: true,
    };
  }
  // backPressHandler = () => {
  //   Alert.alert(
  //     'Exit',
  //     'Are you sure you want to exit registration?',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       { text: 'OK', onPress: () => this.props.navigation.popToTop() },
  //     ],
  //     { cancelable: false },
  //   );
  //   return true;
  // };
  componentDidMount() {
    // console.log('Location Data: ', this.props.route?.params);
    // const data = this.props.route?.params;
    // if (data?.data) {
    //   this.addressHandler(data);
    // }
    // this.backhandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.backPressHandler,
    // );
  }
  componentDidUpdate() {
    console.log('Location Data: ', this.props.route?.params);
    let data = this.props.route?.params;
    // debugger;
    if (data?.update == 'pickup') {
      if (data?.data) {
        this.addressHandler(data?.data);
        // this.setState({ screen: 0 });
      }
      data = '';
      this.props.route.params = '';
    } else if (data?.update == 'dropoff') {
      if (data?.data) {
        this.addressHandler(data?.data);
        // this.setState({ screen: 0 });
      }
      data = '';
      this.props.route.params = '';
    } else if (data?.update == 'mobile') {
      if (data?.data?.mobileNumber) {
        this.setState({ phoneNumber: data.data.mobileNumber });
      }
      data = '';
      this.props.route.params = '';
    }
  }
  screenHandler = (screen, locationType) => {
    // console.log(screen);
    // if (field === 'deliveryAddress') {
    let newState = { locationType: locationType, updateScreen: true };
    // let newState = { screen: screen, locationType: locationType };
    this.setState(newState);
    this.props.navigation.navigate('Map', {
      // handleScreen: data => this.addressHandler(data),
      locationType: locationType,
      pickupLocationData:
        locationType == 'dropoff' ? this.state.pickupLocationData : '',
      // isFrom: 'PurchaseItemsService',
    });
    // }
  };
  addressHandler = (data, screen) => {
    // if (field === 'deliveryAddress')
    console.log('data: ', data);
    // this.setState({ screen: 0 });
    if (data?.results) {
      let addressComponent = data.results[0].address_components;
      if (this.state.locationType === 'pickup') {
        let newState = {
          screen: screen,
          pickupLocationData: data,
          pickupLocation:
            addressComponent[0].long_name +
            ' ' +
            addressComponent[1].long_name +
            ' ' +
            addressComponent[3].long_name,
          pickupLocationError: '',
          updateScreen: false,
        };
        this.setState(newState);
        AsyncStorage.setItem('pick_up_address', newState.pickupLocation);
      } else {
        let newState = {
          screen: screen,
          dropoffLocationData: data,
          dropoffLocation:
            addressComponent[0].long_name +
            ' ' +
            addressComponent[1].long_name +
            ' ' +
            addressComponent[3].long_name,
          dropoffLocationError: '',
          updateScreen: false,
        };
        this.setState(newState);
        AsyncStorage.setItem('drop_of_address', newState.dropoffLocation);
      }
    } else {
      let addressComponent = data.address;
      if (this.state.locationType === 'pickup') {
        let newState = {
          screen: screen,
          pickupLocationData: data,
          pickupLocation: addressComponent,
          pickupLocationError: '',
          updateScreen: false,
        };
        this.setState(newState);
        AsyncStorage.setItem('pick_up_address', newState.pickupLocation);
      } else {
        let newState = {
          screen: screen,
          dropoffLocationData: data,
          dropoffLocation: addressComponent,
          dropoffLocationError: '',
          updateScreen: false,
        };
        this.setState(newState);
        AsyncStorage.setItem('drop_of_address', newState.dropoffLocation);
      }
    }
  };
  changeHandler = (e, field) => {
    console.log(e);
    if (field === 'specificInstruction') {
      let newState = { specificInstruction: e };
      this.setState(newState);
    } else if (field === 'phoneNumber') {
      const validateMobilelength = this.validateMobilelength(e);
      if (validateMobilelength) {
        let newState = { phoneNumber: e, phoneNumberError: '' };
        this.setState(newState);
      }
    }
  };
  onChangeNumber(num) {
    if (num.trim().length > 10 && (code == '+1' || code == '+92')) return;
    this.setState({
      errorText: '',
      initialIcon: false,
      inputIconShow: false,
      num: num,
    });
    try {
      if (code == '+1') {
        this.setState({ errorText: '' });
        data = { mobile_number: `${code}${num}` };
        asyncStorage.setItem('mobile_number', data.mobile_number);
        check = pattern2.test(num);
        validation = pattern2.test(num);
      } else if (code == '+92') {
        this.setState({ errorText: '' });
        data = { mobile_number: `${code}${num}` };
        asyncStorage.setItem('mobile_number', data.mobile_number);
        check = pattern1.test(num);
        validation = pattern1.test(num);
      } else {
        this.setState({ errorText: '*Please Select a valid country' });
        check = false;
        validation = false;
      }
    } catch (error) {
      this.setState({ loading: false });
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
    let valid = true;
    if (!this.state.pickupLocation) {
      valid = false;
      this.setState({ pickupLocationError: '*Required!' });
    } else {
      this.setState({ pickupLocationError: '' });
    }
    if (!this.state.dropoffLocation) {
      valid = false;
      this.setState({ dropoffLocationError: '*Required!' });
    } else {
      this.setState({ dropoffLocationError: '' });
    }
    if (!this.state.phoneNumber) {
      valid = false;
      this.setState({ phoneNumberError: '*Required!' });
    } else {
      this.setState({ phoneNumberError: '' });
    }

    if (valid) {
      this.setState({ loading: true });
      let payload = {
        pickupLocationData: this.state.pickupLocationData,
        dropoffLocationData: this.state.dropoffLocationData,
        phoneNumber: this.state.phoneNumber,
        specificInstruction: this.state.specificInstruction,
      };
      setTimeout(() => {
        this.setState({ loading: false });
        this.props.navigation.navigate(
          'PackagePickupAndDeliveryCheckout',
          payload,
        );
      }, 1000);
    }
  };
  getContacts = () => {
    // this.setState({ screen: 2 });
    this.props.navigation.navigate('ContactsList');
  };
  handleContactList = data => {
    console.log('data from contacts: ', data);
    if (data) {
      const number = data.replace(/[^A-Z0-9]/gi, '');
      this.setState({ phoneNumber: number, screen: 0, phoneNumberError: '' });
    }
  };
  validateMobile = mobile => {
    const re = /^03[0-9]{2}[0-9]{7}[-\s./0-9]*$/;
    // const re = /^[0]{1}[3]{1}[0-9]{2}[0-9]{7}$/;
    // const re = /^[0-9]{0,11}$/;
    const valid = re.test(mobile);
    return valid;
  };
  validateMobilelength = mobile => {
    // const re = /^[0]{1}[3]{1}[0-9]{2}[0-9]{7}$/;
    if (mobile.charAt(0) == '9') {
      const re = /^[0-9]{0,12}$/;
      const valid = re.test(mobile);
      return valid;
    } else {
      const re = /^[0-9]{0,11}$/;
      const valid = re.test(mobile);
      return valid;
    }
  };
  render() {
    // if (this.state.screen == 0) {
    return (
      <NativeBaseProvider>
        <View
          style={{
            // flex: 1,
            backgroundColor: colors.gray,
          }}>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={{ marginBottom: height / 50, marginTop: mainView.marginTop }}
            enabled>
            <ScrollView style={{ marginBottom: height / 15 }}>
              <View>
                <View style={styles.mainView}>
                  <View style={{ marginBottom: height / 30 }}>
                    <Text style={styles.textStyle}>Package Pickup</Text>
                    <Text style={styles.textStyle}>& Delivery</Text>
                  </View>
                  <InputField
                    label={'Pickup From'}
                    placeholder={'11/14 Garden Road, Street 12'}
                    value={this.state.pickupLocation}
                    onFocus={() => this.screenHandler(1, 'pickup')}
                    isValid={this.state.isValid}
                    initialIcon={true}
                    inputIconShow={true}
                    name={''}
                    numberOfLines={3}
                    multiline={true}
                    inputIcon={
                      <Entypo name="location-pin" size={ASPECT_RATIO * 40} />
                    }
                    error={this.state.pickupLocationError}
                  />
                  <InputField
                    label={'Drop Off'}
                    placeholder={'11/14 Garden Road, Street 12'}
                    value={this.state.dropoffLocation}
                    onFocus={() => this.screenHandler(1, 'dropoff')}
                    isValid={this.state.isValid}
                    initialIcon={true}
                    inputIconShow={true}
                    name={''}
                    numberOfLines={3}
                    multiline={true}
                    inputIcon={
                      <Entypo name="location-pin" size={ASPECT_RATIO * 40} />
                    }
                    error={this.state.dropoffLocationError}
                  />
                  <InputField
                    label={'Receipent Phone Number'}
                    placeholder={'55144533'}
                    value={this.state.phoneNumber}
                    onChangeText={e => this.changeHandler(e, 'phoneNumber')}
                    isValid={this.state.isValid}
                    initialIcon={true}
                    inputIconShow={true}
                    inputIcon={
                      <AntDesign
                        name="contacts"
                        size={ASPECT_RATIO * 50}
                        onPress={() => this.getContacts()}
                      />
                    }
                    // iconPlusName="Phonebook"
                    error={this.state.phoneNumberError}
                    returnKeyType={'Next'}
                  />
                  <InputField
                    type="textArea"
                    label={'Specific Instructions'}
                    placeholder={'johan@gmail.com'}
                    value={this.state.specificInstruction}
                    onChangeText={e =>
                      this.changeHandler(e, 'specificInstruction')
                    }
                    isValid={this.state.isValid}
                    initialIcon={false}
                    inputIconShow={false}
                    multiline={true}
                    numberOfLines={5}
                    style={{ textAlign: 'left' }}
                    returnKeyType={'Next'}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Loader loading={this.state.loading} />
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

export default PackagePickupAndDelivery;
const styles = StyleSheet.create({
  mainView: mainView,
  textStyle: headingTextStyle,
  footerTabStyle: footerButtonStyle,
});
