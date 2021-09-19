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
class ItemReturnsOrExchangeCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deliveryAddress: '',
      specificInstruction: '',
      promoCode: '',
      isValid: false,
      error: false,
    };
  }

  componentDidMount() {}
  addressHandler = field => {
    console.log(field);
    if (field === 'deliveryAddress') {
      // let newState = {deliveryAddress: e};
      // this.setState(newState);
    }
  };
  changeHandler = (e, field) => {
    console.log(e);
    if (field === 'specificInstruction') {
      let newState = {specificInstruction: e};
      this.setState(newState);
    } else if (field === 'promoCode') {
      let newState = {specificInstruction: e};
      this.setState(newState);
    }
  };
  pressHandler = async () => {};
  render() {
    return (
      <NativeBaseProvider>
        <View style={{flex: 1, backgroundColor: colors.gray}}>
          <View style={{flex: 1}}>
            <View style={styles.mainView}>
              <View style={{marginBottom: '15%'}}>
                <Text style={styles.textStyle}>Enter Location</Text>
              </View>
              <InputField
                label={'Delivery Address'}
                placeholder={'11/14 Garden Road, Street 12'}
                value={this.state.deliveryAddress}
                onFocus={() => this.addressHandler('deliveryAddress')}
                isValid={this.state.isValid}
                initialIcon={true}
                inputIconShow={true}
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
                onChangeText={e => this.changeHandler(e, 'specificInstruction')}
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
            <View style={{marginTop: '63%'}}>
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
  }
}

export default ItemReturnsOrExchangeCheckout;
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
