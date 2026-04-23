import { useState, useEffect } from 'react';
import api from '../api';

//From old jsx file
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
//Use hook to get distance from gym and return boolean for if user is within 100m of gym
export function useGymProximity(user) {
    const [atGym, setAtGym] = useState(false); //Pair values for distance and boolean for if at gym
    useEffect(() => {
        //probably should check if empty but idk what the vars are called
        async function checkProximity() {
            try {
                let currLoc = await api.get(`api/${user.username}/user-location`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
            }
        });
                let gymLoc = await api.get(`api/${user.username}/gym-location`, {
                headers:{
                    'Authorization': `Bearer ${user.token}`
            }
        });
        //Was this calling Distance for a reason?
        const distance = getDistance(currLoc.data.latitude, currLoc.data.longitude,
                                    gymLoc.data.latitude, gymLoc.data.longitude);
            setAtGym(distance <= 100); //Set atGym to true if within 100m
            } catch (error) {
                console.error("Error checking gym proximity:", error);
                setAtGym(false); //Default to false on error
            }
        }
        checkProximity();
    }, [user]);
    return atGym;
}