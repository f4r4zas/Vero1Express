/* eslint-disable prettier/prettier */
import { Dimensions } from 'react-native';
export const colors = {
  white: '#fff',
  black: '#000',
  gray: '#eee',
  primaryOrange: '#ff8800',
  secondaryGray: '#7893a9',
  darkGrey: '#022651',
  inputUnderLine: '#002753',
};
export const { width, height } = Dimensions.get('window');

export const ASPECT_RATIO = width / height;
export const headingTextStyle = {
  fontWeight: 'bold',
  fontSize: ASPECT_RATIO * 35,
  color: colors.darkGrey,
};
export const fieldTextStyle = {
  fontSize: ASPECT_RATIO * 30,
  color: '#7893a9',
};
export const fontSize = ASPECT_RATIO * 35;

export const dottedView1 = {
  backgroundColor: colors.darkGrey,
  width: ASPECT_RATIO * 25,
  height: ASPECT_RATIO * 10,
  borderRadius: ASPECT_RATIO * 50,
  marginRight: ASPECT_RATIO * 10,
};
export const dottedView2 = {
  backgroundColor: colors.secondaryGray,
  width: ASPECT_RATIO * 10,
  height: ASPECT_RATIO * 10,
  borderRadius: ASPECT_RATIO * 50,
  marginRight: ASPECT_RATIO * 10,
};
export const veroLogoStyle = {
  // height: 60,
  resizeMode: 'contain',
  width: ASPECT_RATIO * 200,
  // margin: -12,
};

export const inputBorderStyle = {
  borderBottomWidth: ASPECT_RATIO * 3,
  borderColor: '#002753',
  paddingBottom: ASPECT_RATIO * 5,
};

export const footerButtonStyle = {
  borderTopLeftRadius: ASPECT_RATIO * 100,
  position: 'absolute',
  top: height / 1.11,
  // top: ASPECT_RATIO * 1365,
  // left: wp('21%'),
  overlayColor: 'transparent',
  borderRadius: ASPECT_RATIO * 5,
};

export const mainView = {
  marginLeft: ASPECT_RATIO * 80,
  marginTop: ASPECT_RATIO * 80,
  backgroundColor: colors.gray,
};

//MAPS///
export const currentLocationIcon = {
  width: width / 9,
  height: height / 15,
  backgroundColor: colors.primaryOrange,
  color: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  borderRadius: ASPECT_RATIO * 50,
  right: ASPECT_RATIO * 40,
  bottom: ASPECT_RATIO * 250,
};
export const locationCard = {
  backgroundColor: colors.primaryOrange,
  alignSelf: 'center',
  width: ASPECT_RATIO * 650,
  height: 'auto',
  borderRadius: ASPECT_RATIO * 40,
  justifyContent: 'center',
  paddingTop: ASPECT_RATIO * 20,
  paddingBottom: ASPECT_RATIO * 20,
  paddingLeft: ASPECT_RATIO * 20,
  paddingRight: ASPECT_RATIO * 20,
  position: 'absolute',
  top: ASPECT_RATIO * 100,
};
export const locationInnerTopView = {
  flexDirection: 'row',
  alignItems: 'center',
};
export const locationCardDottedLine = {
  backgroundColor: '#fff',
  width: 2,
  height: 2,
  borderRadius: 1,
  marginRight: 3,
  marginTop: 2,
};
export const locationCardSearchBarView = {
  width: width / 1,
};

export const placeName = {
  color: '#fff',
  fontSize: ASPECT_RATIO * 28,
  width: width / 0.5,
};

export const placeAddress = {
  color: '#fff',
  fontSize: ASPECT_RATIO * 23,
  width: width / 1.5,
};
