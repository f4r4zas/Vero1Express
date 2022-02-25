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

class ItemReturnsOrExchangeCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_pictureStatus: '',
      reciept_pictureStatus: '',
      loading: false,
      deliveryAddress: '',
      specificInstruction: '',
      promoCode: '',
      rideInProgress: false,
      isValid: false,
      error: false,
      item_product_image: '',
      reciept_product_image: '',
      openCamera: false,
      item_photo: null,
      reciept_photo: null,
      item_photoAppend: '',
      reciept_photoAppend: '',
      item_image_url: '',
      item_imageError: '',
      items: [
        // {
        //   brand: '',
        //   category: '/var/nodecodes/vero/public/uploads/1644537100485.jpg',
        //   color: '',
        //   date: '',
        //   return_type: '',
        //   size: '',
        //   sub_category: '/var/nodecodes/vero/public/uploads/1644537110911.jpg',
        //   weight: '',
        // },
      ],
      item_images: [
        // {
        //   image_uri:
        //     'file:///data/user/0/com.Vero1Express/cache/rn_imag…lib_temp_5f9cc3c7-195a-4f6d-a9d5-1fad1405e94a.jpg',
        // },
      ],
      reciept_images: [
        // {
        //   image_uri:
        //     'file:///data/user/0/com.Vero1Express/cache/rn_imag…lib_temp_87590be6-6e32-4496-896b-f318fc9978f9.jpg',
        // },
      ],
      reciept_imageError: '',
      reciept_image_url: '',
    };
  }

  componentDidMount() {
    console.log('this.props: ', this.props);
  }
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
  handleItemCamera = async () => {
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
            item_photo: '',
          };
          this.setState(newState);
        } else if (response.error) {
          // console.log('ImagePicker Error: ', response.error);
          Snackbar.show({
            text: response.error,
            duration: Snackbar.LENGTH_LONG,
          });
          let newState = {
            item_photot: '',
          };
          this.setState(newState);
        } else if (response.customButton) {
          // console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          // console.log('camera Response: ', response);
          // debugger;
          let item_photoStatus = response.assets[0];
          let newState = {
            item_photo: item_photoStatus,
            loading: true,
          };
          this.setState(newState);
          this.createItemFormData(item_photoStatus);
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
  createItemFormData = async (photo, body = {}) => {
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
            item_image_url: res.data.data.image_url,
            loading: false,
            item_imageError: '',
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

  handleRecieptCamera = async () => {
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
            reciept_photo: '',
          };
          this.setState(newState);
        } else if (response.error) {
          // console.log('ImagePicker Error: ', response.error);
          Snackbar.show({
            text: response.error,
            duration: Snackbar.LENGTH_LONG,
          });
          let newState = {
            reciept_photot: '',
          };
          this.setState(newState);
        } else if (response.customButton) {
          // console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          // console.log('camera Response: ', response);
          // debugger;
          let reciept_photoStatus = response.assets[0];
          let newState = {
            reciept_photo: reciept_photoStatus,
            loading: true,
          };
          this.setState(newState);
          this.createRecieptFormData(reciept_photoStatus);
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
  createRecieptFormData = async (photo, body = {}) => {
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
            reciept_image_url: res.data.data.image_url,
            loading: false,
            reciept_imageError: '',
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
      let payloadItemReturn = {
        service_type: 'item_return',
        payment_type: '1',
        item_return: {
          store: this.props.route.params.dropoffLocationData.results
            ? this.props.route.params.dropoffLocationData.plus_code
                .compound_code
            : this.props.route.params.dropoffLocationData.name,
          // reciept_image: this.state.recieptImage,
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
        comments: this.props.route.params.comments,
        discount_code: this.props.route.params.discount_code,
      };
      let payloadItemExchange = {
        service_type: 'item_exchange',
        payment_type: '1',
        item_exchange: {
          store: this.props.route.params.dropoffLocationData.results
            ? this.props.route.params.dropoffLocationData.plus_code
                .compound_code
            : this.props.route.params.dropoffLocationData.name,
          // reciept_image: this.state.recieptImage,
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
        comments: this.props.route.params.comments,
        discount_code: this.props.route.params.discount_code,
      };
      // console.log('payload out going: ', payload);
      this.requestDriverApi(
        this.props.route.params.selectedType == 'Item Return'
          ? payloadItemReturn
          : payloadItemExchange,
      );
    }
  };
  requestDriverApi = async payload => {
    console.log('payload: ', payload);
    await AppService.createPurchase(payload)
      .then(res => {
        console.log('requestDriverApi: ', res);
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
        let newState = {
          items: this.state.items,
          item_images: this.state.item_images,
          reciept_images: this.state.reciept_images,
        };
        // console.log('newState: ', newState);
        // debugger;

        this.setState(newState);
      }
    }
  };
  addParecls = async () => {
    let valid = true;
    const DriverID = await AsyncStorage.getItem('DriverID');
    if (DriverID) {
      valid = false;
      this.setState({ rideInProgress: true });
    }

    if (!this.state.item_image_url) {
      valid = false;
      this.setState({ item_imageError: '*Required!' });
    } else {
      this.setState({ item_imageError: '' });
    }

    if (!this.state.reciept_image_url) {
      valid = false;
      this.setState({ reciept_imageError: '*Required!' });
    } else {
      this.setState({ reciept_imageError: '' });
    }
    // debugger;
    if (valid) {
      let itemExchange = {
        reciept_image: this.state.reciept_image_url,
        // reciept_image: this.state.recieptImage,
        item_image: this.state.item_image_url,
        details: this.props.route.params.comments,
      };
      let itemReturn = {
        reciept_image: this.state.reciept_image_url,
        // reciept_image: this.state.recieptImage,
        item_image: this.state.item_image_url,
        details: this.props.route.params.comments,
      };
      this.state.item_images.push({ image_uri: this.state.item_photo.uri });
      this.state.reciept_images.push({
        image_uri: this.state.reciept_photo.uri,
      });

      this.state.items.push(
        this.props.route.params.selectedType == 'Item Return'
          ? itemReturn
          : itemExchange,
      );
      // console.log('item: ', newState);

      this.setState({
        items: this.state.items,
        item_image_url: '',
        item_photo: '',
        reciept_image_url: '',
        reciept_photo: '',
        recieptImage: this.state.reciept_image_url,
        item_images: this.state.item_images,
        reciept_images: this.state.reciept_images,
      });
    }
  };

  loadImage(itemImage) {
    const str = itemImage.split('/');
    const imgUrl = 'http://157.230.183.30:3000/uploads/' + str[6];
    console.log('imgUrl: ', imgUrl);
    return imgUrl;
  }
  render() {
    // console.log('this.props: ', this.props);
    console.log('this.state: ', this.state);
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.mainView}>
                <ScrollView
                  style={{ marginBottom: height / 35, height: hp(78) }}
                  // style={{ height: hp('80%') }}
                >
                  {/* <View> */}
                  {/* <View style={styles.mainView}> */}
                  <View
                    style={{
                      marginBottom: height / 30,
                      marginTop: mainView.marginTop,
                    }}>
                    <Text style={styles.textStyle}>Item Return or</Text>
                    <Text style={styles.textStyle}>Exchange</Text>
                  </View>
                  <FlatList
                    data={this.state.items}
                    keyExtractor={(item, index) => index + ''}
                    // ListEmptyComponent={EmptyListMessage}
                    // style={{ width: width / 1 }}
                    nestedScrollEnabled={true}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={[
                            styles.modalStyle,
                            {
                              width: width / 1.2,
                              // marginLeft: width,
                              flexDirection: 'row',
                            },
                          ]}>
                          <View style={{ marginRight: 10 }}>
                            <Image
                              resizeMode={'center'}
                              source={{
                                // uri: this.loadImage(item?.reciept_image),
                                uri: this.state.item_images[index].image_uri,
                                // uri: this.loadImage(
                                //   '/var/nodecodes/vero/public/uploads/1644538432679.jpg',
                                // ),
                              }}
                              style={{
                                width: width / 2.8,
                                height: height / 3.8,
                              }}
                            />
                          </View>
                          <View>
                            <Image
                              resizeMode={'center'}
                              source={{
                                uri: this.state.reciept_images[index].image_uri,
                                // uri: this.loadImage(item?.item_image),
                                // uri: this.loadImage(
                                //   '/var/nodecodes/vero/public/uploads/1644538432679.jpg',
                                // ),
                              }}
                              style={{
                                width: width / 2.8,
                                height: height / 3.8,
                              }}
                            />
                          </View>
                        </View>
                      );
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => this.handleItemCamera()}
                    style={{ marginTop: height / 20, flexDirection: 'row' }}>
                    {this.state.item_imageError ? (
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
                              width: width / 1.5,
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
                              color: this.state.item_image_url
                                ? 'green'
                                : colors.secondaryGray,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              color: this.state.item_image_url
                                ? 'green'
                                : colors.secondaryGray,
                              fontSize: ASPECT_RATIO * 25,
                              marginTop: height / 80,
                              width: width / 1.5,
                              textDecorationLine: 'underline',
                            },
                          ]}>
                          {this.state.item_image_url
                            ? 'Picture Uploaded'
                            : 'Upload Item Picture'}{' '}
                        </Text>
                        {this.state.item_image_url ? (
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
                  <TouchableOpacity
                    onPress={() => this.handleRecieptCamera()}
                    style={{ marginTop: height / 50, flexDirection: 'row' }}>
                    {this.state.reciept_imageError ? (
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
                              width: width / 1.5,
                            },
                          ]}>
                          Upload Receipt Picture{' '}
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
                              color: this.state.reciept_image_url
                                ? 'green'
                                : colors.secondaryGray,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              color: this.state.reciept_image_url
                                ? 'green'
                                : colors.secondaryGray,
                              fontSize: ASPECT_RATIO * 25,
                              marginTop: height / 80,
                              width: width / 1.5,
                              textDecorationLine: 'underline',
                            },
                          ]}>
                          {this.state.reciept_image_url
                            ? 'Receipt Uploaded'
                            : 'Upload Receipt Picture'}{' '}
                        </Text>
                        {this.state.reciept_image_url ? (
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
                  {/* </View> */}
                </ScrollView>
              </View>
            </View>
          </View>
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
                item_imageError: '',
                reciept_imageError: '',
              })
            }
          />
        ) : null}
      </NativeBaseProvider>
    );
  }
}

export default ItemReturnsOrExchangeCheckout;
const styles = StyleSheet.create({
  mainView: mainView,
  textStyle: headingTextStyle,
  footerTabStyle: footerButtonStyle,
  cameraButton: {
    paddingTop: height / 100,
    fontSize: ASPECT_RATIO * 45,
  },
  modalStyle: {
    height: height / 3.2,
    marginBottom: '2%',
    width: '100%',
    // backgroundColor: colors.primaryOrange,
    // borderRadius: 20,
    // elevation: 5,
    // padding: '5%',
  },
});
