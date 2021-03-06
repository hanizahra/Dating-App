/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  NavigatorIOS,
  AsyncStorage
} from 'react-native';
import NavigatorIOSApp from './src/components/navigator/NavigatorIOSApp';
import LoginForm from './src/components/user/account/LoginForm';
import SignupForm from './src/components/user/account/SignupForm';
import apiServices from './src/apiServices/apiServices';

type Props = {};

export default class Home extends Component<Props> {
  constructor(props){
    super(props)
    this.state = {
      hasInfo: false,
    };
     this.latitude = null;
     this.longitude =  null;
     this.place_id =  null;
     this.streetAddress =  null;
     this.name =  null;
     this.open =  null;
     this.id =  null;
     this.error = null;
  }

  getPosition = () => {
    return new Promise((resolve,reject) => {
      navigator.geolocation.getCurrentPosition((position) => {

        this.latitude =  position.coords.latitude;
        this.longitude =  position.coords.longitude;
        this.error =  null;
        console.log('getting user position', this.latitude, this.longitude);
        resolve();
      },
      (error) => {
        //this.setState({ error: error.message }); reject()
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
  };

  geocodeLocation  = () => {
    return new Promise((resolve, reject) => {

     fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.latitude+','+this.longitude+'&key=AIzaSyC8ghKwfyUigqf7l0z06zJXOCHsXBKUgyw')
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log('this is the place id => ' + JSON.stringify(jsonResponse["results"][0]["place_id"]))
        // this.setState({
          this.place_id =  jsonResponse["results"][0]["place_id"];
          this.streetAddress =  jsonResponse["results"][0]["formatted_address"];
        // });
        console.log('geocoding user location')
        console.log('street address here', this.streetAddress);
        resolve();
    });

    });

  }

  getLocationDetails = () => {

    console.log('getLocationDetails', this.latitude, this.longitude, this.place_id);
    let url = 'https://maps.googleapis.com/maps/api/place/details/json?location='+this.latitude+','+this.longitude+'&placeid='+this.place_id+'&key=AIzaSyC8ghKwfyUigqf7l0z06zJXOCHsXBKUgyw';
    console.log('url', url);
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((jsonResponse) => {
          // console.log('these are location name details --> ', jsonResponse["result"]["name"]);
          //console.log('these are location formatted_address details --> ', jsonResponse["result"]["formatted_address"]);
          //console.log('these are location place_id details --> ', jsonResponse["result"]["place_id"]);
          //console.log('these are location url details --> ', jsonResponse["result"]["url"]);

          apiServices.addLocation(jsonResponse["result"])
          console.log('this is the new object ----> ', jsonResponse["result"])
          resolve();
        }).catch((err) => {
            console.log('error -->', err)
          })
      });
  }

  runPositionPoll = () => {
    navigator.geolocation.watchPosition(() => {
    // setInterval(() =>
    // {
        this.getPosition()
        .then((result) => {
          return this.geocodeLocation();
        })
        .then((result) => {
          return this.getLocationDetails();
        })
        .then((result) => {
          this.setState({hasInfo:true});
          console.log('current location: ', this.latitude, this.longitude);
        });
      });
    // },5000);
  }

  componentDidMount() {
    this.runPositionPoll();
  }

  render() {
    let locationData = 'Loading...';
    if(this.state.hasInfo) {
      console.log('this is latitude', this.name)
      locationData = (
        <Text>
         {this.latitude}
          {this.longitude}
          {this.placeId}
          {this.streetAddress}
          {this.name}
          {this.open}
          {this.id}
        </Text>
      );
    }

    return (
      <View style={styles.wrapper}>
        <Text>

          {locationData}

        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
  flex: 1,
  },
  container: {
    flex: 1,

    backgroundColor: '#fab1a0',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#0984e3',
    marginBottom: 5,
  },
});
