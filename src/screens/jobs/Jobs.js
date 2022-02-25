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
import Snackbar from 'react-native-snackbar';
import AppService from '../../services/AppService';
import Loader from '../../common/Loader';
class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSessionExpired: false,
      jobHistory: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.getJobData();
  }
  getJobData = () => {
    this.setState({ loading: true });
    AppService.getUserRides()
      .then(res => {
        console.log('res: ', res);
        const data = res.data;
        if (data.status) {
          let newState = {
            jobHistory: data.data,
            loading: false,
          };
          this.setState(newState);
        } else {
          let newState = {
            loading: false,
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
  jobDetailsScreen = item => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.navigation.navigate('JobDetails', { item: item });
    }, 1000);
  };
  render() {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          {/* <View> */}
          <View style={[styles.mainView, { marginTop: height / 20 }]}>
            <View
              style={{
                marginBottom: height / 30,
                marginLeft: mainView.marginLeft,
              }}>
              <Text style={styles.textStyle}>Job History</Text>
            </View>
            <FlatList
              data={this.state.jobHistory}
              keyExtractor={(item, index) => index + ''}
              ListEmptyComponent={this.EmptyListMessage}
              style={{ height: height / 1.35 }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.modalStyle}
                    activeOpacity={0.8}
                    onPress={() => this.jobDetailsScreen(item)}>
                    <View
                    // style={{
                    //   flexDirection: 'row',
                    //   justifyContent: 'space-between',
                    // }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.modalText}>Service Type: </Text>
                        <Text
                          style={[
                            styles.modalText,
                            {
                              fontWeight: 'normal',
                              fontSize: width / 30,
                              marginTop: height / 100,
                            },
                          ]}>
                          {this.cameltoUpperCase(item?.service_type)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.modalText}>Purchase Id: </Text>
                        <Text
                          style={[
                            styles.modalText,
                            {
                              fontWeight: 'normal',
                              fontSize: width / 30,
                              marginTop: height / 100,
                            },
                          ]}>
                          {item?._id}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.modalText}>Amount: </Text>
                        <Text
                          style={[
                            styles.modalText,
                            {
                              fontWeight: 'normal',
                              fontSize: width / 30,
                              marginTop: height / 100,
                            },
                          ]}>
                          ${item?.fear_break_down?.total_amount}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.modalText}>Started at: </Text>
                        <Text
                          style={[
                            styles.modalText,
                            {
                              fontWeight: 'normal',
                              fontSize: width / 30,
                              marginTop: height / 100,
                            },
                          ]}>
                          {item?.created_at}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.modalText}>Ended at: </Text>
                        <Text
                          style={[
                            styles.modalText,
                            {
                              fontWeight: 'normal',
                              fontSize: width / 30,
                              marginTop: height / 100,
                            },
                          ]}>
                          {item?.updated_at}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <Loader loading={this.state.loading} />
          <SessionExpireModal loading={this.state.isSessionExpired} />
        </View>
      </NativeBaseProvider>
    );
  }
}

export default Jobs;
const styles = StyleSheet.create({
  mainView: {
    marginTop: height / 9,
    backgroundColor: colors.gray,
  },
  textStyle: headingTextStyle,
  logoStyle: veroLogoStyle,
  modalStyle: {
    marginBottom: height / 100,
    marginTop: height / 100,
    width: width / 1.2,
    backgroundColor: colors.gray,
    alignSelf: 'center',
    borderRadius: ASPECT_RATIO * 30,
    elevation: ASPECT_RATIO * 10,
    padding: ASPECT_RATIO * 30,
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
    fontSize: width / 30,
    color: colors.darkGrey,
  },
});
