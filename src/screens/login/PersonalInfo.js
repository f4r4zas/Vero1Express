import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import FooterButton from '../../common/FooterButton';
import { NativeBaseProvider, Select, Checkbox } from 'native-base';
import { registerUser } from '../../reduxStore/actions/AuthActions';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import { colors } from '../../util/colors';
import Loader from '../../common/Loader';
var emailRegex = new RegExp(
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
);
var nameRegex = new RegExp(/^[a-zA-Z]+$/);
var nameRegex = new RegExp(/^[a-zA-Z].*[\s\.]*$/);

class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      gender: '',
      email: '',
      last_nameError: false,
      first_nameError: false,
      emailError: false,
      genderError: false,
      loading: false,
      isValid: false,
      check: false,
      checkError: false,
      termsAndConditions: false,
      mobile_number: '',
      user_type: '',
    };
  }

  async componentDidMount() {
    let user_type = await AsyncStorage.getItem('user_type');
    let mobile_number = await AsyncStorage.getItem('mobile_number');
    let newState = {
      user_type: user_type,
      mobile_number: mobile_number,
    };
    this.setState(newState);
  }
  // checkValidity = (text) => {
  //   if (text.trim().length < 10) {
  //     this.setState({
  //       isValid: true,
  //     });
  //   }
  // };
  onChangeHandler = (text, tag) => {
    console.log(text, ' ', tag);
    if (tag == 'first_name') {
      let newState = {
        first_name: text,
        first_nameError: false,
        // first_nameError: true,
      };
      this.setState(newState);
    } else if (tag == 'email') {
      let newState = {
        email: text,
        emailError: false,
      };
      this.setState(newState);
      // let emailValidation = this.validateEmail(text);
      // if (emailValidation) {
      //   let newState = {
      //     email: text,
      //     isValid: true,
      //     emailError: true,
      //   };
      //   this.setState(newState);
      // } else {
      //   let newState = {
      //     emailError: text,
      //     isValid: true,
      //     emailError: true,
      //   };
      //   this.setState(newState);
      // }
    } else if (tag == 'gender') {
      let newState = {
        gender: text,
        genderError: false,
        // genderError: true,
      };
      this.setState(newState);
    } else if (tag == 'terms') {
      let newState = {
        termsAndConditions: true,
        checkError: false,
        // genderError: true,
      };
      this.setState(newState);
    } else if (tag == 'last_name') {
      let newState = {
        last_name: text,
        last_nameError: false,
        // last_nameError: true,
      };
      this.setState(newState);
    }
  };
  validateEmail = email => {
    console.log(email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  };
  pressHandler = async () => {
    let valid = true;
    if (!this.state.first_name) {
      // ToastAndroid.show('Username Field is Required', ToastAndroid.CENTER);
      valid = false;
      let newState = {
        // email: text,
        isValid: false,
        first_nameError: true,
      };
      this.setState(newState);
    } else {
      this.setState({ first_nameError: false });
    }
    if (!this.state.email) {
      // ToastAndroid.show('Password Field is Required', ToastAndroid.SHORT);
      valid = false;
      let newState = {
        // email: text,
        isValid: false,
        emailError: true,
      };
      this.setState(newState);
    } else {
      let emailValidation = this.validateEmail(this.state.email);
      if (!emailValidation) {
        valid = false;
        let newState = {
          // email: text,
          isValid: false,
          emailError: true,
        };
        this.setState(newState);
      } else {
        this.setState({ emailError: false });
      }
    }
    if (!this.state.gender) {
      valid = false;
      let newState = {
        // email: text,
        isValid: false,
        genderError: true,
      };
      this.setState(newState);
    } else {
      this.setState({ genderError: false });
    }
    if (!this.state.check) {
      valid = false;
      let newState = {
        // email: text,
        isValid: false,
        checkError: true,
      };
      this.setState(newState);
    } else {
      this.setState({ checkError: false });
    }
    if (!this.state.last_name) {
      valid = false;
      let newState = {
        // email: text,
        isValid: false,
        last_nameError: true,
      };
      this.setState(newState);
    } else {
      this.setState({ last_nameError: false });
    }
    let data = {
      user_type: 'user',
      // user_type: JSON.parse(this.state.user_type),
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      mobile_number: JSON.parse(this.state.mobile_number),
      // mobile_number: '03300249819',
      email: this.state.email,
      gender: this.state.gender,
    };

    if (valid) {
      console.log('returningFromRedux: ', this.props.reduxState);
      // try {
      // console.log(data);
      // var that = this;
      this.setState({ loading: true });
      console.log('returningFromRedux1111111: ', this.props.reduxState);
      let returningFromRedux = await this.props.dispatch(registerUser(data));
      console.log('returningFromRedux: ', this.props.reduxState);
      debugger;
      if (this.props.reduxState.register) {
        setTimeout(() => {
          let newState = {
            loading: false,
          };
          this.setState(newState);
          this.props.navigation.navigate('AppNavigation');
        }, 600);
      } else {
        let newState = {
          loading: false,
        };
        this.setState(newState);
        // let error = 'Invalid Email';
        Snackbar.show({
          text: `${this.props.reduxState.registerError.response.data.message}`,
          duration: Snackbar.LENGTH_LONG,
        });
      }
      debugger;
    }
    // else {
    //   if (this.state.first_nameError) {
    //     let newState = {
    //       // email: text,
    //       isValid: false,
    //       first_nameError: true,
    //     };
    //     this.setState(newState);
    //   }
    //   if (this.state.last_nameError) {
    //     let newState = {
    //       // email: text,
    //       isValid: false,
    //       last_nameError: true,
    //     };
    //     this.setState(newState);
    //   }
    //   if (this.state.genderError) {
    //     let newState = {
    //       // email: text,
    //       isValid: false,
    //       genderError: true,
    //     };
    //     this.setState(newState);
    //   }
    //   if (this.state.checkError) {
    //     let newState = {
    //       // email: text,
    //       isValid: false,
    //       checkError: true,
    //     };
    //     this.setState(newState);
    //   }
    //   // let error = 'Invalid Email';
    //   // Snackbar.show({
    //   //   text: 'Data is uploaded',
    //   //   duration: Snackbar.LENGTH_LONG,
    //   // });
    //   // (code == '+92' && '*Number is invalid for Pakistan') ||
    //   // (code == '+1' && '*Number is invalid for USA') ||
    //   // '';
    //   // this.setState({
    //   //   inputIconShow: true,
    //   //   loading: false,
    //   //   errorText: error,
    //   // });
    // }
    // } catch (error) {
    //   // console.log('ProfileInfo: ', error);
    //   this.setState({loading: false});
    // }
  };
  render() {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          <View style={{ flexGrow: 1 }}>
            <View style={styles.mainView}>
              <View style={{ marginBottom: '10%' }}>
                <Text style={styles.textStyle}>Put Your Personal</Text>
                <Text style={styles.textStyle}>Information Below</Text>
              </View>
              <View style={styles.personalInfo}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontSize: 16,
                      color: this.state.first_nameError
                        ? 'red'
                        : colors.darkGrey,
                    },
                  ]}>
                  First Name
                </Text>
                <View style={[styles.borderStyle, styles.view1]}>
                  <TextInput
                    value={this.state.first_name}
                    placeholder="John"
                    placeholderTextColor="#7892ab"
                    returnKeyType="next"
                    name="first_name"
                    // error={this.state.first_nameError}
                    onChangeText={text =>
                      this.onChangeHandler(text, 'first_name')
                    }
                    style={[
                      styles.textStyle2,
                      {
                        height: 30,
                        alignItems: 'center',
                        padding: 0,
                        width: '90%',
                      },
                    ]}
                  />
                  {this.state.first_nameError ? (
                    <Entypo
                      type="Entypo"
                      name={
                        this.state.first_nameError == this.state.isValid
                          ? 'check'
                          : 'cross'
                      }
                      style={{ fontSize: 15 }}
                      color={
                        !this.state.first_nameError == true
                          ? '#006400'
                          : '#FF0000'
                      }
                    />
                  ) : null}

                  {/* {this.state.initialIcon == true ? null : this.state
                      .inputIconShow ? (
                  ) : null} */}
                </View>
              </View>
              <View style={styles.personalInfo}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontSize: 16,
                      color: this.state.last_nameError
                        ? 'red'
                        : colors.darkGrey,
                    },
                  ]}>
                  Last Name
                </Text>
                <View style={[styles.borderStyle, styles.view1]}>
                  <TextInput
                    value={this.state.last_name}
                    placeholder="Willaiams"
                    placeholderTextColor="#7892ab"
                    returnKeyType="next"
                    name="last_name"
                    // error={this.state.last_nameError}
                    onChangeText={text =>
                      this.onChangeHandler(text, 'last_name')
                    }
                    style={[
                      styles.textStyle2,
                      {
                        height: 30,
                        alignItems: 'center',
                        padding: 0,
                        width: '90%',
                      },
                    ]}
                  />
                  {this.state.last_nameError ? (
                    <Entypo
                      type="Entypo"
                      name={
                        this.state.last_nameError == this.state.isValid
                          ? 'check'
                          : 'cross'
                      }
                      style={{ fontSize: 15 }}
                      color={
                        !this.state.last_nameError == true
                          ? '#006400'
                          : '#FF0000'
                      }
                    />
                  ) : null}

                  {/* {this.state.initialIcon == true ? null : this.state
                      .inputIconShow ? (
                  ) : null} */}
                </View>
              </View>

              <View style={styles.personalInfo}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontSize: 16,
                      color: this.state.emailError ? 'red' : colors.darkGrey,
                    },
                  ]}>
                  Email Address
                </Text>
                <View style={[styles.borderStyle, styles.view1]}>
                  <TextInput
                    value={this.state.email}
                    placeholder="John@gmail.com"
                    placeholderTextColor="#7892ab"
                    returnKeyType="next"
                    name="email"
                    // error={this.state.emailError}
                    onChangeText={text => this.onChangeHandler(text, 'email')}
                    style={[
                      styles.textStyle2,
                      {
                        height: 30,
                        alignItems: 'center',
                        padding: 0,
                        width: '90%',
                      },
                    ]}
                  />
                  {this.state.emailError ? (
                    <Entypo
                      type="Entypo"
                      name={
                        this.state.emailError == this.state.isValid
                          ? 'check'
                          : 'cross'
                      }
                      style={{ fontSize: 15 }}
                      color={
                        !this.state.emailError == true ? '#006400' : '#FF0000'
                      }
                    />
                  ) : null}

                  {/* {this.state.initialIcon == true ? null : this.state
                      .inputIconShow ? (
                  ) : null} */}
                </View>
              </View>
              <View style={styles.personalInfo}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontSize: 16,
                      color: this.state.genderError ? 'red' : colors.darkGrey,
                    },
                  ]}>
                  Gender
                </Text>
                <View style={[styles.borderStyle, { width: '100%' }]}>
                  <Select
                    placeholder="Male"
                    selectedValue={this.state.gender}
                    variant="unstyled"
                    placeholderTextColor="#7892ab"
                    style={{
                      marginLeft: '-5%',
                      marginBottom: '-3%',
                      marginTop: '-3%',
                    }}
                    onValueChange={itemValue =>
                      this.onChangeHandler(itemValue, 'gender')
                    }>
                    <Select.Item label="Male" value="Male" />
                    <Select.Item label="Felmae" value="Felmae" />
                  </Select>
                  {this.state.genderError ? (
                    <Entypo
                      type="Entypo"
                      name={
                        this.state.genderError == !this.state.isValid
                          ? 'check'
                          : 'cross'
                      }
                      style={{
                        fontSize: 15,
                        position: 'absolute',
                        right: '-5%',
                        bottom: '25%',
                      }}
                      color={
                        this.state.genderError == true ? '#006400' : '#FF0000'
                      }
                    />
                  ) : null}

                  {/* {this.state.initialIcon == true ? null : this.state
                      .inputIconShow ? (
                  ) : null} */}
                </View>

                <View style={{ flexDirection: 'row', marginTop: '10%' }}>
                  {/* <View style={{borderBottomWidth: 0}}> */}
                  <Checkbox
                    checked={this.state.check}
                    onPress={() =>
                      this.setState({
                        check: !this.state.termsAndConditions,
                        errorText4: '',
                        checkError: false,
                      })
                    }
                    color="#002854"
                  />
                  <View style={{ marginLeft: 5 }}>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          fontSize: 12,
                          color: this.state.checkError
                            ? 'red'
                            : colors.darkGrey,
                        },
                      ]}>
                      I accept the terms and condition
                    </Text>
                  </View>
                  {/* </View> */}
                </View>
              </View>
            </View>
            <Loader loading={this.state.loading} />
          </View>
          <FooterButton
            title="Register"
            onPress={this.pressHandler}
            disabled={this.state.loading}
          />
        </View>
      </NativeBaseProvider>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    marginLeft: '10%',
    paddingBottom: '15%',
    marginTop: '10%',
    // margin: '10%',
    backgroundColor: colors.gray,
  },
  innerViews: {
    marginBottom: '35%',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
  textStyle2: {
    fontSize: 15,
    color: colors.secondaryGray,
  },
  borderStyle: {
    borderBottomWidth: 2,
    borderColor: colors.inputUnderLine,
    paddingBottom: 2,
  },
  personalInfo: {
    marginTop: '8%',
  },
  view1: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps: ', dispatch.auth);
  // this.setState({
  // reduxState = dispatch.auth;
  // });
  return {
    registerUser: data => registerUser(data),
    reduxState: dispatch.auth,
    // globalLoader: () => setGlobalLoader()
  };
};

export default connect(mapDispatchToProps)(PersonalInfo);
// export default PersonalInfo;
