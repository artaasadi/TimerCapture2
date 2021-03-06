// import libraries and components
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions, Button,
} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';
import Settings from './Settings';
import Capture from './Capture';
import {Actions} from 'react-native-router-flux';
import RNFS from 'react-native-fs';

// getting size of screen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Home() {

  useEffect(async () => {
    console.log('initial');
    const check = await RNFS.exists(RNFS.ExternalDirectoryPath + '/settings.txt');
    if (!check) {
      const value = {
        path: RNFS.ExternalDirectoryPath,
        timer: 20,
      };
      const settingPath = RNFS.ExternalDirectoryPath + '/settings.txt';
      const jsonValue = JSON.stringify(value);
      RNFS.writeFile(settingPath, jsonValue, 'utf8')
          .then(success => {
            console.log('FILE WRITTEN!');
          })
          .catch(err => {
            console.log(err.message);
          });
    }

  }, []);

  // state
  return (
    <View style={styles.container}>
      <View style={styles.addBtnImg}>
        <Button title={'SETTINGS'} onPress={() => Actions.settings()} />
      </View>
      <View style={styles.addBtnImg}>
        <Button title={'CAPTURE'} onPress={() => Actions.capture()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E7EB',
    alignItems: 'center',
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
