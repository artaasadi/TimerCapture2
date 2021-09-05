// import libraries and components
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Button,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNFileFolderSelector from 'react-native-file-folder-selector';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// getting size of screen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Settings() {
  const select = () => {
    RNFileFolderSelector.Show({
      title: 'Select File',
      chooseFolderMode: true,
      onDone: path => {
        console.log('file selected: ' + path);
      },
      onCancel: () => {
        console.log('cancelled');
      },
    });
  };
  // state
  return (
    <View>
      <Text> Settings </Text>
      <View style={styles.addBtnImg}>
        <Button title={'select'} onPress={() => select()} />
      </View>
      <View style={styles.addBtnImg}>
        <Button title={'BACK'} onPress={() => Actions.pop()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E7EB',
  },
  header: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: '#1280C5',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: windowHeight * 0.02,
  },
  content: {
    flex: 0.6,
    backgroundColor: '#E0E7EB',
  },
  text: {
    paddingBottom: windowHeight * 0.02,
    fontSize: 18,

    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'GloriaHallelujah-Regular',
  },
  iconArea: {
    flexDirection: 'row',
  },
  img: {
    margin: windowWidth * 0.02,
    padding: windowHeight * 0.02,
    height: windowHeight * 0.03,
    width: windowWidth * 0.03,
  },
  addBtnImg: {
    zIndex: 100,
    width: windowWidth * 0.3,
    height: windowHeight * 0.3,
  },
  footer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: windowHeight * 0.05,
  },
});
