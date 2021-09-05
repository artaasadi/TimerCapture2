import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Button,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
// getting size of screen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Capture() {
  const [{cameraRef}, {takePicture}] = useCamera(null);
  const captureHandler = async () => {
    try {
      const data = await takePicture();
      const date = new Date();
      const nowStr = date.getTime();
      const newFilePath =
        '/storage/emulated/0/Download' + '/' + nowStr + 'testFile.jpg';
      console.log(data.uri);
      console.log(newFilePath);
      await RNFS.moveFile(data.uri, newFilePath);
    } catch (e) {
      console.log(e);
    }
  };
  // state
  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        ref={cameraRef}
        type={RNCamera.Constants.Type.front}>
        <View style={styles.addBtnImg}>
          <Button title={'capture'} onPress={() => captureHandler()} />
        </View>
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
