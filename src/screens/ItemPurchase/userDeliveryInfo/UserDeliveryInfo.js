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
import {colors} from '../../../util/colors';
import Snackbar from 'react-native-snackbar';
import FooterButton from '../../../common/FooterButton';
import InputField from '../../../common/InputField';
import Entypo from 'react-native-vector-icons/Entypo';
import Map from '../../../common/map/Map';

class UserDeliveryInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deliveryAddress: '',
      specificInstruction: '',
      promoCode: '',
      isValid: false,
      error: false,
      screen: 0,
      locationData: '',
      payload: '',
    };
  }

  componentDidMount() {
    let payload = this.props?.route?.params;
    let newState = {
      payload: payload,
    };
    this.setState(newState);
  }
  screenHandler = screen => {
    console.log(screen);
    // if (field === 'deliveryAddress') {
    let newState = {screen: screen};
    this.setState(newState);
    // }
  };
  addressHandler = (data, screen) => {
    // if (field === 'deliveryAddress')
    console.log('data: ', data);
    // debugger;
    if (data?.results) {
      let addressComponent = data.results[0].address_components;
      let newState = {
        screen: screen,
        locationData: data,
        deliveryAddress:
          addressComponent[0].long_name +
          ' ' +
          addressComponent[1].long_name +
          ' ' +
          addressComponent[3].long_name,
      };
      this.setState(newState);
    } else {
      let addressComponent = data.address;
      let newState = {
        screen: screen,
        locationData: data,
        deliveryAddress: addressComponent,
      };
      this.setState(newState);
    }
    // }
  };

  changeHandler = (e, field) => {
    console.log(e);
    if (field === 'specificInstruction') {
      let newState = {specificInstruction: e};
      this.setState(newState);
    } else if (field === 'promoCode') {
      let newState = {promoCode: e};
      this.setState(newState);
    }
  };
  pressHandler = async () => {
    // console.log('data: ', data);
    debugger;
    if (this.state.deliveryAddress != '') {
      if (this.state.locationData?.results) {
        let payload = Object.assign(this.state.payload, {
          pick_up_location: {},
          drop_of_location: {
            type: 'Point',
            coordinates: [
              this.state.locationData.results[0].geometry.location.lat,
              this.state.locationData.results[0].geometry.location.lng,
            ],
          },
          comments: this.state.specificInstruction,
          discount_code: this.state.promoCode,
        });
        console.log('final payload: ', payload);
        await AppService.createPurchase(payload).then(res => {
          console.log('create Purchase: ', res);
          if (res.data.status) {
            this.props.navigation.navigate('RequestDriver');
          } else {
          }
        });
      } else {
        let payload = Object.assign(this.state.payload, {
          pick_up_location: {
            type: 'Point',
            coordinates: [
              // this.state.locationData.location.latitude,
              // this.state.locationData.location.longitude,
            ],
          },
          drop_of_location: {
            type: 'Point',
            coordinates: [
              this.state.locationData.location.latitude,
              this.state.locationData.location.longitude,
            ],
          },
          comments: this.state.specificInstruction,
          discount_code: this.state.promoCode,
        });
        console.log('final payload: ', payload);
        try {
          await AppService.createPurchase(payload).then(res => {
            console.log('create Purchase: ', res);
            if (res.data.status) {
              this.props.navigation.navigate('RequestDriver');
            } else {
            }
          });
        } catch (error) {
          console.log(error.response);
        }
      }
    }
  };

  render() {
    console.log('props from cart: ', this.props);
    if (this.state.screen == 0) {
      return (
        <NativeBaseProvider>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.gray,
            }}>
            <View style={{flex: 1}}>
              <View style={styles.mainView}>
                <View style={{marginBottom: '15%'}}>
                  <Text style={styles.textStyle}>Enter Location</Text>
                </View>
                <InputField
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
                <InputField
                  label={'Promo Code'}
                  placeholder={'VERO$200'}
                  value={this.state.promoCode}
                  onChangeText={e => this.changeHandler(e, 'promoCode')}
                  isValid={this.state.isValid}
                  initialIcon={false}
                  inputIconShow={false}
                />
              </View>
              <View style={{top: this.state.deliveryAddress ? '30%' : '37%'}}>
                <FooterButton
                  title="Request Driver"
                  onPress={this.pressHandler}
                  disabled={this.state.loading}
                />
              </View>
            </View>
          </View>
        </NativeBaseProvider>
      );
    } else if (this.state.screen == 1) {
      return (
        <Map
          handleScreen={(data, screen) => this.addressHandler(data, screen)}
          // pickupLocation={this.state.payload.item_purchases.store}
        />
      );
    }
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
});
