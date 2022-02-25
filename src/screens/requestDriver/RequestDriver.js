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
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import ReadMore from 'react-native-read-more-text';

import MapViewDirections from 'react-native-maps-directions';
import { NativeBaseProvider } from 'native-base';
import {
  ASPECT_RATIO,
  colors,
  currentLocationIcon,
  fontSize,
  height,
  locationCard,
  locationCardDottedLine,
  locationCardSearchBarView,
  locationInnerTopView,
  placeAddress,
  placeName,
  width,
} from '../../util/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../common/Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import StartCar from '../../assets/StartMarkerV1Car.png';
import DestinationMarker from '../../assets/mark-green.png';
import { firebase } from '../../services/firebaseConfig';
import SessionExpireModal from '../../common/SessionExpireModal';

const db = firebase.database();
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const LATITUDE = 24.9249479;
const LONGITUDE = 67.0832778;
const GOOGLE_MAPS_APIKEY = 'AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g';

var hasPermissionLocation = PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  {
    title: 'Location Permission',
    message: 'You must to accept this to make it work.',
  },
);
class RequestDriver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialPosition: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      destination: {
        latitude: '',
        longitude: '',
      },
      driverLocation: {
        latitude: '',
        longitude: '',
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      regionChange1: true,
      regionChange2: false,
      fakeMarkerAppearance: true,

      pickLat: 0,
      pickLong: 0,
      dropLat: 0,
      dropLong: 0,
      pickUp: 'Pick Up',
      pick_up_address: 'Pick up address',
      drop_of_address: 'Drop off address',
      dropOff: 'Drop Off',
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
      purchasesChildKey: '',
      toUpdate: false,
      paymentModal: false,
      isLoading: false,
      changeScreen: false,
    };
  }
  // backPressHandler = () => {
  //   Alert.alert(
  //     'Exit',
  //     'Are you sure you want to exit registration?',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       { text: 'OK', onPress: () => this.props.navigation.popToTop() },
  //     ],
  //     { cancelable: false },
  //   );
  //   return true;
  // };
  componentDidMount() {
    console.log('this.props: ', this.props);
    this.onFocusSubscribe = this.props.navigation.addListener(
      'focus',
      async () => {
        // this.CheckAliasInfo();
        this.gettingMapReady();
      },
    );
  }
  async componentDidUpdate() {
    if (this.state.toUpdate) {
      console.log('in else****');
      this.setState({ toUpdate: false });
      setTimeout(() => {
        this.gettingMapReady();
      }, 7000);
      // this.onFocusSubscribe = this.props.navigation.addListener(
      //   'focus',
      //   async () => {
      //     // this.CheckAliasInfo();
      // debugger;
      // this.interval = await clearInterval(0, () => {
      //   this.setState({ toUpdate: false });
      //   this.gettingMapReady();
      // });
      //   },
      // );
    }
    if (this.state.changeScreen) {
      setTimeout(() => {
        this.setState({ isLoading: false, changeScreen: false });
        console.log('settimeOute');
        clearInterval(this.interval);
        setTimeout(() => {
          this.props.navigation.navigate('Home');
        }, 1000);
      }, 2000);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    // this.interval = clearInterval(1000);
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
            purchasesChildKey = childSnapshot.key;
          }
        });
      });
    // await db
    //   .ref()
    //   .child('purchases')
    //   .once('value', snapshot => {
    //     snapshot.forEach(childSnapshot => {
    //       if (childSnapshot.val().purchase_id == PurchaseId) {
    //         purchasesChildKey = childSnapshot.key;
    //       }
    //     });
    //   });

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
      toUpdate: false,
    };
    this.setState(newState);
  };
  updateMap = async () => {
    // this.setState({
    //   prevAngle: this.state.newAngle,
    // });
    // debugger;
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
              // locationSubChildKey = locationSubChildKey;
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
            console.log('driveLocationInfo: ' + driveLocationInfo);
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
  };
  async animate(DLatNum, DLongNum, key) {
    console.log('Driver Latitude: ', DLatNum);
    console.log('Driver Longitude: ', DLongNum);
    console.log('prev child key: ', key);
    // console.log('intervalTracking: ', intervalTracking);
    console.log('this.interval: ', this.interval);
    const Drive_Status = await AsyncStorage.getItem('RideStatus');
    const DriverStatus = JSON.parse(Drive_Status);
    // debugger;
    if (DriverStatus == 'Driver has ended ride') {
      const DS = await AsyncStorage.removeItem('RideStatus');

      // this.interval = clearInterval(1000);
      clearInterval(this.interval);

      const duration = 3000;
      const newState = {
        driverLocation: {
          latitude: DLatNum ? DLatNum : this.state.DriverLatitude,
          longitude: DLongNum ? DLongNum : this.state.DriverLongitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        prevChildKey: key ? key : '',
        toUpdate: true,
        paymentModal: true,
      };
      this.setState(newState);
      // this.map.animateToRegion(newState.driverLocation, duration);
      this.marker.animateMarkerToCoordinate(newState.driverLocation, duration);
    } else {
      const duration = 3000;
      const newState = {
        driverLocation: {
          latitude: DLatNum ? DLatNum : this.state.DriverLatitude,
          longitude: DLongNum ? DLongNum : this.state.DriverLongitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        // DriverLatitude: DLatNum,
        // DriverLongitude: DLongNum,
        prevChildKey: key ? key : '',
      };
      this.setState(newState);
      // this.map.animateToRegion(newState.driverLocation, duration);
      this.marker.animateMarkerToCoordinate(newState.driverLocation, duration);
    }
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
  gettingMapReady = async region => {
    // console.log('this.state: ', this.state);
    const Drive_Status = await AsyncStorage.getItem('RideStatus');
    const Driver_Name = await AsyncStorage.getItem('DriverName');
    const Driver_Id = await AsyncStorage.getItem('DriverID');
    const Driver_Latitude = await AsyncStorage.getItem('DriverLat');
    const Driver_Longitude = await AsyncStorage.getItem('DriverLong');
    const Driver_Number = await AsyncStorage.getItem('DriverNumber');
    const DriverProfile = await AsyncStorage.getItem('DriverProfile');
    const pick_up = await AsyncStorage.getItem('pick_up_location');
    const drop_of = await AsyncStorage.getItem('drop_of_location');
    const pick_up_address = await AsyncStorage.getItem('pick_up_address');
    const drop_of_address = await AsyncStorage.getItem('drop_of_address');
    const PurchaseID = await AsyncStorage.getItem('PurchaseID');
    const DriverId = JSON.parse(Driver_Id);
    const DriverName = JSON.parse(Driver_Name);
    const DriverNumber = JSON.parse(Driver_Number);
    const pick_up_location = JSON.parse(pick_up);
    const drop_of_location = JSON.parse(drop_of);
    const DriverStatus = JSON.parse(Drive_Status);
    const DriverLatitude = Driver_Latitude
      ? JSON.parse(Driver_Latitude)
      : this.state.DriverLatitude;
    const DriverLongitude = Driver_Longitude
      ? JSON.parse(Driver_Longitude)
      : this.state.DriverLongitude;
    console.log('DriverStatus: ', DriverStatus);
    console.log('DriverName: ', DriverName);
    console.log('DriverId: ', DriverId);
    console.log('DriverLatitude: ', DriverLatitude);
    console.log('DriverLongitude: ', DriverLongitude);
    console.log('DriverNumber: ', DriverNumber);
    console.log('DriverProfile: ', DriverProfile);
    console.log('pick_up_address: ', pick_up_address);
    console.log('drop_of_address: ', drop_of_address);
    console.log('PurchaseID: ', PurchaseID);

    // const requestDriverResponse = this.props.route?.params;
    // debugger;
    if (DriverStatus == 'ride-accepted') {
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
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
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
          latitude: DriverLatitude ? DriverLatitude : this.state.DriverLatitude,
          longitude: DriverLongitude
            ? DriverLongitude
            : this.state.DriverLongitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        pick_up_address: pick_up_address,
        drop_of_address: drop_of_address,
        toUpdate: true,
      };
      this.setState(newState);
      await this.map.animateToRegion(newState.driverLocation, 700);
      // this.interval = setInterval(() => this.getDriverStatus(), 5000);
    } else if (DriverStatus == 'Driver has started ride') {
      // debugger;
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
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
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
          latitude: DriverLatitude ? DriverLatitude : this.state.DriverLatitude,
          longitude: DriverLongitude
            ? DriverLongitude
            : this.state.DriverLongitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        pick_up_address: pick_up_address,
        drop_of_address: drop_of_address,
        toUpdate: false,
      };
      this.setState(newState);
      await this.map.animateToRegion(newState.initialPosition, 700);
      this.interval = setInterval(() => this.updateMap(), 5000);
      // intervalTracking = this.interval;
      console.log('this.interval: ', this.interval);
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
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },

        destination: {
          latitude: drop_of_location.coordinates[0],
          longitude: drop_of_location.coordinates[1],
        },
        dropLat: drop_of_location.coordinates[0],
        dropLong: drop_of_location.coordinates[1],
        // requestDriverResponse: requestDriverResponse,
        loading: false,
        pick_up_address: pick_up_address,
        drop_of_address: drop_of_address,
        // loading: false,
        // toUpdate: true,
      };
      this.setState(newState);
      this.map.animateToRegion(newState.initialPosition, 700);
      // this.interval = setInterval(() => this.getDriverStatus(), 5000);

      clearInterval(this.interval);
      // this.interval = clearInterval(1000);
    } else if (DriverStatus == 'Driver has ended ride') {
      // const Driver_Status = await AsyncStorage.removeItem('RideStatus');
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
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        driverLocation: {
          latitude: DriverLatitude ? DriverLatitude : this.state.DriverLatitude,
          longitude: DriverLongitude
            ? DriverLongitude
            : this.state.DriverLongitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        destination: {
          latitude: drop_of_location.coordinates[0],
          longitude: drop_of_location.coordinates[1],
        },
        dropLat: drop_of_location.coordinates[0],
        dropLong: drop_of_location.coordinates[1],
        // requestDriverResponse: requestDriverResponse,
        loading: false,
        pick_up_address: pick_up_address,
        drop_of_address: drop_of_address,
        paymentModal: true,
        // loading: false,
        toUpdate: false,
      };
      this.setState(newState);
      this.map.animateToRegion(newState.initialPosition, 700);

      clearInterval(this.interval);
      // this.interval = clearInterval(1000);
    } else {
      // debugger;
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
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        origin: {
          latitude: pick_up_location.coordinates[0],
          longitude: pick_up_location.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },

        destination: {
          latitude: drop_of_location.coordinates[0],
          longitude: drop_of_location.coordinates[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
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
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        pick_up_address: pick_up_address,
        drop_of_address: drop_of_address,
        toUpdate: true,
      };
      this.setState(newState);
      this.map.animateToRegion(newState.initialPosition, 700);
      // this.interval = setInterval(() => this.getDriverStatus(), 5000);
    }
  };
  // getDriverStatus = async () => {
  //   const res = await AsyncStorage.getItem('RideStatus');
  //   debugger;
  //   if (res) {
  //     // this.props.navigation.addListener('transitionStart', () => {
  //     //   debugger;
  //     // this.interval = await clearInterval(0, () => {
  //     // this.gettingMapReady();
  //     this.setState({ toUpdate: true });
  //     // });
  //     // });
  //   }
  // };
  confirmPayment = async () => {
    // clearInterval(0,()=)
    const Driver_Name = await AsyncStorage.removeItem('DriverName');
    const Driver_Id = await AsyncStorage.removeItem('DriverID');
    const Driver_Latitude = await AsyncStorage.removeItem('DriverLat');
    const Driver_Longitude = await AsyncStorage.removeItem('DriverLong');
    const Driver_Number = await AsyncStorage.removeItem('DriverNumber');
    const Driver_Profile = await AsyncStorage.removeItem('DriverProfile');
    const screen = await AsyncStorage.removeItem('screen');
    const purchase_id = await AsyncStorage.removeItem('PurchaseID');
    const pick_up_address = await AsyncStorage.removeItem('pick_up_address');
    const drop_of_address = await AsyncStorage.removeItem('drop_of_address');
    // console.log('D Id on end ride: ', DriverId);
    this.setState({ paymentModal: false, isLoading: true, changeScreen: true });
  };
  _renderTruncatedFooter = () => {
    return;
  };
  render() {
    console.log('this.state: ', this.state);
    return (
      <NativeBaseProvider>
        <Image source={DestinationMarker} style={{ width: -10, height: -10 }} />
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
              moveOnMarkerPress={true}
              ref={map => (this.map = map)}
              onTouchStart={() =>
                this.setState({
                  regionChange1: true,
                })
              }
              // onRegionChangeComplete={region => {
              //   console.log('region: ', region);
              //   this.gettingMapReady(region);
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
                // ref={map => (this.map = map)}
                // ref={ref => {
                //   this.map = ref;
                // }}
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
                // ref={map => (this.map = map)}
                // ref={ref => {
                //   this.map = ref;
                // }}
              />
              <MapViewDirections
                origin={this.state.origin}
                destination={this.state.destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={5}
                strokeColor={colors.primaryOrange}
                optimizeWaypoints={true}
                optimizeWaypoints={true}
                // onStart={params => {
                // console.log(
                //   `Started routing between "${params.origin}" and "${params.destination}"`,
                // );
                // }}
              />
              {this.state.DriverId ? (
                <>
                  <MapView.Marker.Animated
                    coordinate={{
                      latitude: Number(this.state.driverLocation.latitude)
                        ? Number(this.state.driverLocation.latitude)
                        : Number(this.state.DriverLatitude),
                      longitude: Number(this.state.driverLocation.longitude)
                        ? Number(this.state.driverLocation.longitude)
                        : Number(this.state.DriverLongitude),
                    }}
                    title={'Driver Location'}
                    description={'location'}
                    // pinColor="#ff8800"
                    // flat={true}
                    // image={StartCar}
                    // flat={true}
                    onLoad={() => this.forceUpdate()}
                    // image={DestinationMarker}
                    pinColor="#ff8800"
                    // ref={map => (this.map = map)}
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
                    onStart={params =>
                      console.log(
                        `Started routing between ${this.state.driverLocation} and ${this.state.origin}  params: ${params}`,
                      )
                    }
                  />
                </>
              ) : null}
            </MapView>
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
              <>
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
                    <View style={styles.searchBarView}>
                      <Text style={[styles.textStyle, placeName]}>
                        {this.state.pickUp}
                      </Text>
                      <Text style={[styles.textStyle, placeAddress]}>
                        {this.state.pick_up_address + '...'}
                      </Text>
                    </View>
                  </View>
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
                      <View style={styles.searchBarView}>
                        <Text style={[styles.textStyle, placeName]}>
                          {this.state.dropOff}
                        </Text>

                        {/* <ReadMore
                          numberOfLines={1}
                          renderTruncatedFooter={this._renderTruncatedFooter}> */}
                        <Text
                          // numberOfLines={1}
                          // ellipsizeMode="tail"
                          style={[styles.textStyle, placeAddress]}>
                          {this.state.drop_of_address + '...'}
                        </Text>
                        {/* </ReadMore> */}
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.driverStatusStyle}>
                  {this.state.DriverId ? (
                    <>
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
                          {this.state.DriverNumber
                            ? this.state.DriverNumber
                            : null}
                        </Text>
                      </View>
                      {/* <View
                        style={{
                          position: 'absolute',
                          right: 0,
                          // bottom: 50
                        }}>
                        <Text
                          style={[styles.textStyle, { color: colors.gray }]}>
                          ______________________________
                        </Text>
                      </View> */}
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
                    </>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <ActivityIndicator size="large" color={'#fff'} />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: ASPECT_RATIO * 30,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Searching For Driver...
                      </Text>
                    </View>
                  )}
                </View>
              </>
            ) : null}
          </View>
          {/* <Loader
            loading={this.state.loading}
            text={'Searching for driver ...'}
          /> */}
          {this.state.paymentModal ? (
            // <View style={{ position: 'absolute' }}>
            <SessionExpireModal
              loading={this.state.paymentModal}
              icon={null}
              text={`Driver has ended ride! Your bill is $50`}
              button={'Ok'}
              handleButton={() => this.confirmPayment()}
            />
          ) : // </View>
          null}
          {this.state.isLoading ? (
            <Loader loading={this.state.isLoading} />
          ) : null}
        </View>
      </NativeBaseProvider>
    );
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
    bottom: '35%',
  },
  topView: locationCard,
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
  // locateIconView1: currentLocationIcon,
  // topView: locationCard,
  innerTopView: locationInnerTopView,
  dottedView2: locationCardDottedLine,
  searchBarView: locationCardSearchBarView,
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
