import React from 'react';
import {Button, Modal, Center, NativeBaseProvider} from 'native-base';
import {useState} from 'react';
const ModalPopUp = ({
  showModal,
  modalProperties,
  modalHandling,
  onPositiveResponse,
  title,
  body,
  button1,
  button2,
}) => {
  //   const [showModal, setShowModal] = useState(props.show);
  console.log(showModal);
  return (
    <NativeBaseProvider>
      {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
      <Modal isOpen={showModal} onClose={modalHandling}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{modalProperties.title}</Modal.Header>
          <Modal.Body>{modalProperties.body}</Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button onPress={modalHandling}>{modalProperties.button2}</Button>
              <Button onPress={onPositiveResponse}>
                {modalProperties.button1}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
};

export default ModalPopUp;
