import React, {useState, useEffect, useRef} from 'react';
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
import RNLocation from 'react-native-location';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons'



RNLocation.configure({
  distanceFilter: null,
});

// getting size of screen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


export default function Capture() {
  const [timer, setTimer] = useState(null);
  const [path, setPath] = useState(null);
  const [counter, setCounter] = useState(null);
  const [state, setState] = useState(true);
  const [cameraSide, setCameraSide] = useState(RNCamera.Constants.Type.back);

  useInterval(async () => {
    if (state){
      await action();
    }
  }, timer * 1000);

  useEffect(async () => {
      await initSetting();
      console.log('path = ' + path)
      const jsonData = await init();
      setCounter(Object.keys(jsonData).length);
    }, []
  )

  const initSetting = async () => {
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
    try {
      const data = await RNFS.readFile(RNFS.ExternalDirectoryPath + '/settings.txt');
      const jsonData = JSON.parse(data);
      setPath(jsonData['path']);
      setTimer(jsonData['timer']);
    } catch (e) {
      console.log(e);
    }
  }
  const init = async () => {
    try {
      await RNFS.mkdir(path + '/data');
      await RNFS.mkdir(path + '/data/pics');
    } catch (e) {

    }
    let jsonData = {};
    const checkForData = await RNFS.exists(path + '/data/data.txt');
    if (checkForData) {
      try {
        const data = await RNFS.readFile(path + '/data/data.txt');
        jsonData = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
    } else {
      const jsonValue = JSON.stringify(jsonData);
      RNFS.writeFile(path + '/data/data.txt', jsonValue, 'utf8')
          .then(success => {
            console.log('FILE WRITTEN!');
          })
          .catch(err => {
            console.log(err.message);
          });
    }
    return jsonData;
  }
  const action = async () => {
    const picLocation = await captureHandler()
    const geo = await getGeoHandler();
    let jsonData = {};
    try {
      const data = await RNFS.readFile(path + '/data/data.txt');
      jsonData = JSON.parse(data);
    } catch (e) {
      console.log(e);
      jsonData = await init();
    }
    if (geo != null & picLocation != null) {
      jsonData[Date.now()] = {
        geo: geo,
        picLocation: picLocation,
      };
    }

    setCounter(Object.keys(jsonData).length);
    const jsonValue = JSON.stringify(jsonData);
    RNFS.writeFile(path + '/data/data.txt', jsonValue, 'utf8')
        .then(success => {
          console.log('FILE WRITTEN!');
        })
        .catch(err => {
          console.log(err.message);
        });
    console.log(picLocation);
    console.log(geo);
  }
  const [{cameraRef}, {takePicture}] = useCamera();
  const captureHandler = async () => {
    try {
      const data = await takePicture();
      const date = new Date();
      const nowStr =
        date.getFullYear() +
        '_' +
        date.getMonth() +
        '_' +
        date.getDate() +
        '__' +
        date.getHours() +
        '_' +
        date.getMinutes() +
        '_' +
        date.getSeconds();
      const newFilePath =
        'pics/' +
        nowStr +
        '.jpg';
      if (path == null) {
        await initSetting();
      }
      await RNFS.moveFile(data.uri, path + '/data/' + newFilePath);
      return newFilePath;
    } catch (e) {
      console.log(e);
    }
  };
  const getGeoHandler = async () => {
    const permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });
    console.log('permission' + permission);
    const location = await RNLocation.getLatestLocation({timeout: 100});
    return location;
  };
  const stateSetter = () => {
    if (state) {
      setState(false);
    } else {
      setState(true);
    }
  }
  const switchCameraSide = () => {
    if (cameraSide == RNCamera.Constants.Type.back) {
      setCameraSide(RNCamera.Constants.Type.front)
    } else {
      setCameraSide(RNCamera.Constants.Type.back)
    }
  }
  // state
  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        ref={cameraRef}
        type={cameraSide}
        >
        <View style={styles.addBtnImg}>
          <Button title={'switch'} onPress={() => switchCameraSide()} />
        </View>
        <View style={styles.addBtnImg}>
          <Button title={'capture'} onPress={async () => {await action()}} />
        </View>
        <Text style={styles.text}>{counter}</Text>
        <View style={styles.addBtnImg}>
          <Button title={(() => {if (state) {return 'STOP'} else {return 'START'}})()} onPress={() => stateSetter()} />
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
    color: '#222222',
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
