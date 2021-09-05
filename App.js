// import libraries and components
import React, {Component} from 'react';
import {Router, Scene} from 'react-native-router-flux';
import {StyleSheet} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

//import local files
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';
import Capture from './src/screens/Capture';
const App = () => {
  return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Router>
          <Scene key="root">
            <Scene
              key="home"
              component={Home}
              title="home"
              initial={true}
              hideNavBar
            />

            <Scene key="settings" component={Settings} title="addEdit" hideNavBar />

            <Scene key="capture" component={Capture} title="capture" hideNavBar />
          </Scene>
        </Router>
      </ApplicationProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E7EB',
  },
});
