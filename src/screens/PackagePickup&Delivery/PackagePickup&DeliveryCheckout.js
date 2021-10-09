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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../util/colors';
import FooterButton from '../../common/FooterButton';
import SelectField from '../../common/SelectField';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ParcelProductCard from '../../common/ParcelProductCard';
import Camera from '../../common/Camera';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import AppService from '../../services/AppService';
import Loader from '../../common/Loader';

class PackagePickupAndDeliveryCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureStatus: '',
      loading: false,
      deliveryAddress: '',
      specificInstruction: '',
      promoCode: '',
      isValid: false,
      error: false,
      packageType: [
        {name: 'Parcel', value: 'Parcel'},
        {name: 'Documents', value: 'Documents'},
      ],
      itemWeights: [
        {name: '5', value: '5'},
        {name: '10', value: '10'},
        {name: '15', value: '15'},
        {name: '20', value: '20'},
      ],
      fragile: [
        {name: 'No', value: 'No'},
        {name: 'Yes', value: 'Yes'},
      ],
      size: [
        {name: 'Small', value: 'Small'},
        {name: 'Medium', value: 'Medium'},
        {name: 'Large', value: 'Large'},
      ],
      selectedSize: '',
      selectedFragile: '',
      selectedItemWeight: '',
      selectedPackageType: '',
      product_image: '',
      openCamera: false,
      photo: null,
      photoAppend: '',
      image_url: '',
      items: [],
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
    // debugger;
    if (field === 'selectedPackageType') {
      let newState = {selectedPackageType: e.name};
      this.setState(newState);
    } else if (field === 'selectedItemWeight') {
      let newState = {selectedItemWeight: e.name};
      this.setState(newState);
    } else if (field === 'selectedFragile') {
      let newState = {selectedFragile: e.name};
      this.setState(newState);
    } else if (field === 'selectedSize') {
      let newState = {selectedSize: e.name};
      this.setState(newState);
    }
  };
  handleCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App Permission for Camera',
        message: 'App requires permission to use camera',
        buttonNegative: 'Cancel',
        buttonPositive: 'Ok',
      },
    );
    console.log('granted: ', granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
          width: 500,
          height: 500,
          mediaType: 'photo',
          compressImageQuality: 0.5,
        },
      };
      await launchCamera(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
          let newState = {
            photot: '',
          };
          this.setState(newState);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          Snackbar.show({
            text: response.error,
            duration: Snackbar.LENGTH_LONG,
          });
          let newState = {
            photot: '',
          };
          this.setState(newState);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          let photoStatus = response.assets[0];
          let newState = {
            photo: photoStatus,
            loading: true,
          };
          this.setState(newState);
          this.createFormData(photoStatus);
        }
      });
    } else {
      // Alert.alert(item.tag, item.body, [
      //   {
      //     text: item.button1,
      //     onPress: () => onContinue(),
      //     style: item.button2,
      //   },
      //   {
      //     text: 'No',
      //     onPress: () => {
      //       setloading(false);
      //     },
      //   },
      // ]);
    }
  };
  createFormData = async (photo, body = {}) => {
    let photo1 = {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    };
    await AppService.uploadImage(photo1).then(res => {
      console.log('res uploadImage: ', res);

      if (res.data.status) {
        Snackbar.show({
          text: 'Image Uploaded Successfully',
          duration: Snackbar.LENGTH_LONG,
        });
        let newState = {
          image_url: res.data.data.image_url,
          loading: false,
        };
        this.setState(newState);
      } else {
        let error = res.data.data.message;
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_LONG,
        });
        let newState = {
          loading: false,
        };
        this.setState(newState);
      }
    });
    let newState = {
      loading: false,
    };
    this.setState(newState);
  };
  pressHandler = async () => {
    let valid = true;
    if (this.state.items.length < 1) {
      valid = false;
    }
    if (valid) {
      let newState = {
        loading: true,
      };
      this.setState(newState);
      let payload = {
        service_type: 'pick_up',
        payment_type: '1',
        drop_of_packages: {
          delivery_type: 'standard',
          items: this.state.items,
        },
        pick_up_location: {
          type: 'Point',
          coordinates: [
            this.props.route.params.pickupLocationData.results
              ? this.props.route.params.pickupLocationData.results[0].geometry
                  .location.lat
              : this.props.route.params.pickupLocationData.location.latitude,
            this.props.route.params.pickupLocationData.results
              ? this.props.route.params.pickupLocationData.results[0].geometry
                  .location.lng
              : this.props.route.params.pickupLocationData.location.longitude,
          ],
        },
        drop_of_location: {
          type: 'Point',
          coordinates: [
            this.props.route.params.dropoffLocationData.results
              ? this.props.route.params.dropoffLocationData.results[0].geometry
                  .location.lat
              : this.props.route.params.dropoffLocationData.location.latitude,
            this.props.route.params.dropoffLocationData.results
              ? this.props.route.params.dropoffLocationData.results[0].geometry
                  .location.lng
              : this.props.route.params.dropoffLocationData.location.longitude,
          ],
        },
      };
      console.log('payload out going: ', payload);
      this.requestDriverApi(payload);
    }
  };
  requestDriverApi = async payload => {
    await AppService.createPurchase(payload)
      .then(res => {
        console.log('requestDriverApi: ', res);
        let newState = {
          loading: false,
        };
        this.setState(newState);
        this.props.navigation.navigate('RequestDriver', res.data);
      })
      .catch(error => {
        console.log('error: ', error);
        console.log('error: ', error.response);
        let newState = {
          loading: false,
        };
        this.setState(newState);
      });
  };
  cancelParcel = (item, index) => {
    console.log('item: ', item);
    console.log('items: ', this.state.items);
    for (let i = 0; i < this.state.items.length; i++) {
      if (index == i) {
        // let x = this.state.items[i];
        this.state.items.splice(i, 1);
        let newState = {items: this.state.items};
        console.log('newState: ', newState);
        debugger;

        this.setState(newState);
      }
    }
  };
  addParecls = () => {
    debugger;
    let valid = true;
    if (!this.state.selectedPackageType) {
      valid = false;
    }
    if (!this.state.selectedItemWeight) {
      valid = false;
    }
    if (!this.state.selectedFragile) {
      valid = false;
    }
    if (!this.state.selectedSize) {
      valid = false;
    }
    if (!this.state.image_url) {
      valid = false;
    }
    if (valid) {
      // let newArray = [];
      let item = {
        package_type: 'Envelope',
        item_type: this.state.selectedPackageType,
        image_url: this.state.image_url,
        item_weight: this.state.selectedItemWeight,
        fragile: this.state.selectedFragile,
        size: this.state.selectedSize,
        // image_uri: this.state.photo.uri,
      };
      this.state.items.push(item);
      // console.log('item: ', newState);

      this.setState({items: this.state.items});
    }
  };
  render() {
    console.log('this.state.items: ', this.props);
    return (
      <NativeBaseProvider>
        <View style={{flex: 1, backgroundColor: colors.gray}}>
          <View style={{flex: 1}}>
            <View style={styles.mainView}>
              <ScrollView style={{height: hp('80%')}}>
                <View style={{marginBottom: hp('5%')}}>
                  <Text style={styles.textStyle}>Package Pickup</Text>
                  <Text style={styles.textStyle}>& Delivery</Text>
                </View>
                <FlatList
                  data={this.state.items}
                  keyExtractor={(item, index) => index + ''}
                  // ListEmptyComponent={EmptyListMessage}
                  renderItem={({item, index}) => {
                    console.log('items: ', item);
                    return (
                      <View style={{width: hp('45%'), marginLeft: 5}}>
                        <ParcelProductCard
                          cancelParcel={() => this.cancelParcel(item, index)}
                          packageType={item.item_type}
                          size={item.size}
                          itemWeight={item.item_weight}
                          product_image={
                            'http://157.230.183.30:3000/' + item.image_url
                          }
                          fragile={item.fragile}
                        />
                      </View>
                    );
                  }}
                />

                <SelectField
                  label={'Package Type'}
                  placeholder={'Parcel'}
                  value={this.state.selectedPackageType}
                  onChangeText={e =>
                    this.changeHandler(e, 'selectedPackageType')
                  }
                  dropDownData={this.state.packageType}
                />
                <SelectField
                  label={'Item Weight(Ibs)'}
                  placeholder={'10'}
                  value={this.state.selectedItemWeight}
                  onChangeText={e =>
                    this.changeHandler(e, 'selectedItemWeight')
                  }
                  dropDownData={this.state.itemWeights}
                />
                <SelectField
                  label={'Fragile'}
                  placeholder={'No'}
                  value={this.state.selectedFragile}
                  onChangeText={e => this.changeHandler(e, 'selectedFragile')}
                  dropDownData={this.state.fragile}
                />
                <SelectField
                  label={'Size'}
                  placeholder={'Medium'}
                  value={this.state.selectedSize}
                  onChangeText={e => this.changeHandler(e, 'selectedSize')}
                  dropDownData={this.state.size}
                />
                <TouchableOpacity
                  onPress={() => this.handleCamera()}
                  style={{marginTop: hp('3%'), flexDirection: 'row'}}>
                  <MaterialIcons
                    type="MaterialIcons"
                    name="camera-alt"
                    style={styles.cameraButton}
                    // size={30}
                  />
                  <Text
                    style={[
                      styles.textStyle,
                      {
                        fontSize: 14,
                        color: colors.secondaryGray,
                        marginTop: hp('1.3%'),
                        marginLeft: hp('1.3%'),
                        textDecorationLine: 'underline',
                      },
                    ]}>
                    Upload Item Picture
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            {/* {this.state.openCamera ? <Camera /> : null} */}
            <Loader loading={this.state.loading} />
            {/* <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={{width: 10}}>
                <FooterButton
                  title="Proceed To Checkout"
                  onPress={this.pressHandler}
                  disabled={this.state.loading}
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.textStyle,
                    {color: colors.primaryOrange, fontSize: 14},
                  ]}>
                  Add Parcel
                </Text>
              </View>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.addParecls}
                style={{marginLeft: '10%', marginTop: '2%'}}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: colors.primaryOrange,
                      textDecorationLine: 'underline',
                      fontSize: 15,
                    },
                  ]}>
                  Add Parcel
                </Text>
              </TouchableOpacity>
              <View style={{width: '80%'}}>
                <FooterButton
                  title="Proceed To Checkout"
                  onPress={this.pressHandler}
                  disabled={this.state.loading}
                />
              </View>
            </View>
          </View>
        </View>
      </NativeBaseProvider>
    );
  }
}

export default PackagePickupAndDeliveryCheckout;
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
  cameraButton: {
    // borderStyle: 'dashed',
    borderColor: colors.secondaryGray,
    borderWidth: 1,
    color: colors.secondaryGray,
    padding: hp('1%'),
    // paddingTop: hp('1.5%'),
    width: wp('9%'),
    fontSize: hp('3%'),
    borderRadius: 30,
    borderStyle: 'dashed',
  },
});
