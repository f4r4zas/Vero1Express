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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ASPECT_RATIO,
  colors,
  fontSize,
  footerButtonStyle,
  headingTextStyle,
  height,
  mainView,
  width,
} from '../../util/colors';
import FooterButton from '../../common/FooterButton';
import SelectField from '../../common/SelectField';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ParcelProductCard from '../../common/ParcelProductCard';
import Camera from '../../common/Camera';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AppService from '../../services/AppService';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import SessionExpireModal from '../../common/SessionExpireModal';

class PackagePickupAndDeliveryCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureStatus: '',
      loading: false,
      deliveryAddress: '',
      specificInstruction: '',
      promoCode: '',
      rideInProgress: false,
      isValid: false,
      error: false,
      packageType: [
        { name: 'Parcel', value: 'Parcel' },
        { name: 'Documents', value: 'Documents' },
      ],
      itemWeights: [
        { name: '5', value: '5' },
        { name: '10', value: '10' },
        { name: '15', value: '15' },
        { name: '20', value: '20' },
      ],
      fragile: [
        { name: 'No', value: 'No' },
        { name: 'Yes', value: 'Yes' },
      ],
      size: [
        { name: 'Small', value: 'Small' },
        { name: 'Medium', value: 'Medium' },
        { name: 'Large', value: 'Large' },
      ],
      selectedSize: '',
      selectedSizeError: '',
      selectedFragile: '',
      selectedFragileError: '',
      selectedItemWeight: '',
      selectedItemWeightError: '',
      selectedPackageType: '',
      selectedPackageTypeError: '',
      product_image: '',
      openCamera: false,
      photo: null,
      photoAppend: '',
      image_url: '',
      image_urlError: '',
      items: [
        // {
        //   package_type: 'Envelope',
        //   item_type: 'asdfa',
        //   // image_url: this.state.image_url,
        //   item_weight: '50',
        //   fragile: 'mo',
        //   size: 'fdas',
        // },
      ],
      images: [],
    };
  }

  componentDidMount() {}
  // addressHandler = field => {
  // console.log(field);
  // if (field === 'deliveryAddress') {
  // let newState = {deliveryAddress: e};
  // this.setState(newState);
  // }
  // };
  changeHandler = (e, field) => {
    // console.log(e);
    // debugger;
    if (field === 'selectedPackageType') {
      let newState = {
        selectedPackageType: e.name,
        selectedPackageTypeError: '',
      };
      this.setState(newState);
    } else if (field === 'selectedItemWeight') {
      let newState = {
        selectedItemWeight: e.name,
        selectedItemWeightError: '',
      };
      this.setState(newState);
    } else if (field === 'selectedFragile') {
      let newState = { selectedFragile: e.name, selectedFragileError: '' };
      this.setState(newState);
    } else if (field === 'selectedSize') {
      let newState = { selectedSize: e.name, selectedSizeError: '' };
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
    // console.log('granted: ', granted);
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
        // console.log('Response = ', response);
        if (response.didCancel) {
          // console.log('User cancelled image picker');
          let newState = {
            photot: '',
          };
          this.setState(newState);
        } else if (response.error) {
          // console.log('ImagePicker Error: ', response.error);
          Snackbar.show({
            text: response.error,
            duration: Snackbar.LENGTH_LONG,
          });
          let newState = {
            photot: '',
          };
          this.setState(newState);
        } else if (response.customButton) {
          // console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          // console.log('camera Response: ', response);
          // debugger;
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
    console.log('payload: ', photo1);
    await AppService.uploadImage(photo1)
      .then(res => {
        console.log('res uploadImage: ', res);

        if (res.data.status) {
          const newState = {
            image_url: res.data.data.image_url,
            loading: false,
            image_urlError: '',
          };
          this.setState(newState);
          Snackbar.show({
            text: 'Image Uploaded Successfully',
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          const error = res.data.data.message;
          const newState = {
            loading: false,
          };
          this.setState(newState);
          Snackbar.show({
            text: error,
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch(error => {
        // console.log('error: ', error);
        // console.log('error.response: ', error.response);
        this.setState({ loading: false });
        Snackbar.show({
          text: error.response.data.message,
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };
  pressHandler = async () => {
    let valid = true;
    if (this.state.items.length < 1) {
      valid = false;
      Snackbar.show({
        text: 'Please Add Package First!',
        duration: Snackbar.LENGTH_LONG,
      });
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
      // console.log('payload out going: ', payload);
      this.requestDriverApi(payload);
    }
  };
  requestDriverApi = async payload => {
    // console.log('payload: ', payload);
    await AppService.createPurchase(payload)
      .then(res => {
        // console.log('requestDriverApi: ', res);
        this.requestDriverScreen(res);
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
  cancelParcel = (item, index) => {
    // console.log('item: ', item);
    // console.log('items: ', this.state.items);
    for (let i = 0; i < this.state.items.length; i++) {
      if (index == i) {
        // let x = this.state.items[i];
        this.state.items.splice(i, 1);
        this.state.images.splice(i, 1);
        let newState = { items: this.state.items, images: this.state.images };
        // console.log('newState: ', newState);
        // debugger;

        this.setState(newState);
      }
    }
  };
  addParecls = async () => {
    // debugger;
    let valid = true;
    const DriverID = await AsyncStorage.getItem('DriverID');
    if (DriverID) {
      valid = false;
      this.setState({ rideInProgress: true });
    }

    if (!this.state.selectedPackageType) {
      valid = false;
      this.setState({ selectedPackageTypeError: '*Required!' });
    } else {
      this.setState({ selectedPackageTypeError: '' });
    }
    if (!this.state.selectedItemWeight) {
      valid = false;
      this.setState({ selectedItemWeightError: '*Required!' });
    } else {
      this.setState({ selectedItemWeightError: '' });
    }
    if (!this.state.selectedFragile) {
      valid = false;
      this.setState({ selectedFragileError: '*Required!' });
    } else {
      this.setState({ selectedFragileError: '' });
    }
    if (!this.state.selectedSize) {
      valid = false;
      this.setState({ selectedSizeError: '*Required!' });
    } else {
      this.setState({ selectedSizeError: '' });
    }
    if (!this.state.image_url) {
      valid = false;
      this.setState({ image_urlError: '*Required!' });
    } else {
      this.setState({ image_urlError: '' });
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
      };
      this.state.images.push({ image_uri: this.state.photo.uri });

      this.state.items.push(item);
      // console.log('item: ', newState);

      this.setState({
        items: this.state.items,
        selectedItemWeight: '',
        selectedPackageType: '',
        selectedSize: '',
        selectedFragile: '',
        image_url: '',
        photo: '',
        images: this.state.images,
      });
    }
  };
  render() {
    // console.log('this.props: ', this.props);
    // console.log('this.state: ', this.state);
    return (
      <NativeBaseProvider>
        <View style={{ backgroundColor: colors.gray }}>
          <ScrollView
            style={{ marginBottom: height / 35, height: hp(78) }}
            // style={{ height: hp('80%') }}
          >
            {/* <View> */}
            <View style={styles.mainView}>
              <View
                style={{
                  marginBottom: height / 30,
                  marginTop: mainView.marginTop,
                }}>
                <Text style={styles.textStyle}>Package Pickup</Text>
                <Text style={styles.textStyle}>& Delivery</Text>
              </View>
              <FlatList
                data={this.state.items}
                keyExtractor={(item, index) => index + ''}
                // ListEmptyComponent={EmptyListMessage}
                // style={{ width: width / 1 }}
                // nestedScrollEnabled={true}
                renderItem={({ item, index }) => {
                  // console.log('items: ', item);

                  return (
                    <View
                      style={{
                        width: width / 1.23,
                        marginLeft: width / 100,
                      }}>
                      <ParcelProductCard
                        cancelParcel={() => this.cancelParcel(item, index)}
                        packageType={item.item_type}
                        size={item.size}
                        itemWeight={item.item_weight}
                        product_image={
                          // 'http://157.230.183.30:3000/' + item.image_url
                          this.state.images[index].image_uri
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
                onChangeText={e => this.changeHandler(e, 'selectedPackageType')}
                dropDownData={this.state.packageType}
                error={this.state.selectedPackageTypeError}
              />
              <SelectField
                label={'Item Weight(Ibs)'}
                placeholder={'10'}
                value={this.state.selectedItemWeight}
                onChangeText={e => this.changeHandler(e, 'selectedItemWeight')}
                dropDownData={this.state.itemWeights}
                error={this.state.selectedItemWeightError}
              />
              <SelectField
                label={'Fragile'}
                placeholder={'No'}
                value={this.state.selectedFragile}
                onChangeText={e => this.changeHandler(e, 'selectedFragile')}
                dropDownData={this.state.fragile}
                error={this.state.selectedFragileError}
              />
              <SelectField
                label={'Size'}
                placeholder={'Medium'}
                value={this.state.selectedSize}
                onChangeText={e => this.changeHandler(e, 'selectedSize')}
                dropDownData={this.state.size}
                error={this.state.selectedSizeError}
              />
              <TouchableOpacity
                onPress={() => this.handleCamera()}
                style={{ marginTop: height / 20, flexDirection: 'row' }}>
                {this.state.image_urlError ? (
                  <>
                    <MaterialIcons
                      type="MaterialIcons"
                      name="camera-alt"
                      style={[
                        styles.cameraButton,
                        {
                          // borderColor: '#FF0000',
                          // borderWidth: 1,
                          color: '#FF0000',
                        },
                      ]}
                      // size={30}
                    />
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color: '#FF0000',
                          fontSize: ASPECT_RATIO * 25,
                          marginTop: height / 80,
                          // width: width / 3,
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      Upload Item Picture{' '}
                    </Text>
                    <Entypo
                      type="Entypo"
                      name={'cross'}
                      style={{
                        fontSize: headingTextStyle.fontSize,
                        marginTop: height / 80,
                      }}
                      color={'#FF0000'}
                    />
                  </>
                ) : (
                  <>
                    <MaterialIcons
                      type="MaterialIcons"
                      name="camera-alt"
                      style={[
                        styles.cameraButton,
                        {
                          color: this.state.image_url
                            ? 'green'
                            : colors.secondaryGray,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color: this.state.image_url
                            ? 'green'
                            : colors.secondaryGray,
                          fontSize: ASPECT_RATIO * 25,
                          marginTop: height / 80,
                          width: width / 3,
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      {this.state.image_url
                        ? 'Picture Uploaded'
                        : 'Upload Item Picture'}{' '}
                    </Text>
                    {this.state.image_url ? (
                      <Entypo
                        type="Entypo"
                        name={'check'}
                        style={{
                          fontSize: headingTextStyle.fontSize,
                          marginTop: height / 80,
                        }}
                        color={'green'}
                      />
                    ) : null}
                  </>
                )}
              </TouchableOpacity>
              {/* </View> */}
            </View>
          </ScrollView>
          <Loader loading={this.state.loading} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: height / 11,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.addParecls}
              style={{
                marginLeft: mainView.marginLeft,
                marginTop: height / 50,
              }}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    color: colors.primaryOrange,
                    textDecorationLine: 'underline',
                    fontSize: fontSize - 2,
                  },
                ]}>
                Add Parcel
              </Text>
            </TouchableOpacity>
            <View style={{ width: width / 1.2 }}>
              <FooterButton
                title="Proceed To Checkout"
                onPress={this.pressHandler}
                disabled={this.state.loading}
              />
            </View>
          </View>
        </View>
        {this.state.rideInProgress ? (
          <SessionExpireModal
            loading={this.state.rideInProgress}
            icon={null}
            text={'Ride is Already in Progress!'}
            button={'Ok'}
            handleButton={() =>
              this.setState({
                rideInProgress: false,
                selectedSizeError: '',
                selectedPackageTypeError: '',
                selectedItemWeightError: '',
                selectedFragileError: '',
                image_urlError: '',
              })
            }
          />
        ) : null}
      </NativeBaseProvider>
    );
  }
}

export default PackagePickupAndDeliveryCheckout;
const styles = StyleSheet.create({
  mainView: mainView,
  textStyle: headingTextStyle,
  footerTabStyle: footerButtonStyle,
  cameraButton: {
    paddingTop: height / 100,
    fontSize: ASPECT_RATIO * 45,
  },
});
