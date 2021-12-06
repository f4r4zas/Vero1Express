import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  TextInput,
  // SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { NativeBaseProvider, Spinner } from 'native-base';
import { colors } from '../../../util/colors';
import ReadMore from 'react-native-read-more-text';
import AppService from '../../../services/AppService';
import Zocial from 'react-native-vector-icons/Zocial';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import DropDownItem from 'react-native-drop-down-item';
// import {marginRight} from 'styled-system';
import Loader from '../../../common/Loader';
import Snackbar from 'react-native-snackbar';
import InputField from '../../../common/InputField';
// import InputField from '../../../common/InputField';
// import Accordian from '../../../common/Accordin';

const IC_ARR_DOWN = require('../../../assets/ic_arr_down.png');
const IC_ARR_UP = require('../../../assets/ic_arr_up.png');
class ItemList extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      DATA: [],
      storeData: this.props.route.params,
      isVisible: false,
      styleModal: styles.modalStyle,
      styleModalOnPress: styles.modalStyleOnPress,
      itemPressed: null,
      page: 0,
      per_page: 20,
      store_name: this.props.route.params.store_name,
      total_count: '',
      total_pages: '',
      loading: false,
      isSearch: false,
      searchValue: '',
      isMainCategories: '',
      isSubCategories: '',
      expanded: false,
      collapseIndex: '',
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  toggleExpand = async item => {
    debugger;
    if (this.state.collapseIndex == '') {
      await this.getCategories(item);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      let exp = !this.state.expanded;
      let newState = { expanded: true, collapseIndex: item.index };
      this.setState(newState);
    } else if (this.state.collapseIndex == item.index) {
      // await this.getCategories(item);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      let exp = !this.state.expanded;
      let newState = { expanded: exp, collapseIndex: item.index };
      this.setState(newState);
    } else if (this.state.collapseIndex != item.index) {
      await this.getCategories(item);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      let exp = !this.state.expanded;
      let newState = { expanded: true, collapseIndex: item.index };
      this.setState(newState);
    }
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  async componentDidMount() {
    let newState = {
      loading: true,
    };
    this.setState(newState);
    await this.getItemList();
    await this.getCategories();
  }
  handleSearch = text => {
    this.setState({ searchValue: text });
    if (text.length >= 3) {
      this.getProductSearch(text);
    }
  };
  productExistanceAllert = async item => {
    Alert.alert(
      '',
      'This product is already added, Do you want to add this again!',
      [
        {
          text: 'Yes',
          onPress: async () => {
            let payload = {
              items: [{ product_id: item._id, quantity: 1 }],
            };
            await AppService.updateItemToCart(payload)
              .then(res => {
                console.log('item updated to cart from itemList: ', res);
                if (res.data.status) {
                  Snackbar.show({
                    text: res.data.message,
                    duration: Snackbar.LENGTH_LONG,
                  });
                  let newState = {
                    loading: false,
                  };
                  this.setState(newState);
                } else {
                  Snackbar.show({
                    text: res.data.message,
                    duration: Snackbar.LENGTH_LONG,
                  });
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
          },
          style: 'cancel',
        },
        {
          text: 'No',
          onPress: () => {
            let itemPress = {
              loading: false,
            };
            this.setState(itemPress);
            // this.props.navigation.navigate('ItemList', item);
          },
        },
      ],
    );
  };
  getItemsFromCart = async item => {
    this.setState({ loading: true });
    console.log('getItemsFromCart: ', item);
    await AppService.getItemsFromCart()
      .then(res => {
        console.log('getItemsFromCart: ', res.data.data.items);
        if (res.data?.data?.items != '') {
          let count = 0;
          for (let i = 0; i < res.data.data.items.length; i++) {
            if (res.data.data.items[i].product_id._id === item._id) {
              count = count + 1;
              this.productExistanceAllert(item);
            }
          }
          if (count == 0) {
            this.addItemToCart(item);
          }
        } else {
          this.addItemToCart(item);
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
  addItemToCart = async item => {
    this.setState({ loading: true });
    let payload = {
      items: [{ product_id: item._id, quantity: 1 }],
      store_name: this.state.store_name,
    };
    await AppService.addItemToCart(payload)
      .then(res => {
        console.log('res: ', res);
        if (res.data.status) {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setTimeout(() => {
            this.setState({ loading: false });
          }, 1000);
          // props.navigation.navigate('Cart');
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
          setTimeout(() => {
            this.setState({ loading: false });
          }, 1000);
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
  getItemList = async () => {
    let payload = {
      store_name: this.state.store_name,
      page: this.state.page,
      per_page: this.state.per_page,
    };
    console.log('payload: ', payload);
    await AppService.getItemList(payload)
      .then(res => {
        console.log('res: ', res);
        if (res.data.status) {
          let newState = {
            DATA: res.data.data.products,
            page: res.data.data.page,
            total_count: res.data.data.total_count,
            total_pages: res.data.data.total_pages,
            // loading: false,
          };
          this.setState(newState);
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
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
  getCategories = async item => {
    // debugger;
    let payload = '';
    if (item?.item?.has_sub) {
      let newState = {
        loading: true,
      };
      this.setState(newState);
      payload = {
        store_name: this.state.store_name,
        is_main: 'false',
        parent_id: item.item._id,
      };
    } else {
      payload = {
        store_name: this.state.store_name,
        is_main: 'true',
      };
    }
    await AppService.getCategories(payload)
      .then(res => {
        console.log('getCategories: ', res);
        // debugger;
        if (res.data.status) {
          if (item) {
            let newState = '';
            newState = {
              isSubCategories: res.data.data.categories,
              loading: false,
            };
            this.setState(newState);
          } else {
            let newState = '';
            newState = {
              isMainCategories: res.data.data.categories,
              loading: false,
            };
            this.setState(newState);
          }
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
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
  getProductSearch = async text => {
    // let newState = {
    //   loading: true,
    // };
    // this.setState(newState);
    let payload = {
      product_store: this.state.store_name,
      // product_category: item.item._id,
      product_name: text,
    };
    try {
      await AppService.getProductSearch(payload)
        .then(res => {
          console.log('getProductSearch: ', res);
          if (res.data.status) {
            let newState = {
              DATA: res.data.data.products,
              page: res.data.data.page,
              total_count: res.data.data.total_count,
              total_pages: res.data.data.total_pages,
              loading: false,
              isVisible: false,
            };
            this.setState(newState);
          } else {
            Snackbar.show({
              text: res.data.message,
              duration: Snackbar.LENGTH_LONG,
            });
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
    } catch (error) {
      // console.log(error.response.data.message);
      Snackbar.show({
        text: error.response.data.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };
  getCategoryProductSearch = async item => {
    let newState = {
      loading: true,
    };
    this.setState(newState);
    let payload = '';
    if (item?.item?.has_sub) {
      payload = {
        product_store: item.item.store_name,
        product_category: item.item._id,
        // product_name: item.item.name,
      };
    } else {
      payload = {
        product_store: item.item.store_name,
        product_category: item.item._id,
        product_name: item.item.name,
      };
    }
    await AppService.getProductSearch(payload)
      .then(res => {
        // console.log('getProductSearch: ', res);
        if (res.data.status) {
          let newState = {
            DATA: res.data.data.products,
            page: res.data.data.page,
            total_count: res.data.data.total_count,
            total_pages: res.data.data.total_pages,
            loading: false,
            isVisible: false,
          };
          this.setState(newState);
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
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
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  loadMoreResults = async () => {
    let payload = {
      store_name: this.state.store_name,
      page: this.state.page + 1,
      per_page: this.state.per_page,
    };
    await AppService.getItemList(payload)
      .then(res => {
        console.log('res: ', res);
        if (res.data.status) {
          const newArray = this.state.DATA.slice();
          for (let i = 0; i < res.data.data.products.length; i++) {
            newArray.push(res.data.data.products[i]);
          }
          console.log('newArray: ', newArray);
          let newState = {
            DATA: newArray,
            page: this.state.page + 1,
            total_count: res.data.data.total_count,
            total_pages: res.data.data.total_pages,
            loading: false,
          };
          this.setState(newState, () => {
            console.log('pagination DAta : ', this.state.DATA);
          });
        } else {
          Snackbar.show({
            text: res.data.message,
            duration: Snackbar.LENGTH_LONG,
          });
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
  itemDetails = (item, index) => {
    let itemPress = {
      itemPressed: index,
    };
    this.setState(itemPress, () => {});
    this.props.navigation.navigate('ItemDetails', {
      item,
      storeData: this.state.storeData,
    });
  };
  _renderTruncatedFooter = () => {
    return;
  };
  renderUri(itemImage) {
    if (!/^(f|ht)tps?:\/\//i.test(itemImage)) {
      return 'http:' + itemImage;
    } else {
      return itemImage;
    }
  }
  onEndReached = ({ distanceFromEnd }) => {
    // debugger;
    if (!this.onEndReachedCalledDuringMomentum) {
      this.loadMoreResults();
      this.onEndReachedCalledDuringMomentum = true;
    }
  };
  render() {
    return (
      <NativeBaseProvider>
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.gray }}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              let newState = {
                loading: true,
              };
              this.setState(newState);
              this.loadMoreResults();
            }
          }}
          scrollEventThrottle={1000}>
          <View style={{ flex: 1 }}>
            <View style={styles.mainView}>
              <View style={{ marginBottom: '7%' }}>
                <Text style={styles.textStyle}>Item Purchase</Text>
              </View>
              {this.state.isSearch ? (
                // <View style={{width: '100%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                  }}>
                  <View style={{ width: '10%', position: 'relative' }}>
                    <Ionicons
                      name="arrow-back"
                      size={20}
                      onPress={() => {
                        this.setState({ isSearch: false, searchValue: '' });
                        this.getItemList();
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: '80%',
                      position: 'relative',
                      bottom: '8%',
                    }}>
                    <InputField
                      label={''}
                      placeholder={'Search Products ...'}
                      value={this.state.searchValue || ''}
                      name={''}
                      onChangeText={e => this.handleSearch(e)}
                    />
                  </View>
                </View>
              ) : (
                // </View>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      marginRight: 15,
                      position: 'relative',
                      bottom: 12,
                      // flex: 1,
                      // alignItems: 'center',
                    }}>
                    <Image
                      resizeMode={'center'}
                      source={{
                        uri:
                          'http://157.230.183.30:3000/' +
                          this.state.storeData.store_logo,
                      }}
                      // style={{height: 100, width: 50}}
                      style={{
                        flex: 1,
                        //
                        width: 55,
                        height: 50,
                      }}
                    />
                  </View>
                  <View>
                    <Text style={[styles.textStyle, { fontSize: 14 }]}>
                      Accessories
                    </Text>
                    <Text
                      style={[
                        styles.textStyle,
                        { fontSize: 10, color: colors.secondaryGray },
                      ]}>
                      {this.state.storeData.display_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <FontAwesome
                      onPress={() => this.setState({ isSearch: true })}
                      name="search"
                      // color="#22aebb"
                      size={20}
                      style={{
                        textAlign: 'right',
                        width: '38%',
                        marginRight: '5%',
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ isVisible: true });
                      }}>
                      <FontAwesome
                        name="filter"
                        // color="#22aebb"
                        size={20}
                        style={{ width: '40%', marginRight: '10%' }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <FlatList
                  data={this.state.DATA}
                  numColumns={2}
                  // scrollEnabled={true}
                  keyExtractor={(item, index) => index + ''}
                  ListEmptyComponent={this.EmptyListMessage}
                  // ListFooterComponent={this.renderFooter}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ flex: 1 }}>
                        <View
                          style={[
                            this.state.itemPressed == index
                              ? styles.modalStyleOnPress
                              : styles.modalStyle,
                            // this.state.styleModal,
                            { flex: 1, height: 180 },
                          ]}>
                          <TouchableOpacity
                            style={[styles.modalInnerView, { flex: 1 }]}
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => this.itemDetails(item, index)}>
                            <View
                              style={{
                                flex: 1,
                                height: 40,
                                alignItems: 'center',
                              }}>
                              <Image
                                resizeMode={'center'}
                                source={{
                                  uri: this.renderUri(item.product_image),
                                }}
                                style={{
                                  flex: 1,
                                  //
                                  width: 60,
                                  height: 60,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                margin: 10,
                              }}>
                              <ReadMore
                                numberOfLines={2}
                                renderTruncatedFooter={
                                  this._renderTruncatedFooter
                                }>
                                <Text
                                  style={[
                                    styles.textStyle,
                                    { fontSize: 12, width: '80%' },
                                  ]}>
                                  {item.product_name}
                                </Text>
                              </ReadMore>

                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    fontSize: 14,
                                    color: colors.primaryOrange,
                                    marginTop: 4,
                                    marginBottom: 4,
                                  },
                                ]}>
                                ${item.product_price}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 10,
                            }}>
                            <TouchableOpacity>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    fontSize: 12,
                                    color: colors.secondaryGray,
                                  },
                                ]}>
                                Compare
                              </Text>
                            </TouchableOpacity>
                            <Zocial
                              onPress={() => this.getItemsFromCart(item)}
                              name="cart"
                              color={colors.primaryOrange}
                              size={16}
                              tyle={[
                                styles.textStyle,
                                {
                                  fontSize: 12,
                                  color: colors.primaryOrange,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
              <Loader loading={this.state.loading} />
            </View>
          </View>
        </ScrollView>
        <Modal
          visible={this.state.isVisible}
          transparent={true}
          animationType="slide">
          <View style={styles.modelStyle1}>
            <View style={styles.modelWrapperStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: '10%',
                  marginRight: '15%',
                  marginTop: '10%',
                }}>
                <Text style={[styles.textStyle]}>
                  {/* style={{fontSize: 28, fontWeight: 'bold', marginLeft: 20}}> */}
                  Categories
                </Text>
                <FontAwesome
                  // style={{
                  //   marginRight: '10%',
                  // }}
                  onPress={() => {
                    this.setState({ isVisible: !this.state.isVisible });
                  }}
                  name="close"
                  size={20}
                />
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  margin: '10%',
                  height: '80%',
                }}>
                <FlatList
                  data={this.state.isMainCategories}
                  numColumns={1}
                  // scrollEnabled={true}
                  keyExtractor={(item, index) => index + ''}
                  // ListEmptyComponent={this.EmptyListMessage}
                  // ListFooterComponent={this.renderFooter}
                  renderItem={(itemMain, index) => {
                    // console.log('item: ', item);
                    return (
                      <View>
                        <TouchableOpacity
                          // ref={this.accordian}
                          style={styles.row}
                          onPress={() => this.toggleExpand(itemMain)}>
                          <Text style={[styles.title, styles.font]}>
                            {itemMain.item.name}
                          </Text>
                          <Icon
                            name={
                              this.state.expanded &&
                              itemMain.item._id ==
                                this.state.isSubCategories[0].parent_id
                                ? 'keyboard-arrow-up'
                                : 'keyboard-arrow-down'
                            }
                            size={30}
                            color={colors.darkGrey}
                          />
                        </TouchableOpacity>
                        <View style={styles.parentHr} />
                        {this.state.expanded &&
                        itemMain.item._id ==
                          this.state.isSubCategories[0].parent_id ? (
                          <FlatList
                            data={this.state.isSubCategories}
                            numColumns={1}
                            // scrollEnabled={true}
                            keyExtractor={(item, index) => index + ''}
                            // ListEmptyComponent={this.EmptyListMessage}
                            // ListFooterComponent={this.renderFooter}
                            renderItem={(itemSub, index) => {
                              return (
                                <TouchableOpacity
                                  style={styles.child}
                                  onPress={() =>
                                    this.getCategoryProductSearch(itemSub)
                                  }>
                                  <Text
                                    style={[
                                      styles.textStyle,
                                      {
                                        fontSize: 13,
                                        color: colors.primaryOrange,
                                      },
                                    ]}>
                                    {itemSub.item.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }}
                          />
                        ) : null}
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </NativeBaseProvider>
    );
  }
}

export default ItemList;
const styles = StyleSheet.create({
  mainView: {
    margin: '10%',
    backgroundColor: colors.gray,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGray,
  },
  modalStyle: {
    margin: '1%',
    marginBottom: '5%',
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 30,
    elevation: 5,
    padding: '5%',
  },
  modalStyleOnPress: {
    margin: '1%',
    marginBottom: '5%',
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.primaryOrange,
    borderRadius: 30,
    elevation: 5,
    padding: '5%',
  },
  modalInnerView: {
    width: '100%',
    // alignItems: 'center',
  },
  modelStyle1: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 0,
  },
  modelWrapperStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: '#ffffff',

    width: '100%',
    height: '90%',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.secondaryGray,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    paddingLeft: '5%',
    paddingRight: '5%',
    alignItems: 'center',
    // backgroundColor: colors.primaryOrange,
  },
  parentHr: {
    height: 2,
    color: colors.darkGrey,
    width: '100%',
  },
  child: {
    // backgroundColor: colors.primaryOrange,
    paddingLeft: '10%',
    paddingBottom: '2%',
    paddingTop: '2%',
  },
});
