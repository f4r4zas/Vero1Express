import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
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
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  ASPECT_RATIO,
  colors,
  headingTextStyle,
  height,
  mainView,
  veroLogoStyle,
  width,
} from '../../util/colors';
// import asyncStorage from '@react-native-community/async-storage';
import SessionExpireModal from '../../common/SessionExpireModal';
// import asyncStorage from '../../services/asyncStorage';
import Snackbar from 'react-native-snackbar';
import AppService from '../../services/AppService';
import Loader from '../../common/Loader';
const GOOGLE_MAPS_APIKEY = 'AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g';
// const window = Dimensions.get('window');
// const { width, height } = window;
const LATITUD_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUD_DELTA + width / height;
class JobDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSessionExpired: false,
      jobHistory: '',
      loading: true,
      jobItem: '',
      origin: '',
      destination: '',
      driverInfo: '',
      imgLinks: [],
      // update: true,
    };
    // this.renderUri().bind(this);
    this.renderUri = this.renderUri.bind(this);
  }
  componentDidMount() {
    // if (this.state.update) {
    this.setScreenData();
    // }
  }
  setScreenData = async () => {
    // this.setState({ loading: true });
    console.log('this.props: ', this.props.route.params.item);
    const origin = {
      latitude: this.props.route.params.item?.pick_up_location?.coordinates[0],
      longitude: this.props.route.params.item?.pick_up_location?.coordinates[1],
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
    };
    const destination = {
      latitude: this.props.route.params.item?.pick_up_location?.coordinates[0],
      longitude: this.props.route.params.item?.pick_up_location?.coordinates[1],
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
    };
    await AppService.getDriverInfo(this.props.route.params.item)
      .then(res => {
        const data = res.data;
        console.log('res data: ', data.data);
        if (data.status) {
          let newState = {
            driverInfo: data.data,
            jobItem: this.props.route.params.item,
            origin: origin,
            destination: destination,
            loading: false,
            // update: false,
          };
          this.setState(newState);
        } else {
          let newState = {
            loading: false,
            // update: false,
          };
          this.setState(newState);
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
    // this.setState({
    //   jobItem: this.props.route.params.item,
    //   origin: origin,
    //   destination: destination,
    // });
    // setTimeout(() => {
    //   this.map.animateToRegion(origin, 2500);
    // }, 2000);
    // setTimeout(() => {
    //   this.map.animateToRegion(destination, 2500);
    // }, 2000);
    setTimeout(() => {
      this.map.animateToRegion(
        {
          latitude:
            this.props.route.params.item?.pick_up_location?.coordinates[0],
          longitude:
            this.props.route.params.item?.pick_up_location?.coordinates[1],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        2500,
      );
    }, 2000);
  };
  cameltoUpperCase = myString => {
    var result;
    if (myString.includes('_')) {
      var frags = myString.split('_');
      for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    } else if (myString.includes(' ')) {
      var frags = myString.split(' ');
      for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    } else {
      result = myString.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
      // console.log(result.charAt(0).toUpperCase() + result.slice(1));
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
  };
  EmptyListMessage = () => {
    return (
      <>
        {this.state.loading ? null : (
          <View
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: '50%',
            }}>
            <Text
              style={[
                styles.textStyle,
                { textAlign: 'center', color: colors.secondaryGray },
              ]}>
              No Data Found!
            </Text>
          </View>
        )}
      </>
    );
  };
  renderUri(itemImage) {
    if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
      // debugger;
      const imageLink = 'https:' + itemImage;
      console.log('imageLink Making: ', imageLink);
      // this.state.imgLinks.push({ imgLink: imageLink });
      // this.setState({ imgLinks: this.state.imgLinks, update: false });
      return imageLink;
    } else {
      return itemImage;
    }
  }
  loadImage(itemImage) {
    const str = itemImage.split('/');
    const imgUrl = 'http://157.230.183.30:3000/uploads/' + str[6];
    console.log('imgUrl: ', imgUrl);
    return imgUrl;
  }
  render() {
    const { jobItem, origin, destination, driverInfo } = this.state;
    console.log('driver Info: ', driverInfo);
    return (
      <NativeBaseProvider>
        <View style={{ backgroundColor: colors.gray, flex: 1 }}>
          {/* <View> */}
          <View style={styles.mainView}>
            <ScrollView>
              <View
                style={{
                  marginBottom: height / 30,
                  marginLeft: mainView.marginLeft,
                }}>
                <Text style={styles.textStyle}>Job Detail</Text>
              </View>
              <View
                style={{
                  marginLeft: mainView.marginLeft,
                  marginRight: mainView.marginLeft,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[styles.modalText, { color: colors.primaryOrange }]}>
                    Service Type:
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: width / 30,
                        marginTop: height / 100,
                      },
                    ]}>
                    {jobItem?.service_type &&
                      this.cameltoUpperCase(jobItem?.service_type)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[styles.modalText, { color: colors.primaryOrange }]}>
                    Purchase Id:
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: width / 30,
                        marginTop: height / 100,
                      },
                    ]}>
                    {jobItem?._id}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[styles.modalText, { color: colors.primaryOrange }]}>
                    Amount:
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: width / 30,
                        marginTop: height / 100,
                      },
                    ]}>
                    ${jobItem?.fear_break_down?.total_amount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[styles.modalText, { color: colors.primaryOrange }]}>
                    Started at:
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: width / 30,
                        marginTop: height / 100,
                      },
                    ]}>
                    {jobItem?.created_at}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[styles.modalText, { color: colors.primaryOrange }]}>
                    Ended at:
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: width / 30,
                        marginTop: height / 100,
                      },
                    ]}>
                    {jobItem?.updated_at}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: height / 30 }}>
                {jobItem?.service_type === 'item_purchase' && (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: mainView.marginLeft,
                        marginRight: mainView.marginLeft,
                      }}>
                      <Text
                        style={[
                          styles.modalText,
                          { color: colors.primaryOrange },
                        ]}>
                        Store:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.modalText,
                          {
                            fontWeight: 'normal',
                            fontSize: width / 30,
                            marginTop: height / 100,
                          },
                        ]}>
                        {jobItem?.item_purchases?.store}
                      </Text>
                    </View>
                    <View>
                      <FlatList
                        data={driverInfo?.item_purchases?.items}
                        keyExtractor={(item, index) => index + ''}
                        ListEmptyComponent={this.EmptyListMessage}
                        // style={{ height: height / 1.5 }}
                        // nestedScrollEnabled={true}
                        renderItem={({ item, index }) => {
                          // const imgUrl = this.renderUri(
                          //   item?._id?.product_image,
                          // );
                          // console.log('imgUrl: ', imgUrl);
                          return (
                            <View style={{ flex: 1 }}>
                              <View style={styles.modalStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                  <View style={{ marginRight: 10 }}>
                                    <Image
                                      resizeMode={'center'}
                                      source={{
                                        uri: this.renderUri(
                                          item?._id?.product_image,
                                        ),
                                      }}
                                      style={{ flex: 1, width: 65, height: 60 }}
                                    />
                                  </View>
                                  <View>
                                    <View style={{ width: ASPECT_RATIO * 450 }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Id:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?._id?._id}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View style={{ width: ASPECT_RATIO * 450 }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Product:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                              //   width: 20,
                                            },
                                          ]}>
                                          {item?._id?.product_name}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View style={{ width: ASPECT_RATIO * 450 }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Price:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?._id?.product_price}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View style={{ width: ASPECT_RATIO * 450 }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Qty:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?.quantity}
                                        </Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        }}
                      />
                    </View>
                  </View>
                )}
                {jobItem?.service_type === 'pick_up' && (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: mainView.marginLeft,
                        marginRight: mainView.marginLeft,
                      }}>
                      <Text
                        style={[
                          styles.modalText,
                          { color: colors.primaryOrange },
                        ]}>
                        Delivery Type:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.modalText,
                          {
                            fontWeight: 'normal',
                            fontSize: width / 30,
                            marginTop: height / 100,
                          },
                        ]}>
                        {jobItem?.drop_of_packages?.delivery_type}
                      </Text>
                    </View>
                    <View>
                      <FlatList
                        data={jobItem?.drop_of_packages?.items}
                        keyExtractor={(item, index) => index + ''}
                        ListEmptyComponent={this.EmptyListMessage}
                        // style={{ height: height / 1.5 }}
                        nestedScrollEnabled={true}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={{ flex: 1 }}>
                              <View
                                style={styles.modalStyle}
                                activeOpacity={0.8}>
                                <View style={{ flexDirection: 'row' }}>
                                  <View style={{ marginRight: 10 }}>
                                    <Image
                                      resizeMode={'center'}
                                      source={{
                                        uri: this.loadImage(item?.image_url),
                                      }}
                                      style={{ width: 80, height: 70 }}
                                    />
                                  </View>
                                  <View>
                                    <View style={{ width: ASPECT_RATIO * 450 }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Id:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?._id}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Type:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?.item_type}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Size:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?.size}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Weight:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?.item_weight}
                                        </Text>
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={[
                                          styles.modalText,
                                          {
                                            fontSize: ASPECT_RATIO * 20,
                                            color: colors.primaryOrange,
                                          },
                                        ]}>
                                        Fragile:{' '}
                                        <Text
                                          style={[
                                            styles.modalText,
                                            {
                                              fontWeight: 'normal',
                                              fontSize: ASPECT_RATIO * 20,
                                              marginTop: height / 100,
                                            },
                                          ]}>
                                          {item?.fragile}
                                        </Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        }}
                      />
                    </View>
                  </View>
                )}

                {origin && destination ? (
                  <View style={{ width: width, height: height / 2 }}>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      // initialRegion={{
                      //   latitude: jobItem?.pick_up_location?.coordinates[0],
                      //   longitude: jobItem?.pick_up_location?.coordinates[1],
                      //   latitude_delta: 0.5,
                      //   longitude_delta: 0.5,
                      // }}

                      zoomEnabled={true}
                      followsUserLocation={true}
                      // onRegionChangeComplete={region => {
                      //   console.log('Region: ', region);
                      // }}
                      // region={{
                      //   latitude: jobItem?.pick_up_location?.coordinates[0],
                      //   longitude: jobItem?.pick_up_location?.coordinates[1],
                      //   latitudeDelta: 0.15,
                      //   longitudeDelta: 0.15,
                      // }}
                      ref={map => (this.map = map)}
                      ref={ref => {
                        this.map = ref;
                      }}>
                      <MapView.Marker.Animated
                        //   coordinate={origin}
                        coordinate={{
                          latitude: jobItem?.pick_up_location?.coordinates[0],
                          longitude: jobItem?.pick_up_location?.coordinates[1],
                        }}
                        title={'Pick Up'}
                        description={'location'}
                        pinColor="#ff8800"
                        // ref={map => (this.map = map)}
                        // ref={ref => {
                        //   this.map = ref;
                        // }}
                      />
                      <MapView.Marker.Animated
                        //   coordinate={destination}
                        coordinate={{
                          latitude: jobItem?.drop_of_location?.coordinates[0],
                          longitude: jobItem?.drop_of_location?.coordinates[1],
                        }}
                        title={'Pick Up'}
                        description={'location'}
                        pinColor="#ff8800"
                      />
                      <MapViewDirections
                        origin={{
                          latitude: jobItem?.pick_up_location?.coordinates[0],
                          longitude: jobItem?.pick_up_location?.coordinates[1],
                        }}
                        destination={{
                          latitude: jobItem?.drop_of_location?.coordinates[0],
                          longitude: jobItem?.drop_of_location?.coordinates[1],
                        }}
                        //   geodesic={true}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor={colors.primaryOrange}
                        optimizeWaypoints={true}
                        // optimizeWaypoints={true}
                      />
                    </MapView>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>
          <Loader loading={this.state.loading} />
          <SessionExpireModal loading={this.state.isSessionExpired} />
        </View>
      </NativeBaseProvider>
    );
  }
}

export default JobDetails;
const styles = StyleSheet.create({
  mainView: {
    marginTop: height / 13,
    backgroundColor: colors.gray,
  },
  textStyle: headingTextStyle,
  logoStyle: veroLogoStyle,
  modalStyle: {
    marginBottom: height / 100,
    marginTop: height / 100,
    marginLeft: width / 10,
    marginRight: width / 10,
    width: width / 1.1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: ASPECT_RATIO * 30,
    elevation: ASPECT_RATIO * 10,
    padding: ASPECT_RATIO * 25,
  },
  modalStyleOnPress: {
    marginBottom: height / 50,
    width: width / 1.2,
    backgroundColor: colors.gray,
    alignSelf: 'center',
    borderColor: colors.primaryOrange,
    borderWidth: width / 85,
    borderRadius: ASPECT_RATIO * 70,
    elevation: ASPECT_RATIO * 10,
    padding: ASPECT_RATIO * 70,
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: ASPECT_RATIO * 30,
    color: colors.darkGrey,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
