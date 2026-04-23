import { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import {useAuthContext} from '../hook/useAuthContext.jsx'
import api from '../../api.js'
import { router } from 'expo-router';


const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const LIBRARIES = ['places'];
const containerStyle = { width: '100%', height: '100vh' };
const defaultCenter = { lat: 29.6516, lng: -82.3248 };

export default function MapComponent() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries: LIBRARIES,
    });
    const {user} = useAuthContext()
    const [markers, setMarkers] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const mapRef = useRef(null);

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSelectedLocation({ lat, lng, name: place.name });
            mapRef.current?.panTo({ lat, lng });
            setMarkers(prev => [...prev, { lat, lng }]);
        }
    };

    const saveLocation = async () => {
        if (!selectedLocation) return;
        try {
            await api.post(`/api/${user.username}/locations`,
                {
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
                },
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                    }
            }
        );

            alert(`${selectedLocation.name} saved as your gym!`);
            router.replace('/(tabs)/home')
        } catch (err) {
            console.error(err)
            alert('Could not save location');
        }
    };

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="Search for a location..."
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 10,
                        padding: '10px',
                        width: '300px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                    }}
                />
            </Autocomplete>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={13}
                onLoad={onLoad}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker} />
                ))}
            </GoogleMap>

            {selectedLocation && (
                <button
                    onClick={saveLocation}
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#4285F4',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '24px',
                        border: 'none',
                        fontSize: '16px',
                        cursor: 'pointer',
                        zIndex: 10,
                    }}
                >
                    Save Location
                </button>
            )}
        </div>
    );
}