import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api.js';

export const LOCATION_TASK = 'background-location-task';

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = Number(lat2) * Math.PI / 180;
    const Δφ = (Number(lat2) - lat1) * Math.PI / 180;
    const Δλ = (Number(lon2) - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error(error);
        return;
    }
    if (data) {
        const { latitude, longitude } = data.locations[0].coords;
        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token');

        const gymLoc = await api.get(`/api/${username}/gym-location`,
        {headers: {
            'Authorization': `Bearer ${user.token}`
        }});

        const distance = getDistance(latitude, longitude, gymLoc.data.gymLat, gymLoc.data.gymLon);

        if (distance < 100) {
        console.log("streak updated")
            await api.post('/api/user/update-streak', { username }, {
            });
        }
    }
});