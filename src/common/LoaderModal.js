import {Spinner} from 'native-base';
import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../util/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';

const LoaderModal = ({modalState, ref, text, icon}) => {
  return (
    <View style={styles.personalInfo}>
      <Modal position={'center'} ref={ref} style={styles.modalStyle}>
        {modalState ? (
          <View style={styles.modalInnerView}>
            <Text style={styles.modalText}>{text}</Text>
            <Ionicons
              type="Ionicons"
              name="ios-checkmark-circle-outline"
              size={70}
              color="#ff8800"
            />
          </View>
        ) : (
          <View style={styles.modalInnerView}>
            <Text style={styles.modalText}>Verifying</Text>
            <Spinner color="#ff8800" size={70} style={{fontWeight: '100'}} />
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  personalInfo: {
    marginTop: '8%',
  },
  modalStyle: {
    height: 160,
    width: '75%',
    justifyContent: 'center',
    backgroundColor: '#fdfbfc',
    borderRadius: 30,
  },
  modalInnerView: {
    alignSelf: 'center',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.darkGrey,
  },
});

export default LoaderModal;
