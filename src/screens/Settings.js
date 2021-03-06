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
  Button, TextInput,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNFileFolderSelector from 'react-native-file-folder-selector';
import RNFS from 'react-native-fs';
import { Input } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

// getting size of screen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Settings() {
  const [timer, setTimer] = useState(null);
  const [path, setPath] = useState(null)
  useEffect(() => {
        console.log('change');
        if (timer != null & path != null) {
          const file = {
            path: path,
            timer: timer,
          };
          saveFile(file);
        }
      }, [timer, path]);
  useEffect(async () => {
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
      console.log('setting');
      const jsonData = await getSetting()
      if ('path' in jsonData) {
        setPath(jsonData['path']);
      } else {
        console.log(jsonData)
        setPath(RNFS.ExternalDirectoryPath);
      }
      if ('timer' in jsonData) {
        console.log(jsonData['timer']);
        setTimer(jsonData.timer);
      } else {
        setTimer(10)
      }

    }, []);
  const getSetting = async () => {
    try {
      const data = await RNFS.readFile(RNFS.ExternalDirectoryPath + '/settings.txt');
      const jsonData = JSON.parse(data);
      console.log('here');
      console.log(jsonData);
      return jsonData;
    } catch (e) {
      console.log(e);
    }
  };
  const selectPath = () => {
    RNFileFolderSelector.Show({
      title: 'Select File',
      chooseFolderMode: true,
      onDone: path => {
        setPath(path)
      },
      onCancel: () => {
        console.log('cancelled');
      },
    });
  };
  const saveFile = value => {
    const settingPath = RNFS.ExternalDirectoryPath + '/settings.txt';
    const jsonValue = JSON.stringify(value);
    RNFS.writeFile(settingPath, jsonValue, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  // state
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}> Settings </Text>
      </View>
      <View style={styles.addBtnImg}>
        <Button title={'select directory'} onPress={() => selectPath()} />
      </View>
      <Input
          placeholder='Place your Text'
          value={timer}
          onChangeText={nextValue => setTimer(nextValue)}
      />
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
