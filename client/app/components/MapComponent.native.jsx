import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function MapComponent() {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      await axios.post(`${API_BASE}/api/locations`, selectedLocation);
      Alert.alert('Saved!', `${selectedLocation.name} has been saved.`);
    } catch (err) {
      Alert.alert('Error', 'Could not save location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 29.6516,
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
      </MapView>

      {/* Search bar on top of map */}
      <GooglePlacesAutocomplete
        placeholder="Search for a location..."
        fetchDetails={true}
        onPress={handleLocationSelect}
        query={{ key: GOOGLE_API_KEY, language: 'en' }}
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