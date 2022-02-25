import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
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
import asyncStorage from '../../services/asyncStorage';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleModal1: styles.modalStyle,
      styleModal2: styles.modalStyle,
      styleModal3: styles.modalStyle,
      isSessionExpired: false,
      handleScreen: false,
      navigateTo: false,
    };
  }
  componentDidMount() {
    this.getScreen();
  }
  sessionOutFun = async () => {
    clearInterval(1000);
    const clearAsyncStorage = await asyncStorage.clear();
    if (clearAsyncStorage == undefined) {
      this.props.navigation.replace('AuthNavigation');
    }
  };
  getScreen = async () => {
    const date = new Date();
    // console.log('date: ', date.toLocaleDateString());
    // if (date.getDate() >= 31 && date.getDate() <= 30) {
    // if (date.getDate() >= 31) {
    //   this.setState({ isSessionExpired: true });
    //   setTimeout(() => {
    //     this.sessionOutFun();
    //   }, 2000);
    // } else if (date.getDate() >= 1 && date.getDate() <= 22) {
    //   this.setState({ isSessionExpired: true });
    //   setTimeout(() => {
    //     this.sessionOutFun();
    //   }, 2000);
    // } else {
    let x = '';
    await asyncStorage.getItem('screen').then(res => {
      console.log('response Screen: ', res);
      if (res) {
        x = JSON.parse(res);
      }
    });
    console.log('Screen : ', x);
    // setScreen(x);
    if (x) {
      this.props.navigation.navigate(x);
    }
    // }
    // else if (date.getDate() >= 27) {
    //   this.setState({ isSessionExpired: true });
    //   setTimeout(() => {
    //     this.sessionOutFun();
    //   }, 2000);
    // }
  };
  // componentDidUpdate() {
  //   if (this.state.handleScreen) {
  //     console.log('this.props.navigation: ', this.props.navigation);
  //     this.props.navigation.addListener('focus', async () => {
  //       this.props.navigation.replace('RequestDriver', {
  //         params: { afterNotification: true },
  //       });
  //     });
  //   }
  // }

  onPressButton = val => {
    // debugger;
    if (val == '3') {
      const newState = {
        styleModal3: styles.modalStyleOnPress,
        styleModal2: styles.modalStyle,
        styleModal1: styles.modalStyle,
      };
      this.setState(newState);
      this.props.navigation.navigate('ItemReturnsOrExchange');
    } else if (val == '2') {
      const newState = {
        styleModal2: styles.modalStyleOnPress,
        styleModal1: styles.modalStyle,
        styleModal3: styles.modalStyle,
      };
      this.setState(newState);
      this.props.navigation.navigate('PackagePickupAndDelivery');
    } else if (val == '1') {
      let newState = {
        styleModal1: styles.modalStyleOnPress,
        styleModal2: styles.modalStyle,
        styleModal3: styles.modalStyle,
      };
      this.setState(newState);
      this.props.navigation.navigate('Store');
    }
  };
  render() {
    return (
      <NativeBaseProvider>
        <View style={{ backgroundColor: colors.gray, flex: 1 }}>
          {/* <View> */}
          <View style={styles.mainView}>
            <View
              style={{
                marginBottom: height / 20,
                marginLeft: mainView.marginLeft,
              }}>
              <Text style={styles.textStyle}>Select Type of</Text>
              <Text style={styles.textStyle}>Service You Need</Text>
            </View>
            <TouchableOpacity
              style={this.state.styleModal1}
              activeOpacity={0.8}
              onPress={() => this.onPressButton('1')}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.modalText}>Item Purchase</Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: ASPECT_RATIO * 25,
                        marginTop: height / 100,
                      },
                    ]}>
                    Purchase without waste
                  </Text>
                </View>
                <View>
                  <Zocial
                    name="cart"
                    color={colors.primaryOrange}
                    size={ASPECT_RATIO * 70}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={this.state.styleModal2}
              activeOpacity={0.5}
              onPress={() => this.onPressButton('2')}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.modalText}>
                    Package Pickup & Delivery
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: ASPECT_RATIO * 25,
                        marginTop: height / 100,
                      },
                    ]}>
                    Purchase without waste
                  </Text>
                </View>
                <View>
                  <Octicons
                    name="package"
                    color={colors.primaryOrange}
                    size={ASPECT_RATIO * 70}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={this.state.styleModal3}
              activeOpacity={0.5}
              onPress={() => this.onPressButton('3')}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.modalText}>Item Return / Exchange</Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        fontWeight: 'normal',
                        fontSize: ASPECT_RATIO * 25,
                        marginTop: height / 100,
                      },
                    ]}>
                    Purchase without waste
                  </Text>
                </View>
                <View>
                  <Zocial
                    name="cart"
                    color={colors.primaryOrange}
                    size={ASPECT_RATIO * 70}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* </View> */}
          <SessionExpireModal loading={this.state.isSessionExpired} />
        </View>
      </NativeBaseProvider>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  mainView: {
    marginTop: height / 9,
    backgroundColor: colors.gray,
  },
  textStyle: headingTextStyle,
  logoStyle: veroLogoStyle,
  modalStyle: {
    marginBottom: height / 50,
    width: width / 1.2,
    backgroundColor: colors.gray,
    alignSelf: 'center',
    borderRadius: ASPECT_RATIO * 70,
    elevation: ASPECT_RATIO * 10,
    padding: ASPECT_RATIO * 70,
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
});
