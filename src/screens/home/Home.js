import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
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
import Zocial from 'react-native-vector-icons/Zocial';
import Octicons from 'react-native-vector-icons/Octicons';
import { colors } from '../../util/colors';
import { style } from 'styled-system';
// import { showNotification } from '../../notification.android';
import notificationManager from '../../NotificationManager';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleModal1: styles.modalStyle,
      styleModal2: styles.modalStyle,
      styleModal3: styles.modalStyle,
    };
    this.localNotify = null;
    this.senderID = '931509373457';
  }

  componentDidMount() {
    // this.localNotify = notificationManager;

    notificationManager.configure(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
      this.senderID,
    );
  }
  onRegister = token => {
    console.log('Notification, onRegister: ', token);
  };
  onNotification = notify => {
    console.log('Notification, onNotification: ', notify);
  };
  onOpenNotification = notify => {
    console.log('Notification, onOpenNotification: ', notify);
    alert('open Notification');
  };
  onPressCancelNotification = () => {
    notificationManager.cancelAllLocalNotificaion();
  };
  onPressSendNotification = () => {
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true,
    };

    notificationManager.showNotification(
      1,
      'App Notification',
      'Local Notification',
      {},
      options,
    );
  };
  render() {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          <View style={{ flex: 1 }}>
            <View style={styles.mainView}>
              <View style={{ marginBottom: '20%' }}>
                <Text style={styles.textStyle}>Select Type of</Text>
                <Text style={styles.textStyle}>Service You Need</Text>
              </View>
              <TouchableOpacity
                style={this.state.styleModal1}
                activeOpacity={0.8}
                onPress={() => {
                  let newState = {
                    styleModal1: styles.modalStyleOnPress,
                    styleModal2: styles.modalStyle,
                    styleModal3: styles.modalStyle,
                  };
                  this.setState(newState, () => {});
                  this.props.navigation.navigate('Store');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignSelf: 'center',
                  }}>
                  <View>
                    <Text style={styles.modalText}>Item Purchase</Text>
                    <Text
                      style={[
                        styles.modalText,
                        { fontWeight: 'normal', fontSize: 14, marginTop: 4 },
                      ]}>
                      Purchase without waste
                    </Text>
                  </View>
                  <View>
                    <Zocial
                      name="cart"
                      color={colors.primaryOrange}
                      size={40}
                    />
                    {/* <Image
                      // resizeMode={'center'}
                      source={require('../../assets/vero-logo.png')}
                      style={styles.logoStyle}
                    /> */}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.state.styleModal2}
                activeOpacity={0.8}
                onPress={() => {
                  let newState = {
                    styleModal2: styles.modalStyleOnPress,
                    styleModal1: styles.modalStyle,
                    styleModal3: styles.modalStyle,
                  };
                  this.setState(newState, () => {});
                  this.props.navigation.navigate('PackagePickupAndDelivery');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignSelf: 'center',
                  }}>
                  <View>
                    <Text style={styles.modalText}>
                      Package Pickup & Delivery
                    </Text>
                    <Text
                      style={[
                        styles.modalText,
                        { fontWeight: 'normal', fontSize: 14, marginTop: 4 },
                      ]}>
                      Purchase without waste
                    </Text>
                  </View>
                  <View>
                    <Octicons
                      // onPress={handleLogOut}
                      name="package"
                      color={colors.primaryOrange}
                      size={40}
                      // style={{mar}}
                    />
                    {/* <Image
                      // resizeMode={'center'}
                      source={require('../../assets/vero-logo.png')}
                      style={styles.logoStyle}
                    /> */}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.state.styleModal3}
                activeOpacity={0.8}
                onPress={() => {
                  let newState = {
                    styleModal3: styles.modalStyleOnPress,
                    styleModal2: styles.modalStyle,
                    styleModal1: styles.modalStyle,
                  };
                  this.setState(newState, () => {});
                  this.onPressSendNotification();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignSelf: 'center',
                  }}>
                  <View>
                    <Text style={styles.modalText}>Item Return / Exchange</Text>
                    <Text
                      style={[
                        styles.modalText,
                        { fontWeight: 'normal', fontSize: 14, marginTop: 4 },
                      ]}>
                      Purchase without waste
                    </Text>
                  </View>
                  <View>
                    <Zocial
                      // onPress={handleLogOut}
                      name="cart"
                      color={colors.primaryOrange}
                      size={40}
                      // style={{mar}}
                    />
                    {/* <Image
                      // resizeMode={'center'}
                      source={require('../../assets/vero-logo.png')}
                      style={styles.logoStyle}
                    /> */}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </NativeBaseProvider>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  mainView: {
    margin: '10%',
    // marginLeft: '10%',
    // marginTop: '10%',
    backgroundColor: colors.gray,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  logoStyle: {
    // height: 60,
    resizeMode: 'contain',
    width: 60,
    // margin: -12,
  },
  modalStyle: {
    // flexDirection: 'row',

    // height: 160,
    // margin: '1%',
    marginBottom: '5%',
    width: '100%',
    // justifyContent: 'space-between',
    backgroundColor: colors.gray,
    borderRadius: 15,
    alignSelf: 'center',
    // borderColor: '#ff8800',
    // borderWidth: 3,
    borderRadius: 40,
    elevation: 5,
    padding: '12%',
  },
  modalStyleOnPress: {
    // flexDirection: 'row',

    // height: 160,
    // margin: '1%',
    marginBottom: '5%',
    width: '100%',
    // justifyContent: 'space-between',
    backgroundColor: colors.gray,
    borderRadius: 15,
    alignSelf: 'center',
    borderColor: colors.primaryOrange,
    borderWidth: 3,
    borderRadius: 40,
    elevation: 5,
    padding: '12%',
  },
  modalInnerView: {
    // alignSelf: 'left',
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.darkGrey,
  },
});
