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
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Snackbar from 'react-native-snackbar';
import InputField from '../../common/InputField';
import {
  colors,
  footerButtonStyle,
  headingTextStyle,
  height,
  mainView,
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
import SelectField from '../../common/SelectField';

var pakregex = /^\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{4}-\d{7}$/;
var usregex = /^\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{4}-\d{9}$/;
var pattern1 = new RegExp(pakregex);
var pattern2 = new RegExp(usregex);
class ItemReturnsOrExchange extends Component {
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
      screen: 0,
      isValid: false,
      error: false,
      locationType: '',
      selectedType: '',
      selectedTypeError: '',
      type: [
        { value: 'item_return', name: 'Item Return' },
        { value: 'item_exchange', name: 'Item Exchange' },
      ],
      specificInstruction: '',
      specificInstructionError: '',
      promoCode: '',
      promoCodeError: '',
      // screen: 0,
      // isValid: false,
      // error: false,
      // locationType: '',
      // selectContacts: false,
      updateScreen: true,
    };
  }

  componentDidMount() {}
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
      isFrom: 'ItemReturnsOrExchange',
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
      let newState = { specificInstruction: e, specificInstructionError: '' };
      this.setState(newState);
    } else if (field === 'promoCode') {
      let newState = { promoCode: e, promoCodeError: '' };
      this.setState(newState);
    } else {
      this.setState({ selectedType: e.name });
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
    if (!this.state.selectedType) {
      valid = false;
      this.setState({ selectedTypeError: '*Required!' });
    } else {
      this.setState({ selectedTypeError: '' });
    }
    if (!this.state.specificInstruction) {
      valid = false;
      this.setState({ specificInstructionError: '*Required!' });
    } else {
      this.setState({ specificInstructionError: '' });
    }
    if (!this.state.promoCode) {
      valid = false;
      this.setState({ promoCodeError: '*Required!' });
    } else {
      this.setState({ promoCodeError: '' });
    }

    if (valid) {
      this.setState({ loading: true });
      let payload = {
        pickupLocationData: this.state.pickupLocationData,
        dropoffLocationData: this.state.dropoffLocationData,
        selectedType: this.state.selectedType,
        comments: this.state.specificInstruction,
        discount_code: this.state.promoCode,
      };
      setTimeout(() => {
        this.setState({ loading: false });
        this.props.navigation.navigate(
          'ItemReturnsOrExchangeCheckout',
          payload,
        );
      }, 1000);
    }
  };
  render() {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.mainView}>
                {/* <KeyboardAvoidingView
                  behavior="padding"
                  keyboardVerticalOffset={50}
                  behavior={Platform.OS === 'ios' ? 'padding' : null}
                  // style={{flex: 1}}
                  enabled> */}
                <ScrollView
                  style={{ marginBottom: height / 35, height: hp(78) }}>
                  <View
                    style={{
                      marginBottom: height / 30,
                      marginTop: mainView.marginTop,
                    }}>
                    <Text style={styles.textStyle}>Item Return or</Text>
                    <Text style={styles.textStyle}>Exchange</Text>
                  </View>
                  <SelectField
                    label={'Select Type'}
                    placeholder={'Item Return'}
                    value={this.state.selectedType}
                    onChangeText={e => this.changeHandler(e)}
                    dropDownData={this.state.type}
                    error={this.state.selectedTypeError}
                  />
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
                      <Entypo
                        name="location-pin"
                        // color={colors.primaryOrange}
                        size={15}
                        // style={{marginRight: '10%'}}
                      />
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
                      <Entypo
                        name="location-pin"
                        // color={colors.primaryOrange}
                        size={15}
                        // style={{marginRight: '10%'}}
                      />
                    }
                    error={this.state.dropoffLocationError}
                  />
                  <InputField
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
                    style={{ height: 100, textAlign: 'left' }}
                    error={this.state.specificInstructionError}
                  />
                  <InputField
                    label={'Promo Code'}
                    placeholder={'VERO$200'}
                    value={this.state.promoCode}
                    onChangeText={e => this.changeHandler(e, 'promoCode')}
                    isValid={this.state.isValid}
                    initialIcon={false}
                    inputIconShow={false}
                    error={this.state.promoCodeError}
                  />
                </ScrollView>
                {/* </KeyboardAvoidingView> */}
              </View>
              <Loader loading={this.state.loading} />
            </View>
            {/* <View style={{marginTop: '41%'}}> */}
            <FooterButton
              style={styles.footerTabStyle}
              title="Next"
              onPress={this.pressHandler}
              disabled={this.state.loading}
            />
          </View>
        </View>
      </NativeBaseProvider>
    );
  }
}

export default ItemReturnsOrExchange;
const styles = StyleSheet.create({
  // mainView: {
  //   marginLeft: '10%',
  //   // marginRight: '10%',
  //   marginTop: '10%',
  //   backgroundColor: colors.gray,
  // },
  // textStyle: {
  //   fontWeight: 'bold',
  //   fontSize: 20,
  //   color: colors.darkGrey,
  // },
  // footerTabStyle: {
  //   borderTopLeftRadius: 60,
  //   position: 'absolute',
  //   top: hp('90.5%'),
  //   left: wp('21%'),
  //   overlayColor: 'transparent',
  //   borderRadius: 6,
  // },
  mainView: mainView,
  textStyle: headingTextStyle,
  footerTabStyle: footerButtonStyle,
});
