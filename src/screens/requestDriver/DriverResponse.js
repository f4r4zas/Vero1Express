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
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { NativeBaseProvider } from 'native-base';
import { colors } from '../../util/colors';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import Geocoder from 'react-native-geocoding';
// import Geolocation from '@react-native-community/geolocation';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import RNGooglePlaces from 'react-native-google-places';
// import { textStyle } from 'styled-system';
// import FooterButton from '../../common/FooterButton';
import Loader from '../../common/Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import StartCar from '../../assets/StartMarkerV1Car.png';
import DestinationMarker from '../../assets/mark-green.png';
import { firebase } from '../../services/firebaseConfig';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const db = firebase.database();

const { width, height } = Dimensions.get('window');

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
class DriverResponse extends Component {
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
      driverLocation: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.8,
        longitudeDelta: LATITUDE_DELTA,
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
      requestDriverResponse: '',
      loading: true,
      DriverId: '',
      DriverName: '',
      DriverNumber: '',
      DriverProfile: '',
      DriverStatus: '',
      DriverLatitude: '',
      DriverLongitude: '',
      rideDetailsToggle: true,
      locationChildKey: '',
      locationSubChildKey: '',
    };
  }

  componentDidMount() {
    this.gettingMapReady();
  }
  componentDidUpdate() {}
  fireDBCon = async () => {
    const PurchaseId = await AsyncStorage.getItem('PurchaseID');
    let purchasesChildKey = '';
    let locationChildKey = '';
    let customerDropLocation = '';
    await db
      .ref()
      .child('purchases')
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.val().purchase_id == PurchaseId) {
            customerDropLocation = childSnapshot.val().drop_of_location;
          }
        });
      });
    await db
      .ref()
      .child('purchases')
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.val().purchase_id == PurchaseId) {
            purchasesChildKey = childSnapshot.key;
          }
        });
      });

    await db
      .ref()
      .child('purchases_location')
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.key == purchasesChildKey) {
            locationChildKey = childSnapshot.key;
          }
        });
      });
    let newState = {
      purchasesChildKey: purchasesChildKey,
      locationChildKey: locationChildKey,
      customerDropLocation: customerDropLocation,
    };
    this.setState(newState);
  };
  updateMap = async () => {
    // this.setState({
    //   prevAngle: this.state.newAngle,
    // });
    if (!this.state.locationChildKey) {
      await this.fireDBCon();
    } else {
      let locationSubChildKey = '';
      await db
        .ref()
        .child('purchases_location')
        .child(this.state.locationChildKey)
        .once('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            if (childSnapshot.key) {
              locationSubChildKey = childSnapshot.key;
              this.setState({ locationSubChildKey: locationSubChildKey });
            }
          });
        });
      if (this.state.locationSubChildKey) {
        const driverCoordsRefs = db
          .ref()
          .child('purchases_location')
          .child(this.state.locationChildKey)
          .child(this.state.locationSubChildKey)
          .on('value', (snapshot, prevChildKey) => {
            const pck = prevChildKey;
            const driveLocationInfo = snapshot.val();
            console.log('driveLocationInfo.lat: ' + driveLocationInfo.lat);
            console.log('driveLocationInfo.long: ' + driveLocationInfo.long);
            this.animate(
              driveLocationInfo?.lat,
              driveLocationInfo?.long,
              snapshot?.key,
            );
          });
      }
    }
    // if (Platform.OS === 'android') {
    //   if (this.marker) {
    //     this.marker._component.animateMarkerToCoordinate(
    //       this.state.carCoordinate,
    //       duration,
    //     );
    //     // this.map.animateMarkerToCoordinate(this.state.carCoordinate, duration);
    //     this.setState({
    //       Startcoordinate: {
    //         latitude: 24.903458,
    //         longitude: 67.114732,
    //       },
    //     });
    //   }
    // } else {
    // }
  };
  animate(DLatNum, DLongNum, key) {
    const duration = 300;
    const newState = {
      driverLocation: {
        latitude: DLatNum ? DLatNum : this.state.DriverLatitude,
        longitude: DLongNum ? DLongNum : this.state.DriverLongitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      DriverLatitude: DLatNum,
      DriverLongitude: DLongNum,
      prevChildKey: key ? key : '',
    };
    this.setState(newState);
  }
  // handleScreen = screen => {
  //   let newState = {
  //     screen: screen,
  //   };
  //   this.setState(newState);
  // };

  // onLocChange = region => {
  //   if (this.props.Title == 'homeScreen') {
  //     if (this.state.regionChange1) {
  //       var lat = parseFloat(region.latitude);
  //       var long = parseFloat(region.longitude);
  //       console.log('change latlng: ', lat, long);

  //       // if (this.props.Title == 'homeScreen') {
  //       //   var ULat = region.latitude.toString();
  //       //   var ULong = region.longitude.toString();

  //       //   AsyncStorage.setItem('UserLat1', ULat);
  //       //   AsyncStorage.setItem('UserLong1', ULong);

  //       //   console.log('region change ULat ULong:', ULat, ULong);
  //       // }

  //       var initialRegion2 = {
  //         latitude: lat,
  //         longitude: long,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       };
  //       this.setState({
  //         // regionChange1: false,
  //         initialPosition: initialRegion2,
  //         pickLat: lat,
  //         pickLong: long,
  //         origin: {
  //           latitude: lat,
  //           longitude: long,
  //           latitudeDelta: 0.08,
  //           longitudeDelta: LATITUDE_DELTA,

  //           destination: {
  //             latitude: 0,
  //             longitude: 0,
  //           },
  //         },
  //       });

  //       Geocoder.init('AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g');
  //       Geocoder.from(region.latitude, region.longitude)
  //         .then(json => {
  //           // console.log(json);
  //           console.log('Json: ', json);
  //           var addressComponent = json.results[0].address_components;
  //           console.log('Address: ', addressComponent);
  //           // console.log("Address: ", addressComponent[0].long_name);
  //           // console.log("Address: ", addressComponent[1].long_name);
  //           var fullAddress = addressComponent[1].long_name.slice(0, 39);
  //           // AsyncStorage.setItem('address', addressComponent[0].long_name);
  //           // AsyncStorage.setItem('fullAddress', fullAddress);

  //           this.setState({
  //             pickUp: addressComponent[0].long_name,
  //             pickUpAddress: addressComponent[1].long_name,
  //             // firstLoc: false
  //           });
  //         })
  //         .catch(error => {
  //           console.warn(error);
  //         });
  //     }
  //   }
  // };
  toggleRideDetails = () => {
    const newState = {
      rideDetailsToggle: !this.state.rideDetailsToggle,
    };
    this.setState(newState);
  };
  gettingMapReady = async () => {
    const DriverStatus = await AsyncStorage.getItem('RideStatus');
    const DriverName = await AsyncStorage.getItem('DriverName');
    const DriverId = await AsyncStorage.getItem('DriverID');
    const Driver_Latitude = await AsyncStorage.getItem('DriverLat');
    const Driver_Longitude = await AsyncStorage.getItem('DriverLong');
    const DriverNumber = await AsyncStorage.getItem('DriverNumber');
    const DriverProfile = await AsyncStorage.getItem('DriverProfile');
    const pick_up = await AsyncStorage.getItem('pick_up_location');
    const drop_of = await AsyncStorage.getItem('drop_of_location');
    const pick_up_location = JSON.parse(pick_up);
    const drop_of_location = JSON.parse(drop_of);
    const DriverLatitude = parseFloat(Driver_Latitude);
    const DriverLongitude = parseFloat(Driver_Longitude);
    console.log('DriverStatus: ', DriverStatus);
    console.log('DriverName: ', DriverName);
    console.log('DriverId: ', DriverId);
    console.log('DriverLatitude: ', DriverLatitude);
    console.log('DriverLongitude: ', DriverLongitude);
    console.log('DriverNumber: ', DriverNumber);
    console.log('DriverProfile: ', DriverProfile);
    // const requestDriverResponse = this.props.route?.params;
    if (DriverId) {
      let newState = {
        // pickUp: place.name,
        // pickUpAddress: fullAddress,
        pickLat: pick_up_location.coordinates[0],
        pickLong: pick_up_location.coordinates[1],
        regionChange1: true,
        regionChange2: true,
        initialPosition: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: 0.08,
          longitudeDelta: LATITUDE_DELTA,
        },

        destination: {
          latitude: drop_of_location.coordinates[0],
          longitude: drop_of_location.coordinates[1],
        },
        dropLat: drop_of_location.coordinates[0],
        dropLong: drop_of_location.coordinates[1],
        // requestDriverResponse: requestDriverResponse,
        DriverId: DriverId ? DriverId : '',
        DriverName: DriverName ? DriverName : '',
        DriverNumber: DriverNumber ? DriverNumber : '',
        DriverProfile: DriverProfile ? DriverProfile : '',
        DriverStatus: DriverStatus ? DriverStatus : '',
        DriverLatitude: DriverLatitude ? DriverLatitude : '',
        DriverLongitude: DriverLongitude ? DriverLongitude : '',
        driverLocation: {
          latitude: DriverLatitude ? DriverLatitude : 0,
          longitude: DriverLongitude ? DriverLongitude : 0,
          latitudeDelta: 0.08,
          longitudeDelta: LATITUDE_DELTA,
        },
      };
      this.setState(newState);
      if (DriverStatus == 'Driver has started ride') {
        let newState = {
          // pickUp: place.name,
          // pickUpAddress: fullAddress,
          pickLat: pick_up_location.coordinates[0],
          pickLong: pick_up_location.coordinates[1],
          regionChange1: true,
          regionChange2: true,
          initialPosition: {
            latitude: pick_up_location.coordinates[0],
            longitude: pick_up_location.coordinates[1],
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015,
          },
          origin: {
            latitude: pick_up_location.coordinates[0],
            longitude: pick_up_location.coordinates[1],
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,
          },

          destination: {
            latitude: drop_of_location.coordinates[0],
            longitude: drop_of_location.coordinates[1],
          },
          dropLat: drop_of_location.coordinates[0],
          dropLong: drop_of_location.coordinates[1],
          // requestDriverResponse: requestDriverResponse,
          DriverId: DriverId ? DriverId : '',
          DriverName: DriverName ? DriverName : '',
          DriverNumber: DriverNumber ? DriverNumber : '',
          DriverProfile: DriverProfile ? DriverProfile : '',
          DriverStatus: DriverStatus ? DriverStatus : '',
          DriverLatitude: DriverLatitude ? DriverLatitude : '',
          DriverLongitude: DriverLongitude ? DriverLongitude : '',
          driverLocation: {
            latitude: DriverLatitude ? DriverLatitude : 0,
            longitude: DriverLongitude ? DriverLongitude : 0,
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,
          },
        };
        this.setState(newState);
        this.map.animateToCoordinate(newState.origin, 5000);
        this.interval = setInterval(() => this.updateMap(), 5000);
      } else if (DriverStatus == 'Driver has cancelled the ride') {
        const Driver_Status = await AsyncStorage.removeItem('RideStatus');
        const Driver_Name = await AsyncStorage.removeItem('DriverName');
        const Driver_Id = await AsyncStorage.removeItem('DriverID');
        const Driver_Latitude = await AsyncStorage.removeItem('DriverLat');
        const Driver_Longitude = await AsyncStorage.removeItem('DriverLong');
        const Driver_Number = await AsyncStorage.removeItem('DriverNumber');
        const Driver_Profile = await AsyncStorage.removeItem('DriverProfile');
        const screen = await AsyncStorage.removeItem('screen');
        const purchase_id = await AsyncStorage.removeItem('PurchaseID');
        let newState = {
          // pickUp: place.name,
          // pickUpAddress: fullAddress,
          pickLat: pick_up_location.coordinates[0],
          pickLong: pick_up_location.coordinates[1],
          regionChange1: true,
          regionChange2: true,
          initialPosition: {
            latitude: pick_up_location.coordinates[0],
            longitude: pick_up_location.coordinates[1],
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015,
          },
          origin: {
            latitude: pick_up_location.coordinates[0],
            longitude: pick_up_location.coordinates[1],
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,
          },

          destination: {
            latitude: drop_of_location.coordinates[0],
            longitude: drop_of_location.coordinates[1],
          },
          dropLat: drop_of_location.coordinates[0],
          dropLong: drop_of_location.coordinates[1],
          // requestDriverResponse: requestDriverResponse,
          loading: false,
        };
        this.setState(newState);
        this.interval = clearInterval(1000);
      } else if (DriverStatus == 'Driver has ended ride') {
        const Driver_Status = await AsyncStorage.removeItem('RideStatus');
        const Driver_Name = await AsyncStorage.removeItem('DriverName');
        const Driver_Id = await AsyncStorage.removeItem('DriverID');
        const Driver_Latitude = await AsyncStorage.removeItem('DriverLat');
        const Driver_Longitude = await AsyncStorage.removeItem('DriverLong');
        const Driver_Number = await AsyncStorage.removeItem('DriverNumber');
        const Driver_Profile = await AsyncStorage.removeItem('DriverProfile');
        const screen = await AsyncStorage.removeItem('screen');
        const purchase_id = await AsyncStorage.removeItem('PurchaseID');
        let newState = {
          // pickUp: place.name,
          // pickUpAddress: fullAddress,
          pickLat: pick_up_location.coordinates[0],
          pickLong: pick_up_location.coordinates[1],
          regionChange1: true,
          regionChange2: true,
          initialPosition: {
            latitude: pick_up_location.coordinates[0],
            longitude: pick_up_location.coordinates[1],
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015,
          },
          origin: {
            latitude: pick_up_location.coordinates[0],
            longitude: pick_up_location.coordinates[1],
            latitudeDelta: 0.08,
            longitudeDelta: LATITUDE_DELTA,
          },

          destination: {
            latitude: drop_of_location.coordinates[0],
            longitude: drop_of_location.coordinates[1],
          },
          dropLat: drop_of_location.coordinates[0],
          dropLong: drop_of_location.coordinates[1],
          // requestDriverResponse: requestDriverResponse,
          loading: false,
        };
        this.setState(newState);
        this.interval = clearInterval(1000);
      }
    } else {
      let newState = {
        // pickUp: place.name,
        // pickUpAddress: fullAddress,
        pickLat: pick_up_location.coordinates[0],
        pickLong: pick_up_location.coordinates[1],
        regionChange1: true,
        regionChange2: true,
        initialPosition: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: 0.08,
          longitudeDelta: LATITUDE_DELTA,
        },

        destination: {
          latitude: drop_of_location.coordinates[0],
          longitude: drop_of_location.coordinates[1],
        },
        dropLat: drop_of_location.coordinates[0],
        dropLong: drop_of_location.coordinates[1],
        // requestDriverResponse: requestDriverResponse,
        DriverId: DriverId ? DriverId : '',
        DriverName: DriverName ? DriverName : '',
        DriverNumber: DriverNumber ? DriverNumber : '',
        DriverProfile: DriverProfile ? DriverProfile : '',
        DriverStatus: DriverStatus ? DriverStatus : '',
        DriverLatitude: DriverLatitude ? DriverLatitude : '',
        DriverLongitude: DriverLongitude ? DriverLongitude : '',
        driverLocation: {
          latitude: DriverLatitude ? DriverLatitude : 0,
          longitude: DriverLongitude ? DriverLongitude : 0,
          latitudeDelta: 0.08,
          longitudeDelta: LATITUDE_DELTA,
        },
      };
      this.setState(newState);
    }
  };
  // checkPermission = async () => {
  //   const enabled = await messaging().hasPermission();
  //   if (enabled) {
  //     this.getToken();
  //   } else {
  //     this.requestPermission();
  //   }
  // };

  // //   //3
  // getToken = async () => {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');
  //   console.log('getToken called from Check.js', fcmToken);
  //   if (!fcmToken) {
  //     fcmToken = await messaging().getToken();
  //     if (fcmToken) {
  //       // user has a device token
  //       await AsyncStorage.setItem('fcmToken', fcmToken);
  //     }
  //   }
  // };
  // requestPermission = async () => {
  //   try {
  //     await messaging().requestPermission();
  //     // User has authorised
  //     this.getToken();
  //   } catch (error) {
  //     // User has rejected permissions
  //     console.log('permission rejected');
  //   }
  // };

  // openSearchModal1() {
  //   RNGooglePlaces.openAutocompleteModal()
  //     .then(place => {
  //       console.log('See place:', place);

  //       var ULat = place.location.latitude.toString();
  //       var ULong = place.location.longitude.toString();

  //       // AsyncStorage.setItem('UserLat1', ULat);
  //       // AsyncStorage.setItem('UserLong1', ULong);

  //       var tempCords = {
  //         latitude: parseFloat(place.location.latitude),
  //         longitude: parseFloat(place.location.longitude),
  //         latitudeDelta: 0.0015,
  //         longitudeDelta: 0.0015,
  //       };

  //       var fullAddress = place.address.slice(0, 39);
  //       // AsyncStorage.setItem('address', place.name);
  //       // AsyncStorage.setItem('fullAddress', fullAddress);

  //       this.setState({
  //         pickUp: place.name,
  //         pickUpAddress: fullAddress,
  //         pickLat: place.location.latitude,
  //         pickLong: place.location.longitude,
  //         regionChange1: false,
  //         regionChange2: false,
  //         initialPosition: {
  //           latitude: place.location.latitude,
  //           longitude: place.location.longitude,
  //           latitudeDelta: 0.0015,
  //           longitudeDelta: 0.0015,
  //         },
  //         origin: {
  //           latitude: place.location.latitude,
  //           longitude: place.location.longitude,
  //           latitudeDelta: 0.08,
  //           longitudeDelta: LATITUDE_DELTA,
  //         },

  //         destination: {
  //           latitude: 0,
  //           longitude: 0,
  //         },
  //         locationData: place,
  //       });
  //       // this.map.animateToCoordinate(tempCords, 1)
  //       this.map.animateToRegion(tempCords, 2000);
  //       // place represents user's selection from the
  //       // suggestions and it is a simplified Google Place object.
  //     })
  //     .catch(error => console.log(error.message)); // error is a Javascript Error object
  // }

  // openSearchModal2() {
  //   RNGooglePlaces.openAutocompleteModal()
  //     .then(place => {
  //       console.log('See place:', place);
  //       console.log('Address:', place.address);
  //       console.log('Drop Long:', place.location.longitude);
  //       console.log('Drop Lat:', place.location.latitude);

  //       var DLat = place.location.latitude.toString();
  //       var DLong = place.location.longitude.toString();

  //       console.log('openSearchModal2 DLat DLong:', DLat, DLong);

  //       // AsyncStorage.setItem('DropLat', DLat);
  //       // AsyncStorage.setItem('DropLong', DLong);

  //       var tempCords = {
  //         latitude: parseFloat(place.location.latitude),
  //         longitude: parseFloat(place.location.longitude),
  //         latitudeDelta: 0.0015,
  //         longitudeDelta: 0.0015,
  //       };

  //       var fullAddress = place.address.slice(0, 39);

  //       this.setState({
  //         regionChange1: false,
  //         // regionChange2: true,
  //         dropOff: place.name,
  //         dropOffAddress: fullAddress,
  //         dropLat: place.location.latitude,
  //         dropLong: place.location.longitude,
  //         destination: {
  //           latitude: place.location.latitude,
  //           longitude: place.location.longitude,
  //         },
  //         fakeMarkerAppearance: false,
  //       });
  //       // place represents user's selection from the
  //       // suggestions and it is a simplified Google Place object.

  //       this.map.animateToRegion(tempCords, 2500);

  //       // AsyncStorage.setItem('dropOff', place.name);
  //       // AsyncStorage.setItem('dropOffAddress', fullAddress);

  //       setTimeout(() => {
  //         this.map.animateToRegion(this.state.origin, 2000);
  //         setTimeout(() => {
  //           // this.CreatePurchase();
  //           // this.props.navigation.navigate('carType');F
  //           // Actions.carType();
  //         }, 2000);
  //       }, 2000);
  //     })
  //     .catch(error => console.log(error.message)); // error is a Javascript Error object
  // }

  // confirmLocation = () => {};

  render() {
    console.log('this.state: ', this.state);
    return (
      <NativeBaseProvider>
        <Image source={DestinationMarker} style={{ width: 0, height: 0 }} />
        <Image source={StartCar} style={{ width: 0, height: 0 }} />
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
                })
              }
              // onRegionChangeComplete={region => {
              //   this.onLocChange(region);
              // }}
              ref={ref => {
                this.map = ref;
              }}
              followsUserLocation={true}
              // customMapStyle={mapStyle}
            >
              <MapView.Marker.Animated
                coordinate={{
                  latitude: this.state.pickLat,
                  longitude: this.state.pickLong,
                }}
                title={'Pick Up'}
                description={'location'}
                pinColor="#ff8800"
              />
              <MapView.Marker.Animated
                coordinate={{
                  latitude: this.state.dropLat,
                  longitude: this.state.dropLong,
                }}
                title={'Drop off'}
                description={'location'}
                // pinColor="#ff8800"
                image={DestinationMarker}
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
              {this.state.DriverId ? (
                <>
                  <MapView.Marker.Animated
                    coordinate={{
                      latitude: this.state.DriverLatitude,
                      longitude: this.state.DriverLongitude,
                    }}
                    title={'Driver Location'}
                    description={'location'}
                    // pinColor="#ff8800"
                    flat={true}
                    onLoad={() => this.forceUpdate()}
                    image={StartCar}
                    ref={marker => {
                      this.marker = marker;
                    }}
                  />
                  <MapViewDirections
                    origin={this.state.driverLocation}
                    destination={this.state.origin}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={5}
                    strokeColor={colors.secondaryGray}
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
            {/* <View style={styles.topView}>
              <View style={styles.innerTopView}>
                <View style={{marginRight: 10}}>
                  <Octicons
                    type="Octicons"
                    name="location"
                    size={26}
                    color="#fff"
                  />
                </View>
                <View style={styles.searchBarView}>
                  <Text
                    style={[
                      styles.textStyle,
                      {color: '#fff', fontSize: 16, width: '95%'},
                    ]}>
                    {this.state.pickUp}
                  </Text>
                  <Text
                    style={[styles.textStyle, {color: '#fff', fontSize: 13}]}>
                    {this.state?.pickUpAddress + '...'}
                  </Text>
                </View>
              </View>
              <View>
                <View style={{marginLeft: 9, marginBottom: 15}}>
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                  <View style={styles.dottedView2} />
                </View>
                <View style={styles.innerTopView}>
                  <View style={{marginRight: 10}}>
                    <Octicons
                      type="Octicons"
                      name="location"
                      size={26}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.searchBarView}>
                    <Text
                      style={[
                        styles.textStyle,
                        {color: '#fff', fontSize: 16, width: '95%'},
                      ]}>
                      {this.state.dropOff}
                    </Text>
                    <Text
                      style={[styles.textStyle, {color: '#fff', fontSize: 13}]}>
                      {this.state?.dropOffAddress + '...'}
                    </Text>
                  </View>
                </View>
              </View>
            </View> */}
            <View style={styles.locateIconView1}>
              <TouchableOpacity onPress={() => this.toggleRideDetails()}>
                <MaterialIcons
                  type="MaterialIcons"
                  name="autorenew"
                  size={26}
                  color={colors.primaryOrange}
                />
              </TouchableOpacity>
            </View>
            {this.state.rideDetailsToggle ? (
              <View style={styles.driverStatusStyle}>
                <View style={{ marginBottom: 5 }}>
                  <Text style={[styles.textStyle, { fontSize: 16 }]}>
                    <Entypo
                      name="user"
                      // color={colors.primaryOrange}
                      size={14}
                      // style={{marginRight: '10%'}}
                    />{' '}
                    {this.state.DriverName
                      ? this.state.DriverName
                      : 'Driver Name Not Found!'}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.textStyle,
                      { fontSize: 14, color: colors.gray },
                    ]}>
                    <Entypo
                      name="mobile"
                      // color={colors.primaryOrange}
                      size={14}
                      // style={{marginRight: '10%'}}
                    />{' '}
                    {this.state.DriverNumber ? this.state.DriverNumber : null}
                  </Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    // bottom: 50
                  }}>
                  <Text style={[styles.textStyle, { color: colors.gray }]}>
                    ________________________________
                  </Text>
                </View>
                <View
                  style={[
                    styles.innerTopView,
                    { marginTop: '13%', paddingBottom: 5 },
                  ]}>
                  <View style={{ marginRight: 10 }}>
                    <Octicons
                      type="Octicons"
                      name="location"
                      size={26}
                      color="#fff"
                    />
                  </View>
                  <View style={[styles.innerTopView]}>
                    <Text style={[styles.textStyle, { fontSize: 12 }]}>
                      Est.{'  '}
                    </Text>
                    <Text
                      style={[
                        styles.textStyle,
                        { fontSize: 18, color: colors.gray },
                      ]}>
                      $50
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
          {/* <Loader
            loading={this.state.loading}
            text={'Searching for driver ...'}
          /> */}
        </View>
      </NativeBaseProvider>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DriverResponse);

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
    bottom: '35%',
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
  driverStatusStyle: {
    backgroundColor: colors.primaryOrange,
    alignSelf: 'center',
    width: '80%',
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
