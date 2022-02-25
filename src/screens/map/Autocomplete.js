import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { colors } from '../../util/colors';

const Autocomplete = () => {
  return (
    // <NativeBaseProvider>
    //   <View style={{flex: 1, backgroundColor: colors.gray}}>
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyC6Vo_6ohnkLyGIw2IPmZka0TarRaeWJ2g',
        language: 'en',
      }}
      style={styles.googleAutocomplete}
    />
    // </View>
    // </NativeBaseProvider>
  );
};
const styles = StyleSheet.create({
  googleAutocomplete: {
    // flex: 1,
    position: 'absolute',
    top: 40,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 1,
  },
});
export default Autocomplete;
