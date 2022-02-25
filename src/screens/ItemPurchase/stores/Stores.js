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
import AppService from '../../../services/AppService';
import {
  ASPECT_RATIO,
  colors,
  headingTextStyle,
  height,
  mainView,
  width,
} from '../../../util/colors';
import Snackbar from 'react-native-snackbar';
// import asyncStorage from '../../../services/asyncStorage';
import Loader from '../../../common/Loader';
class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeData: '',
      styleModal: styles.modalStyle,
      styleModalOnPress: styles.modalStyleOnPress,
      itemPressed: null,
      loading: false,
    };
  }

  async componentDidMount() {
    let newState = {
      loading: true,
    };
    this.setState(newState);
    this.getStoreData();
  }
  getStoreData = async () => {
    await AppService.getStoreData()
      .then(res => {
        console.log('res: ', res);
        const data = res.data;
        if (data.status) {
          let newState = {
            storeData: data.data,
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
  getProducts = async (item, index) => {
    this.setState({ loading: true });
    console.log('getItemsFromCart: ', item);
    await AppService.getItemsFromCart()
      .then(res => {
        console.log('getItemsFromCart: ', res.data.data.items);
        if (res.data?.data?.items != '') {
          if (
            res.data.data.items[0].product_id.product_store === item.store_name
          ) {
            this.props.navigation.navigate('ItemList', item);
          } else {
            this.emptyCartAllert(item, index);
          }
        } else {
          this.setState({ loading: false });
          this.props.navigation.navigate('ItemList', item);
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
  emptyCartAllert = async (item, index) => {
    Alert.alert('', 'Your Cart Will be removed!', [
      {
        text: 'Yes',
        onPress: () => {
          AppService.emptyCart()
            .then(res => {
              console.log('emptyCart: ', res);
              if (res.data.status) {
                Snackbar.show({
                  text: res.data.message,
                  duration: Snackbar.LENGTH_LONG,
                });
                let itemPress = {
                  itemPressed: index,
                  loading: false,
                };
                this.setState(itemPress);
                this.props.navigation.navigate('ItemList', item);
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
        },
        style: 'cancel',
      },
      {
        text: 'No',
        onPress: () => {
          let itemPress = {
            itemPressed: index,
            loading: false,
          };
          this.setState(itemPress);
          // this.props.navigation.navigate('ItemList', item);
        },
      },
    ]);
  };
  render() {
    return (
      <NativeBaseProvider>
        <ScrollView style={{ flex: 1, backgroundColor: colors.gray }}>
          <View style={{ flex: 1 }}>
            <View style={styles.mainView}>
              <View style={{ marginBottom: height / 15 }}>
                <Text style={styles.textStyle}>Select Your</Text>
                <Text style={styles.textStyle}>Desired Store</Text>
              </View>
              <View style={{ marginBottom: height / 20 }}>
                <FlatList
                  data={this.state.storeData}
                  numColumns={2}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index + ''}
                  ListEmptyComponent={this.EmptyListMessage}
                  // ListFooterComponent={this.renderFooter}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          // style={this.state.modalStyle}
                          key={index}
                          style={[
                            this.state.itemPressed == index
                              ? styles.modalStyleOnPress
                              : styles.modalStyle,
                            // this.state.styleModal,
                            // { flex: 1, height: 145 },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => this.getProducts(item, index)}>
                          <View style={[styles.modalInnerView]}>
                            <View style={{ height: height / 9 }}>
                              <Image
                                resizeMode={'center'}
                                // source={require('../../../assets/vero-logo.png')}
                                source={{
                                  uri:
                                    'http://157.230.183.30:3000/' +
                                    item.store_logo,
                                }}
                                style={{
                                  height: height / 8,
                                  width: width / 7,
                                }}
                              />
                            </View>
                            <Text
                              style={[
                                styles.textStyle,
                                { fontSize: ASPECT_RATIO * 24 },
                              ]}>
                              {item.display_name}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  fontSize: ASPECT_RATIO * 18,
                                  color: colors.secondaryGray,
                                  marginBottom: height / 35,
                                },
                              ]}>
                              {item.store_distance} 4 Miles Away
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
                <Loader loading={this.state.loading} />
              </View>
            </View>
          </View>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}

export default Store;
const styles = StyleSheet.create({
  mainView: {
    marginLeft: mainView.marginLeft,
    marginRight: mainView.marginLeft,
    marginTop: height / 10,
    backgroundColor: colors.gray,
  },
  textStyle: headingTextStyle,
  modalStyle: {
    margin: ASPECT_RATIO * 10,
    width: width / 2.8,
    backgroundColor: colors.gray,
    borderRadius: 30,
    elevation: ASPECT_RATIO * 10,
    padding: ASPECT_RATIO * 10,
  },
  modalStyleOnPress: {
    margin: ASPECT_RATIO * 10,
    width: width / 2.8,
    backgroundColor: colors.gray,
    borderRadius: 30,
    elevation: ASPECT_RATIO * 10,
    padding: ASPECT_RATIO * 10,
    borderWidth: 3,
    borderColor: colors.primaryOrange,
  },
  modalInnerView: {
    alignItems: 'center',
  },
});
