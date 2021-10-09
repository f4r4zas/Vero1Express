import React, {Component} from 'react';
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
import {NativeBaseProvider} from 'native-base';
import Snackbar from 'react-native-snackbar';
import InputField from '../../common/InputField';
import {colors} from '../../util/colors';
import FooterButton from '../../common/FooterButton';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Map from '../../common/map/Map';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
      dropoffLocation: '',
      dropoffLocationData: '',
      phoneNumber: '',
      specificInstruction: '',
      screen: 0,
      isValid: false,
      error: false,
      locationType: '',
      selectContacts: false,
    };
  }

  componentDidMount() {}
  screenHandler = (screen, locationType) => {
    console.log(screen);
    // if (field === 'deliveryAddress') {
    let newState = {screen: screen, locationType: locationType};
    this.setState(newState);
    // }
  };
  addressHandler = (data, screen) => {
    // if (field === 'deliveryAddress')
    console.log('data: ', data);
    this.setState({screen: screen});
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
        };
        this.setState(newState);
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
        };
        this.setState(newState);
      }
    } else {
      let addressComponent = data.address;
      if (this.state.locationType === 'pickup') {
        let newState = {
          screen: screen,
          pickupLocationData: data,
          pickupLocation: addressComponent,
        };
        this.setState(newState);
      } else {
        let newState = {
          screen: screen,
          dropoffLocationData: data,
          dropoffLocation: addressComponent,
        };
        this.setState(newState);
      }
    }
  };
  changeHandler = (e, field) => {
    console.log(e);
    if (field === 'specificInstruction') {
      let newState = {specificInstruction: e};
      this.setState(newState);
    } else if (field === 'phoneNumber') {
      let newState = {phoneNumber: e};
      this.setState(newState);
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
    let valid = true;
    if (!this.state.pickupLocation) {
      valid = false;
    }
    if (!this.state.dropoffLocation) {
      valid = false;
    }
    if (!this.state.phoneNumber) {
      valid = false;
    }

    if (valid) {
      let payload = {
        pickupLocationData: this.state.pickupLocationData,
        dropoffLocationData: this.state.dropoffLocationData,
        phoneNumber: this.state.phoneNumber,
        specificInstruction: this.state.specificInstruction,
      };
      setTimeout(() => {
        this.props.navigation.navigate(
          'PackagePickupAndDeliveryCheckout',
          payload,
        );
      }, 500);
    }
  };
  getContacts = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
    }).then(() => {
      selectContactPhone().then(selection => {
        if (!selection) {
          return null;
        }

        let {contact, selectedPhone} = selection;
        console.log(
          `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`,
        );
        // return selectedPhone.number;
        this.setState({
          phoneNumber: selectedPhone.number,
          selectContacts: true,
        });
      });
    });
  };
  render() {
    if (this.state.screen == 0) {
      return (
        <NativeBaseProvider>
          <View style={{flex: 1, backgroundColor: colors.gray}}>
            <View style={{flex: 1}}>
              <View style={styles.mainView}>
                <KeyboardAvoidingView
                  behavior="padding"
                  keyboardVerticalOffset={50}
                  behavior={Platform.OS === 'ios' ? 'padding' : null}
                  // style={{flex: 1}}
                  enabled>
                  <ScrollView>
                    <View style={{marginBottom: '15%'}}>
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
                        <Entypo
                          name="location-pin"
                          // color={colors.primaryOrange}
                          size={15}
                          // style={{marginRight: '10%'}}
                        />
                      }
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
                    />
                    <InputField
                      label={'Receipent Phone Number'}
                      placeholder={'55144533'}
                      value={this.state.phoneNumber}
                      // onFocus={() => {
                      //   this.getContacts();
                      // }}
                      onChangeText={e => this.changeHandler(e, 'phoneNumber')}
                      isValid={this.state.isValid}
                      initialIcon={true}
                      inputIconShow={true}
                      inputIcon={
                        <AntDesign
                          name="contacts"
                          // color={colors.primaryOrange}
                          size={15}
                          // style={{marginRight: '10%'}}
                        />
                      }
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
                    />
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            </View>
            {/* <View style={{marginTop: '41%'}}> */}
            <FooterButton
              style={styles.footerTabStyle}
              title="Next"
              onPress={this.pressHandler}
              disabled={this.state.loading}
            />
            {/* </View> */}
          </View>
        </NativeBaseProvider>
      );
    } else if (this.state.screen == 1) {
      return (
        <Map
          handleScreen={(data, screen) => this.addressHandler(data, screen)}
          locationType={this.state.locationType}
          pickupLocationData={
            this.state.locationType ? this.state.pickupLocationData : ''
          }
          // pickupLocation={this.state.payload.item_purchases.store}
        />
      );
    }
  }
}

export default PackagePickupAndDelivery;
const styles = StyleSheet.create({
  mainView: {
    marginLeft: '10%',
    // marginRight: '10%',
    marginTop: '10%',
    backgroundColor: colors.gray,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  footerTabStyle: {
    borderTopLeftRadius: 60,
    position: 'absolute',
    top: hp('90.5%'),
    left: wp('21%'),
    overlayColor: 'transparent',
    borderRadius: 6,
  },
});
