import { useState, useEffect, useReducer } from 'react';
import api from '../../api';
import { Platform } from 'react-native';
import * as Location from 'expo-location';


const ACCEPTED_DIST = 1000

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

const locReducer = (state, action) => {
    switch(action.type) {
        case 'CLOSE':
            return { ...state, proxy: true };
        case 'FAR':
            return { ...state, proxy: false };
        default:
            return state;
    }
};


const getCurrentLocationWeb = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported by browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};


export function useGymProximity(user) {
    const [state, proxyDispatch] = useReducer(locReducer, { proxy: false });

    async function getCurrentLocation() {
        if (Platform.OS === 'web') {
            return await getCurrentLocationWeb();
        } else {
            //changed this to await backend location?
            const loc = await Location.getCurrentPositionAsync({});
                return {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                };
        }
    }

    useEffect(() => {
        let interval;
        async function checkProximity() {
            try {
                const userName = user.username
                const currLoc = await getCurrentLocation()
                const gymLoc = await api.get(`/api/${userName}/gym-location`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                const distance = getDistance(
                    currLoc.latitude, currLoc.longitude,
                    gymLoc.data.latitude, gymLoc.data.longitude
                );

                console.log("Current Location:", currLoc);
                console.log("Gym Location:", gymLoc.data);
                console.log(distance)

                // dispatch based on distance
                if (distance <= ACCEPTED_DIST) {
                    proxyDispatch({ type: 'CLOSE' });
                } else {
                    proxyDispatch({ type: 'FAR' });
                }

            } catch (error) {
                console.error("Error checking gym proximity:", error);
                proxyDispatch({ type: 'FAR' });
            }
        }

        if (user?.username) {
            checkProximity(); //run immediately
            interval = setInterval(checkProximity, 10000); //then every min
        }
        return () => clearInterval(interval);
    }, [user]);

    return { atGym: state.proxy, proxyDispatch };
}