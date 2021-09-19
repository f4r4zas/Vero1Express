import React, {Component} from 'react';
import {connect} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {NativeBaseProvider} from 'native-base';
import {colors} from '../../util/colors';
import AutoComplete from '../../common/map/Autocomplete';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Autocomplete from '../../common/map/Autocomplete';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNGooglePlaces from 'react-native-google-places';
import {textStyle} from 'styled-system';
import FooterButton from '../../common/FooterButton';
import Entypo from 'react-native-vector-icons/Entypo';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = 1;

var hasPermissionLocation = PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  {
    title: 'Location Permission',
    message: 'You must to accept this to make it work.',
  },
);

const GOOGLE_MAPS_APIKEY = 'AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g';
class RequestDriver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      origin: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      destination: {
        latitude: 0,
        longitude: 0,
      },
      regionChange1: true,
      regionChange2: false,
      fakeMarkerAppearance: true,

      pickLat: 0,
      pickLong: 0,
      dropLat: 0,
      dropLong: 0,
      pickUp: 'Pick Up',
      pickUpAddress: 'Pick up address',
      dropOff: 'Drop Off',
      dropOffAddress: 'Drop off address',
      Token: '',
      screen: 1,
      locationData: '',
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  handleScreen = screen => {
    let newState = {
      screen: screen,
    };
    this.setState(newState);
  };

  onLocChange = region => {
    if (this.props.Title == 'homeScreen') {
      if (this.state.regionChange1) {
        var lat = parseFloat(region.latitude);
        var long = parseFloat(region.longitude);
        console.log('change latlng: ', lat, long);

        // if (this.props.Title == 'homeScreen') {
        //   var ULat = region.latitude.toString();
        //   var ULong = region.longitude.toString();

        //   AsyncStorage.setItem('UserLat1', ULat);
        //   AsyncStorage.setItem('UserLong1', ULong);

        //   console.log('region change ULat ULong:', ULat, ULong);
        // }

        var initialRegion2 = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState({
          // regionChange1: false,
          initialPosition: initialRegion2,
          pickLat: lat,
          pickLong: long,
          origin: {
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,

            destination: {
              latitude: 0,
              longitude: 0,
            },
          },
        });

        Geocoder.init('AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g');
        Geocoder.from(region.latitude, region.longitude)
          .then(json => {
            // console.log(json);
            console.log('Json: ', json);
            var addressComponent = json.results[0].address_components;
            console.log('Address: ', addressComponent);
            // console.log("Address: ", addressComponent[0].long_name);
            // console.log("Address: ", addressComponent[1].long_name);
            var fullAddress = addressComponent[1].long_name.slice(0, 39);
            // AsyncStorage.setItem('address', addressComponent[0].long_name);
            // AsyncStorage.setItem('fullAddress', fullAddress);

            this.setState({
              pickUp: addressComponent[0].long_name,
              pickUpAddress: addressComponent[1].long_name,
              // firstLoc: false
            });
          })
          .catch(error => {
            console.warn(error);
          });
      }
    }
  };

  getCurrentLocation = async () => {
    console.log('Get current location');

    // var that = this;

    // await Geolocation.setRNConfiguration(config);
    await Geolocation.getCurrentPosition(
      position => {
        console.log('check', position);
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);

        // if (this.props.Title == 'homeScreen') {
        //   var ULat = position.coords.latitude.toString();
        //   var ULong = position.coords.longitude.toString();

        //   AsyncStorage.setItem('UserLat1', ULat);
        //   AsyncStorage.setItem('UserLong1', ULong);
        // }

        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0015,
        };
        this.setState({initialPosition: initialRegion});

        this.map.animateToRegion(initialRegion, 500);

        Geocoder.init('AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g');
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            console.log('json: ', json);
            var addressComponent = json.results[0].address_components;
            let lat = json.results[0].geometry.location.lat;
            let lng = json.results[0].geometry.location.lng;
            // console.log("Address: ", addressComponent);
            // console.log("Address: ", addressComponent[0].long_name);
            // console.log("Address: ", addressComponent[1].long_name);

            // if (this.props.Title == 'homeScreen') {
            //   AsyncStorage.setItem('address', addressComponent[0].long_name);
            //   AsyncStorage.setItem(
            //     'fullAddress',
            //     addressComponent[1].long_name,
            //   );
            // }

            let newState = {
              pickUp: addressComponent[0].long_name,
              pickUpAddress: addressComponent[1].long_name,
              destination: {
                latitude: 0,
                longitude: 0,
              },
              pickLat: lat,
              pickLong: lng,
              locationData: json,
            };
            that.setState(newState);
          })
          .catch(error => console.warn(error));
      },
      error => console.log(JSON.stringify(error)),
      // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  openSearchModal1() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        console.log('See place:', place);

        var ULat = place.location.latitude.toString();
        var ULong = place.location.longitude.toString();

        // AsyncStorage.setItem('UserLat1', ULat);
        // AsyncStorage.setItem('UserLong1', ULong);

        var tempCords = {
          latitude: parseFloat(place.location.latitude),
          longitude: parseFloat(place.location.longitude),
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        };

        var fullAddress = place.address.slice(0, 39);
        // AsyncStorage.setItem('address', place.name);
        // AsyncStorage.setItem('fullAddress', fullAddress);

        this.setState({
          pickUp: place.name,
          pickUpAddress: fullAddress,
          pickLat: place.location.latitude,
          pickLong: place.location.longitude,
          regionChange1: false,
          regionChange2: false,
          initialPosition: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015,
          },
          origin: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,
          },

          destination: {
            latitude: 0,
            longitude: 0,
          },
          locationData: place,
        });
        // this.map.animateToCoordinate(tempCords, 1)
        this.map.animateToRegion(tempCords, 2000);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  openSearchModal2() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        console.log('See place:', place);
        console.log('Address:', place.address);
        console.log('Drop Long:', place.location.longitude);
        console.log('Drop Lat:', place.location.latitude);

        var DLat = place.location.latitude.toString();
        var DLong = place.location.longitude.toString();

        console.log('openSearchModal2 DLat DLong:', DLat, DLong);

        // AsyncStorage.setItem('DropLat', DLat);
        // AsyncStorage.setItem('DropLong', DLong);

        var tempCords = {
          latitude: parseFloat(place.location.latitude),
          longitude: parseFloat(place.location.longitude),
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        };

        var fullAddress = place.address.slice(0, 39);

        this.setState({
          regionChange1: false,
          // regionChange2: true,
          dropOff: place.name,
          dropOffAddress: fullAddress,
          dropLat: place.location.latitude,
          dropLong: place.location.longitude,
          destination: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          },
          fakeMarkerAppearance: false,
        });
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.

        this.map.animateToRegion(tempCords, 2500);

        // AsyncStorage.setItem('dropOff', place.name);
        // AsyncStorage.setItem('dropOffAddress', fullAddress);

        setTimeout(() => {
          this.map.animateToRegion(this.state.origin, 2000);
          setTimeout(() => {
            // this.CreatePurchase();
            // this.props.navigation.navigate('carType');F
            // Actions.carType();
          }, 2000);
        }, 2000);
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  confirmLocation = () => {};

  render() {
    if (this.state.screen == 1) {
      return (
        <NativeBaseProvider>
          <View style={{flex: 1, backgroundColor: colors.gray}}>
            <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={this.state.initialPosition}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                toolbarEnabled={true}
                zoomEnabled={true}
                rotateEnabled={true}
                // moveOnMarkerPress={true}
                onTouchStart={() =>
                  this.setState({
                    regionChange1: true,
                    destination: {
                      latitude: 0,
                      longitude: 0,
                    },
                  })
                }
                onRegionChangeComplete={region => {
                  this.onLocChange(region);
                }}
                ref={ref => {
                  this.map = ref;
                }}
                followsUserLocation={true}
                // customMapStyle={mapStyle}
              >
                <MapView.Marker.Animated
                  draggable
                  coordinate={{
                    latitude: this.state.pickLat,
                    longitude: this.state.pickLong,
                  }}
                  //onDragEnd={(e) => console.log('drag position: ', e.nativeEvent.coordinate)}
                  title={'Pick Up'}
                  description={'location'}
                  pinColor="#ff8800"
                  // calloutAnchor={(0.5, 0)}
                  // icon={<Icon type='FontAwesome5' name='car' />}
                  // icon={<FontAwesome5 style={{fontSize: 20}} name='car' />}
                  // image={require('./images/mark.png')}
                />
                <MapView.Marker.Animated
                  //draggable
                  coordinate={{
                    latitude: this.state.dropLat,
                    longitude: this.state.dropLong,
                  }}
                  //onDragEnd={(e) => console.log('drag position: ', e.nativeEvent.coordinate)}
                  title={'Drop off'}
                  description={'location'}
                  pinColor="#ff8800"
                />
              </MapView>
              <View style={styles.topView}>
                <View style={styles.innerTopView}>
                  <View style={{marginRight: 10}}>
                    <Octicons
                      type="Octicons"
                      name="location"
                      size={26}
                      color="#fff"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.searchBarView}
                    onPress={() => this.openSearchModal1()}>
                    <View>
                      <Text
                        style={[
                          styles.textStyle,
                          {color: '#fff', fontSize: 18},
                        ]}>
                        {this.state.pickUp}
                      </Text>
                      <Text
                        style={[
                          styles.textStyle,
                          {color: '#fff', fontSize: 14},
                        ]}>
                        {this.state.pickUpAddress + '...'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.driverStatusStyle}>
                <View>
                  <Text style={[styles.textStyle, {fontSize: 16}]}>
                    Searching for driver ...
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.textStyle,
                      {fontSize: 12, color: colors.gray},
                    ]}>
                    <Entypo
                      name="location-pin"
                      // color={colors.primaryOrange}
                      size={12}
                      // style={{marginRight: '10%'}}
                    />
                    location
                  </Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Text style={[styles.textStyle, {color: colors.gray}]}>
                    ____________________________
                  </Text>
                </View>
                <View style={[styles.innerTopView, {marginTop: '15%'}]}>
                  <View style={{marginRight: 10}}>
                    <Octicons
                      type="Octicons"
                      name="location"
                      size={26}
                      color="#fff"
                    />
                  </View>
                  <View style={[styles.innerTopView]}>
                    <Text style={[styles.textStyle, {fontSize: 12}]}>
                      Est.{'  '}
                    </Text>
                    <Text
                      style={[
                        styles.textStyle,
                        {fontSize: 18, color: colors.gray},
                      ]}>
                      $50
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View style={{position: 'absolute', right: 0, bottom: 0}}>
                <FooterButton
                  title="Continue"
                  onPress={() =>
                    this.props.handleScreen(this.state.locationData, 0)
                  }
                  disabled={this.state.loading}
                />
              </View> */}
            </View>
          </View>
        </NativeBaseProvider>
      );
    } else if (this.state.screen == 2) {
      return <Autocomplete />;
    }
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RequestDriver);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  locateIconView1: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 22.5,
    right: '5%',
    bottom: '25%',
  },
  locateIconView2: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 22.5,
    right: '5%',
    bottom: '50%',
  },
  locateIconView3: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 22.5,
    right: '5%',
    bottom: '43%',
  },
  topIconsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 10,
  },
  topView: {
    backgroundColor: colors.primaryOrange,
    alignSelf: 'center',
    width: '90%',
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,

    position: 'absolute',
    top: 50,
  },
  driverStatusStyle: {
    backgroundColor: colors.primaryOrange,
    alignSelf: 'center',
    width: '70%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'absolute',
    top: height / 1.5,
    right: 0,
  },
  innerTopView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-around',
    // width: '60%',
    // marginRight: 5,
    // marginBottom: 0,
  },
  locationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dottedView2: {
    backgroundColor: '#fff',
    width: 2,
    height: 2,
    borderRadius: 1,
    marginRight: 3,
    marginTop: 2,
  },
  searchBarView: {
    // padding: 6,
    // width: '90%',
    // backgroundColor: 'yellow',
  },
});

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];
