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
import FooterButton from '../../../common/FooterButton';
import { colors } from '../../../util/colors';
import { style } from 'styled-system';
import Card from '../../../common/Card'
const images = {
  profile: {
    profile: require("../../../assets/testing.jpg")

  }
};

const imageList = require("../../../assets/testing.jpg")
class ItemCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleModal1: styles.modalStyle,
      styleModal2: styles.modalStyle,
      styleModal3: styles.modalStyle,
    };
  }

  render() {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          <View style={styles.mainView}>
            <Card style={{
              marginTop: '5%',
              width: '100%',
              backgroundColor: colors.gray,
              borderRadius: 30,
              elevation: 5,
              height: 140
            }}
              image={images.profile.profile}
              title={" Start Stone Ring"}
              price={(50)}
              discription={" Start Stone Ring"} >
            </Card>
          </View>
        </View>
        <View >
          <Text style={{ fontSize: 20, textDecorationLine: 'underline', color: "red", position: 'absolute', top: 10, marginLeft: 15 }}>
            Precharge Wallet
          </Text>

        </View>
        <FooterButton
          title="Add To Cart"
          onPress={() => props.navigation.navigate("ItemCart")}
          // disabled={this.state.loading}
          style={{ width: '50%' }}
        />

      </NativeBaseProvider>
    );
  }
}

export default ItemCart;
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    margin: '10%',
    // marginLeft: '10%',
    // marginTop: '10%',
    backgroundColor: colors.gray,
  },

});
