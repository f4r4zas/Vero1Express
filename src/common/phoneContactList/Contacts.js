import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
} from 'react-native';
import Contacts from 'react-native-contacts';
import ContactListItem from './ContactListItem';
import Avatar from './Avatar';
import Loader from '../Loader';
import { colors } from '../../util/colors';

const ContactsList = ({ handleContactList }) => {
  const [contactList, setContactList] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [loading, setLoading] = useState(false);
  //   const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    loadContacts();
  }, []);
  const loadContacts = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(res => {
      console.log('res contact: ', res);
      if (res === 'granted') {
        Contacts.getAll()
          .then(contacts => {
            if (contacts) {
              const sortedContacts = contacts.sort((x, y) => {
                let a = x?.givenName.toLowerCase();
                let b = y?.givenName.toLowerCase();
                if (a < b) {
                  return -1;
                }
                if (a > b) {
                  return 1;
                }
                return 0;
              });
              setContactList(sortedContacts);
              setLoading(false);
            } else {
              setLoading(false);
            }
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
          });
        // Contacts.getAll().then(contacts => {});
      }
    });
  };
  const search = text => {
    const phoneNumberRegex = /^[0-9]{0,11}$/;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      const newData = contactList.filter((item, index) => {
        console.log(item);
        const itemData = item.phoneNumbers[0]?.number;
        const textData = text;
        return itemData?.indexOf(textData) > -1;
      });
      setSearchContact(newData);
    } else {
      const newData = contactList.filter((item, index) => {
        console.log(item);
        const itemData = item?.displayName.toLowerCase();
        const textData = text.toLowerCase();
        return itemData?.indexOf(textData) > -1;
      });
      if (newData != null || newData != '') {
        setSearchContact(newData);
      }
    }
  };

  const getAvatarInitials = textString => {
    if (!textString) return '';
    const text = textString.trim();
    const textSplit = text.split(' ');
    if (textSplit.length <= 1) return text.charAt(0);
    const initials =
      textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
    return initials;
  };

  // const openContact = contact => {
  //   console.log(contact);
  //   return handleContactList(contact.phoneNumbers[0].number);
  // };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <Text style={styles.header}>Access Contact List in React Native</Text> */}
        <TextInput
          onChangeText={search}
          placeholder="Search Contact"
          style={styles.searchBar}
        />
        <FlatList
          data={searchContact != '' ? searchContact : contactList}
          renderItem={contact => {
            // console.log('item: ', item);
            const { item } = contact;
            return (
              <TouchableOpacity
                onPress={() => handleContactList(item.phoneNumbers[0].number)}>
                <View style={styles.itemContainer}>
                  <View style={styles.leftElementContainer}>
                    <Avatar
                      img={
                        item.hasThumbnail
                          ? { uri: item.thumbnailPath }
                          : undefined
                      }
                      placeholder={getAvatarInitials(
                        `${item.givenName} ${item.familyName}`,
                      )}
                      width={40}
                      height={40}
                    />
                  </View>
                  <View style={styles.rightSectionContainer}>
                    <View style={styles.mainTitleContainer}>
                      <Text
                        style={
                          styles.titleStyle
                        }>{`${item.givenName} ${item.familyName}`}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              //   <ContactListItem
              //     key={contact.item.recordID}
              //     item={contact.item}
              //     handleOpenContact={() => openContact}
              //   />
            );
          }}
          keyExtractor={item => item.recordID}
        />
      </View>
      <Loader loading={loading} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginBottom: '10%',
    paddingVertical: 18,
  },
  header: {
    backgroundColor: '#4591ed',
    color: colors.primaryOrange,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === 'android' ? undefined : 15,
  },
  itemContainer: {
    flexDirection: 'row',
    minHeight: 44,
    height: 63,
  },
  leftElementContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    paddingLeft: 13,
  },
  rightSectionContainer: {
    marginLeft: 18,
    flexDirection: 'row',
    flex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#515151',
  },
  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  titleStyle: {
    fontSize: 16,
  },
});
export default ContactsList;
