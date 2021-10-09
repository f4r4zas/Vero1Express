import React, {Fragment, Component} from 'react';
import {
  launchImageLibrary,
  launchCamera,
  //   showImagePicker,
} from 'react-native-image-picker';
import {Image} from 'react-native';

const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
class Camera extends Component {
  //   static chooseImage = async () => {
  //     let options = {
  //       title: 'Select Image',
  //       customButtons: [
  //         {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
  //       ],
  //       storageOptions: {
  //         skipBackup: true,
  //         path: 'images',
  //       },
  //     };
  //     await showImagePicker(options, response => {
  //       console.log('Response = ', response);

  //       if (response.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (response.error) {
  //         console.log('ImagePicker Error: ', response.error);
  //       } else if (response.customButton) {
  //         console.log('User tapped custom button: ', response.customButton);
  //         alert(response.customButton);
  //       } else {
  //         const source = {uri: response.uri};

  //         // You can also display the image using data:
  //         // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  //         // alert(JSON.stringify(response));s
  //         console.log('response', JSON.stringify(response));
  //         this.setState({
  //           filePath: response,
  //           fileData: response.data,
  //           fileUri: response.uri,
  //         });
  //       }
  //     });
  //   };

  static launchCamera = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        return response;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return response;
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // const source = {uri: response.uri};
        // console.log('response', JSON.stringify(response));
        // let picture = {
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri,
        // };
        return response;
      }
    });
  };

  static launchImageLibrary = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  static renderFileData = () => {
    if (this.state.fileData) {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + this.state.fileData}}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image source={require('../assets/car1.png')} style={styles.images} />
      );
    }
  };

  static renderFileUri = () => {
    if (this.state.fileUri) {
      return <Image source={{uri: this.state.fileUri}} style={styles.images} />;
    } else {
      return (
        <Image source={require('../assets/car60.png')} style={styles.images} />
      );
    }
  };
}
export default Camera;
//   render() {
//     return (
//       <Fragment>
//         <StatusBar barStyle="dark-content" />
//         <SafeAreaView>
//           <View style={styles.body}>
//             <Text
//               style={{textAlign: 'center', fontSize: 20, paddingBottom: 10}}>
//               Pick Images from Camera & Gallery
//             </Text>
//             <View style={styles.ImageSections}>
//               <View>
//                 {this.renderFileData()}
//                 <Text style={{textAlign: 'center'}}>Base 64 String</Text>
//               </View>
//               <View>
//                 {this.renderFileUri()}
//                 <Text style={{textAlign: 'center'}}>File Uri</Text>
//               </View>
//             </View>

//             <View style={styles.btnParentSection}>
//               <TouchableOpacity
//                 onPress={this.chooseImage}
//                 style={styles.btnSection}>
//                 <Text style={styles.btnText}>Choose File</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={this.launchCamera}
//                 style={styles.btnSection}>
//                 <Text style={styles.btnText}>Directly Launch Camera</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={this.launchImageLibrary}
//                 style={styles.btnSection}>
//                 <Text style={styles.btnText}>
//                   Directly Launch Image Library
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </SafeAreaView>
//       </Fragment>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },

//   body: {
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     borderColor: 'black',
//     borderWidth: 1,
//     height: Dimensions.get('screen').height - 20,
//     width: Dimensions.get('screen').width,
//   },
//   ImageSections: {
//     display: 'flex',
//     flexDirection: 'row',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     justifyContent: 'center',
//   },
//   images: {
//     width: 150,
//     height: 150,
//     borderColor: 'black',
//     borderWidth: 1,
//     marginHorizontal: 3,
//   },
//   btnParentSection: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   btnSection: {
//     width: 225,
//     height: 50,
//     backgroundColor: '#DCDCDC',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 3,
//     marginBottom: 10,
//   },
//   btnText: {
//     textAlign: 'center',
//     color: 'gray',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });
