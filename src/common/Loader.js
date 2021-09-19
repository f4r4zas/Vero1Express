import React from 'react';
import {Modal, NativeBaseProvider} from 'native-base';
import {ActivityIndicator, Text, View} from 'react-native';
import {colors} from '../util/colors';
const Loader = ({loading}) => {
  console.log(loading);
  return (
    <NativeBaseProvider>
      <Modal isOpen={loading}>
        <Modal.Content maxWidth="200px">
          <Modal.Body>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <ActivityIndicator size="large" color={colors.primaryOrange} />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: colors.darkGrey,
                  textAlign: 'center',
                }}>
                Please wait
              </Text>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
};

export default Loader;
