/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { colors } from '../util/colors';

function MessageModal(props) {
   
    return (
        <ReactNativeModal
            // useNativeDriver={true}
            animationIn={'slideInUp'}
            animationOut={'slideOutRight'}
            testID={'modal'}
            onBackdropPress={() => props.setVisible(false)}
            isVisible={props.visible}
            style={styles.root}
        >
            <View style={styles.view}>
                {props.children}              
            </View>
        </ReactNativeModal>
    );
}
const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        height: 150,
        width: '80%',
        // justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        // borderRadius: 40,
        borderTopLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
        paddingTop: 30
    },
    inputView: {
        width: '90%',
    },
    buttonView: {
        flexDirection: 'row',
    },
    button: {
        width: '40%',
        height: 40,
        margin: '5%',
        paddingVertical: 3,
    },
});

export default MessageModal;