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
import AppService from '../../../services/AppService';
import { colors } from '../../../util/colors';
import Snackbar from 'react-native-snackbar';
import FooterButton from '../../../common/FooterButton';
import InputField from '../../../common/InputField';
import Entypo from 'react-native-vector-icons/Entypo';
import Map from '../../../common/map/Map';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../common/Loader';

class UserDeliveryInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deliveryAddress: '',
      specificInstruction: '',
      specificInstructionError: '',
      promoCode: '',
      promoCodeError: '',
      isValid: false,
      error: false,
      screen: 0,
      locationData: '',
      payload: '',
      drop_of_locationError: '',
      pickupLocation: '',
      pickupLocationData: '',
      pickupLocationError: '',
      dropoffLocation: '',
      dropoffLocationError: '',
      dropoffLocationData: '',
      locationType: '',
      updateScreen: false,
    };
  }

  // screenHandler = screen => {
  //   console.log(screen);
  //   // if (field === 'deliveryAddress') {
  //   let newState = { screen: screen };
  //   this.setState(newState);
  //   // }
  // };
  // addressHandler = (data, screen) => {
  //   // if (field === 'deliveryAddress')
  //   console.log('data: ', data);
  //   // debugger;
  //   if (data?.results) {
  //     let addressComponent = data.results[0].address_components;
  //     let newState = {
  //       screen: screen,
  //       locationData: data,
  //       deliveryAddress:
  //         addressComponent[0].long_name +
  //         ' ' +
  //         addressComponent[1].long_name +
  //         ' ' +
  //         addressComponent[3].long_name,
  //     };
  //     this.setState(newState);
  //   } else {
  //     let addressComponent = data.address;
  //     let newState = {
  //       screen: screen,
  //       locationData: data,
  //       deliveryAddress: addressComponent,
  //     };
  //     this.setState(newState);
  //   }
  //   // }
  // };
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
      isFrom: 'UserDeliveryInfo',
    });
    // }
  };
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
  componentDidMount() {
    let payload = this.props?.route?.params;
    let newState = {
      payload: payload,
    };
    this.setState(newState);
  }
  addressHandler = (data, screen) => {
    // if (field === 'deliveryAddress')
    console.log('data: ', data);
    this.setState({ screen: screen });
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
        };
        this.setState(newState);
        AsyncStorage.setItem('pick_up_address', newState.pickupLocation);
      } else {
        let newState = {
          screen: screen,
          dropoffLocationData: data,
          dropoffLocation: addressComponent,
          dropoffLocationError: '',
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
    }
  };
  pressHandler = async () => {
    // console.log('data: ', data);
    // debugger;
    // if (this.state.deliveryAddress != '') {
    // if (this.state.locationData?.results) {
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
      let payload = Object.assign(this.state.payload, {
        // pick_up_location: {
        //   type: 'Point',
        //   coordinates: [
        //     this.state.locationData.results[0].geometry.location.lat,
        //     this.state.locationData.results[0].geometry.location.lng,
        //   ],
        // },
        // drop_of_location: {
        //   type: 'Point',
        //   coordinates: [
        //     this.state.locationData.results[0].geometry.location.lat,
        //     this.state.locationData.results[0].geometry.location.lng,
        //   ],
        // },
        pick_up_location: {
          type: 'Point',
          coordinates: [
            this.state.pickupLocationData.results
              ? this.state.pickupLocationData.results[0].geometry.location.lat
              : this.state.pickupLocationData.location.latitude,
            this.state.pickupLocationData.results
              ? this.state.pickupLocationData.results[0].geometry.location.lng
              : this.state.pickupLocationData.location.longitude,
          ],
        },
        drop_of_location: {
          type: 'Point',
          coordinates: [
            this.state.dropoffLocationData.results
              ? this.state.dropoffLocationData.results[0].geometry.location.lat
              : this.state.dropoffLocationData.location.latitude,
            this.state.dropoffLocationData.results
              ? this.state.dropoffLocationData.results[0].geometry.location.lng
              : this.state.dropoffLocationData.location.longitude,
          ],
        },
        comments: this.state.specificInstruction,
        discount_code: this.state.promoCode,
      });
      console.log('final payload: ', payload);
      await AppService.createPurchase(payload)
        .then(res => {
          console.log('create Purchase : ', res);
          if (res.data.status) {
            // this.props.navigation.navigate('RequestDriver');
            this.requestDriverScreen(res);
          } else {
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
    }
    // } else {
    //   let payload = Object.assign(this.state.payload, {
    //     pick_up_location: {
    //       type: 'Point',
    //       coordinates: [
    //         this.state.locationData.location.latitude,
    //         this.state.locationData.location.longitude,
    //       ],
    //     },
    //     drop_of_location: {
    //       type: 'Point',
    //       coordinates: [
    //         this.state.locationData.location.latitude,
    //         this.state.locationData.location.longitude,
    //       ],
    //     },
    //     comments: this.state.specificInstruction,
    //     discount_code: this.state.promoCode,
    //   });
    //   console.log('final payload: ', payload);
    //   try {
    //     await AppService.createPurchase(payload)
    //       .then(res => {
    //         console.log('create Purchase: ', res);
    //         if (res.data.status) {
    //           AsyncStorage.setItem('PurchaseID', res.data._id);
    //           AsyncStorage.setItem('PickUpLocation', res.data.pick_up_location);
    //           AsyncStorage.setItem(
    //             'DropOffLocation',
    //             res.data.drop_of_location,
    //           );
    //           this.setState({ loading: false });
    //           this.props.navigation.navigate('RequestDriver');
    //         } else {
    //           this.setState({ loading: false });
    //           Snackbar.show({
    //             text: res.data.message,
    //             duration: Snackbar.LENGTH_LONG,
    //           });
    //         }
    //       })
    //       .catch(error => {
    //         console.log('error: ', error);
    //         console.log('error.response: ', error.response);
    //         this.setState({ loading: false });
    //         Snackbar.show({
    //           text: error.response.data.message,
    //           duration: Snackbar.LENGTH_LONG,
    //         });
    //       });
    //   } catch (error) {
    //     console.log(error.response);
    //   }
    // }
    // } else {
    // }
  };

  requestDriverScreen = async res => {
    const pick_up = JSON.stringify(res.data.pick_up_location);
    const drop_of = JSON.stringify(res.data.drop_of_location);
    await AsyncStorage.setItem('PurchaseID', res.data._id);
    await AsyncStorage.setItem('pick_up_location', pick_up);
    await AsyncStorage.setItem('drop_of_location', drop_of);
    let newState = {
      loading: false,
    };
    this.setState(newState);
    this.props.navigation.navigate('RequestDriver', res.data);
  };

  render() {
    console.log('props from cart: ', this.props);
    // if (this.state.screen == 0) {
    return (
      <NativeBaseProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.gray,
          }}>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={{ marginBottom: '2%' }}
            enabled>
            <ScrollView style={{ marginBottom: '20%' }}>
              <View style={{ flex: 1 }}>
                <View style={styles.mainView}>
                  <View style={{ marginBottom: '15%' }}>
                    <Text style={styles.textStyle}>Enter Location</Text>
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
                        size={22}
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
                        size={22}
                        // style={{marginRight: '10%'}}
                      />
                    }
                    error={this.state.dropoffLocationError}
                  />

                  {/* <InputField
                      label={'Delivery Address'}
                      placeholder={'11/14 Garden Road, Street 12'}
                      value={this.state.deliveryAddress}
                      onFocus={() => this.screenHandler(1)}
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
                    /> */}

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
                </View>
              </View>
              {/* <View style={{top: this.state.deliveryAddress ? '30%' : '37%'}}> */}
            </ScrollView>
          </KeyboardAvoidingView>
          <Loader loading={this.state.loading} />
          <FooterButton
            style={styles.footerTabStyle}
            title="Request Driver"
            onPress={this.pressHandler}
            disabled={this.state.loading}
          />
        </View>
      </NativeBaseProvider>
    );
    // } else if (this.state.screen == 1) {
    //   return (
    //     // <Map
    //     //   handleScreen={(data, screen) => this.addressHandler(data, screen)}
    //     //   // pickupLocationData={this.state.payload.item_purchases.store}
    //     //   isFrom="PurchaseItemsService"
    //     // />
    //     <Map
    //       handleScreen={(data, screen) => this.addressHandler(data, screen)}
    //       locationType={this.state.locationType}
    //       pickupLocationData={
    //         this.state.locationType ? this.state.pickupLocationData : ''
    //       }
    //       // pickupLocation={this.state.payload.item_purchases.store}
    //     />
    //   );
    // }
  }
}

export default UserDeliveryInfo;
const styles = StyleSheet.create({
  mainView: {
    marginLeft: '10%',
    // marginRight: '10%',
    marginTop: '15%',
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
