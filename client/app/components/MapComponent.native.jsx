import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import { router } from 'expo-router';
import api from '../../api.js'
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK } from '../tasks/locationTask.js';
import * as Location from 'expo-location';


const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function MapComponent() {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
    const { user } = useAuthContext();
    const [currLocation, setCurrLocation] = useState({})
    const [markers, setMarkers] = useState([]);


    const startBackgroundTracking = async () => {
        // Need both foreground and background permission
        const { status: foreground } = await Location.requestForegroundPermissionsAsync();
        const { status: background } = await Location.requestBackgroundPermissionsAsync();

        if (foreground !== 'granted' || background !== 'granted') {
            Alert.alert('Permission denied', 'Background location access is required');
            return;
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5 * 60 * 1000,  // check every 5 minutes
            distanceInterval: 50,          // or every 50 meters, whichever comes first
            showsBackgroundLocationIndicator: true,
        });
    };

    const stopBackgroundTracking = async () => {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    };




const getCurrLocation = async () => {
    try {
        const loc = await api.get(`/api/${user.username}/user-location`, {
            headers: {
            'Authorization': `Bearer ${user.token}`
            }
        }


    );


        if(loc.data.latitude == 0 && loc.data.longitude == 0) startBackgroundTracking()

        return loc.data;
    } catch (err) {
        console.log(err)
    }
};



    const handleMapPress = (event) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setMarkers(prev => [...prev, { latitude, longitude }]);
    };

    useEffect(() => {
        const fetchLocation = async () => {
            Alert.alert('Find your gym and save it!');
            const loc = await getCurrLocation();
            setCurrLocation(loc);
        };

        fetchLocation();
    }, []);


  const handleLocationSelect = (data, details) => {
    const location = {
      name: data.description,
      placeId: data.place_id,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };
    setSelectedLocation(location);
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  const saveLocation = async () => {
    if (!selectedLocation) return;
    try {
        console.log(user.username)
        console.log(selectedLocation.latitude)
        console.log(selectedLocation.longitude)
      await api.post(`/api/${user.username}/locations`, {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          headers: {
		    'Authorization': `Bearer ${user.token}`
          }

          });
      Alert.alert(
          'Saved!',
          `${selectedLocation.name} has been saved as your gym.`,
          [
              {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/home')
              }
          ]
      );
    } catch (err) {
        console.log(err)
        Alert.alert('Error', 'Could not save location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onPress = {handleMapPress}
        initialRegion={{
//           latitude: currLocation?.latitude ?? 29.6516,
//           longitude: currLocation?.longitude ?? -82.3248,
            latitude: 29.6536,
            longitude: -82.3248,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={selectedLocation.name}
          />
        )}
        {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              pinColor="red"
            />
          ))}
      </MapView>

      <GooglePlacesAutocomplete
        placeholder="Search for a location..."
        fetchDetails={true}
        onPress={(data, details) => {
            handleLocationSelect(data, details);

            }}
        onFail={(error) => console.error('Places error:', error)}
          onNotFound={() => console.warn('No results found')}
        query={{ key: GOOGLE_API_KEY, language: 'en' }}
        minLength= {2}
        debounce = {300}
        enabledPoweredByContainer = {false}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
        }}
      />

      {selectedLocation && (
        <TouchableOpacity style={styles.saveBtn} onPress={saveLocation}>
          <Text style={styles.saveBtnText}>💾 Save Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    ...StyleSheet.absoluteFillObject, // fills the entire container
  },
  searchContainer: {
    position: 'absolute',
    top: 10, left: 10, right: 10,
    zIndex: 10,
  },
  searchInput: { borderRadius: 8, elevation: 4, fontSize: 16 },
  saveBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 5,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});