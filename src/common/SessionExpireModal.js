import React from 'react';
// import { Modal, NativeBaseProvider } from 'native-base';
import { Button, Modal, Center, NativeBaseProvider } from 'native-base';
import { Text, View } from 'react-native';
import { colors } from '../util/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
const SessionExpireModal = ({ loading, text, icon, button, handleButton }) => {
  console.log(loading);
  return (
    <NativeBaseProvider>
      <Modal isOpen={loading}>
        <Modal.Content maxWidth={text ? '300px' : '300px'}>
          <Modal.Body>
            <View
            // style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              <View style={{ alignItems: 'center', marginBottom: 25 }}>
                {icon ? (
                  <AntDesign
                    type="AntDesign"
                    name="exclamationcircleo"
                    size={26}
                    color={colors.primaryOrange}
                  />
                ) : null}
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: colors.darkGrey,
                  textAlign: 'center',
                }}>
                {text ? text : 'Session Expired! Please Login Again'}
              </Text>
            </View>
          </Modal.Body>
          {button ? (
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  style={{
                    color: '#fff',
                    backgroundColor: colors.primaryOrange,
                  }}
                  onPress={handleButton}>
                  {button}
                </Button>
              </Button.Group>
            </Modal.Footer>
          ) : null}
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
};

export default SessionExpireModal;
