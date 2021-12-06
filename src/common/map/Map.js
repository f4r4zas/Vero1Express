import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { NativeBaseProvider } from 'native-base';
import { colors } from '../../util/colors';
// import AutoComplete from '../../common/map/Autocomplete';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Autocomplete from '../../common/map/Autocomplete';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNGooglePlaces from 'react-native-google-places';
// import {textStyle} from 'styled-system';
import FooterButton from '../FooterButton';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = 1;

const GOOGLE_MAPS_APIKEY = 'AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g';
class Map extends Component {
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
      regionChange2: true,
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
    console.log('this.props: ', this.props);
    if (this.props.isFrom != 'PurchaseItemsService') {
      console.log(
        'this.props.pickupLocationData: ',
        this.props.pickupLocationData,
      );
      const place = this.props.pickupLocationData;
      if (place !== '' && place?.results) {
        let loc = place.results[0].geometry.location;
        var tempCords = {
          latitude: parseFloat(loc.lat),
          longitude: parseFloat(loc.lng),
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        };

        var fullAddress =
          place.results[0].address_components[0].long_name +
          ' ' +
          place.results[0].address_components[1].long_name +
          ' ' +
          place.results[0].address_components[3].long_name;

        this.setState({
          pickUp: place.name,
          pickUpAddress: fullAddress,
          pickLat: loc.lat,
          pickLong: loc.lng,
          regionChange1: false,
          regionChange2: false,
          initialPosition: {
            latitude: loc.lat,
            longitude: loc.lng,
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015,
          },
          origin: {
            latitude: loc.lat,
            longitude: loc.lng,
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,
          },

          // destination: {
          //   latitude: 0,
          //   longitude: 0,
          // },
          // locationData: place,
        });
      } else if (place !== '' && !place?.results) {
        var tempCords = {
          latitude: parseFloat(place.location.latitude),
          longitude: parseFloat(place.location.longitude),
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        };

        var fullAddress = place.address.slice(0, 39);

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

          // destination: {
          //   latitude: 0,
          //   longitude: 0,
          // },
          // locationData: place,
        });
      }
    }
    if (this.props.locationType === 'pickup') {
      this.getCurrentLocation();
    }
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

    var that = this;
    Geolocation.getCurrentPosition(
      position => {
        console.log('check', position);
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0015,
        };
        this.setState({ initialPosition: initialRegion });

        that.map.animateToRegion(initialRegion, 500);

        Geocoder.init('AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g');
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            console.log('json: ', json);
            var addressComponent = json.results[0].address_components;
            let lat = json.results[0].geometry.location.lat;
            let lng = json.results[0].geometry.location.lng;
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
          .catch(error => {
            console.log('error: ', error);
            console.log('error.response: ', error.response);
          });
      },
      error => {
        console.log('error: ', error);
        console.log('error.resp: ', error.response);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
        showLocationDialog: true,
      },
    );
  };

  openSearchModal1() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        console.log('See place:', place);

        var tempCords = {
          latitude: parseFloat(place.location.latitude),
          longitude: parseFloat(place.location.longitude),
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        };
        var fullAddress = place.address.slice(0, 39);
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
        console.log('drop off location: ', place);
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
          locationData: place,
        });
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.

        this.map.animateToRegion(tempCords, 2000);
        // setTimeout(() => {
        //   this.map.animateToRegion(this.state.origin, 2000);
        //   setTimeout(() => {
        //     // this.CreatePurchase();
        //     // this.props.navigation.navigate('carType');F
        //     // Actions.carType();
        //   }, 2000);
        // }, 2000);
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }
  confirmLocation = () => {};
  render() {
    if (this.state.screen == 1) {
      return (
        <NativeBaseProvider>
          <View style={{ flex: 1, backgroundColor: colors.gray }}>
            <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={this.state.initialPosition}
                // showsUserLocation={true}
                // showsMyLocationButton={true}
                showsCompass={true}
                toolbarEnabled={true}
                zoomEnabled={true}
                rotateEnabled={true}
                // moveOnMarkerPress={true}
                ref={map => (this.map = map)}
                onTouchStart={() =>
                  this.setState({
                    regionChange1: true,
                    // destination: {
                    //   latitude: 0,
                    //   longitude: 0,
                    // },
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
                {this.props.locationType === 'dropoff' ? (
                  <>
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
                    <MapViewDirections
                      origin={this.state.origin}
                      destination={this.state.destination}
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={5}
                      strokeColor={colors.primaryOrange}
                      optimizeWaypoints={true}
                      onStart={params => {
                        console.log(
                          `Started routing between "${params.origin}" and "${params.destination}"`,
                        );
                      }}
                    />
                  </>
                ) : null}
              </MapView>
              <View style={styles.topView}>
                <View style={styles.innerTopView}>
                  <View style={{ marginRight: 10 }}>
                    <Octicons
                      type="Octicons"
                      name="location"
                      size={26}
                      color="#fff"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.searchBarView}
                    onPress={() =>
                      this.props.locationType === 'dropoff'
                        ? ''
                        : this.openSearchModal1()
                    }>
                    <View>
                      <Text
                        style={[
                          styles.textStyle,
                          { color: '#fff', fontSize: 16, width: '95%' },
                        ]}>
                        {this.state.pickUp}
                      </Text>
                      <Text
                        style={[
                          styles.textStyle,
                          { color: '#fff', fontSize: 13 },
                        ]}>
                        {this.state.pickUpAddress + '...'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.props.locationType === 'dropoff' ? (
                  <View>
                    <View style={{ marginLeft: 9, marginBottom: 15 }}>
                      <View style={styles.dottedView2} />
                      <View style={styles.dottedView2} />
                      <View style={styles.dottedView2} />
                      <View style={styles.dottedView2} />
                      <View style={styles.dottedView2} />
                      <View style={styles.dottedView2} />
                      <View style={styles.dottedView2} />
                    </View>
                    <View style={styles.innerTopView}>
                      <View style={{ marginRight: 10 }}>
                        <Octicons
                          type="Octicons"
                          name="location"
                          size={26}
                          color="#fff"
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.searchBarView}
                        onPress={() => this.openSearchModal2()}>
                        <View>
                          <Text
                            style={[
                              styles.textStyle,
                              { color: '#fff', fontSize: 16, width: '95%' },
                            ]}>
                            {this.state.dropOff}
                          </Text>
                          <Text
                            style={[
                              styles.textStyle,
                              { color: '#fff', fontSize: 13 },
                            ]}>
                            {this.state.dropOffAddress + '...'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
              {this.props.locationType === 'pickup' ? (
                <View style={styles.locateIconView1}>
                  <TouchableOpacity onPress={() => this.getCurrentLocation()}>
                    <MaterialIcons
                      type="MaterialIcons"
                      name="my-location"
                      size={26}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                <FooterButton
                  title="Continue"
                  onPress={() =>
                    this.props.handleScreen(this.state.locationData, 0)
                  }
                  // disabled={this.state.loading}
                />
              </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Map);

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
    backgroundColor: colors.primaryOrange,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 22.5,
    right: '5%',
    bottom: '20%',
  },
  // locateIconView1: {
  //   width: 45,
  //   height: 45,
  //   backgroundColor: '#fdfbfc',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   position: 'absolute',
  //   borderRadius: 22.5,
  //   right: '5%',
  //   bottom: '45%',
  // },
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
    height: 'auto',
    borderRadius: 20,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,

    position: 'absolute',
    top: 50,
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
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];
