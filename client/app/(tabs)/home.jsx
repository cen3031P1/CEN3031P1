import { router} from 'expo-router';
import { useEffect, useState, useCallback} from 'react';
import { View, ScrollView, StyleSheet, Image} from 'react-native';
import TitleComp from '../components/Titles.jsx';
import ProfileDisplay from '../components/ProfileDisplay.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import api from '../../api.js';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
// will display profile picture
// log button
// goal
// streak
// badges 

const LOCATION_TASK = 'background-location-task';

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
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
    if (data) {
        const { latitude, longitude } = data.locations[0].coords;
        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token');

        const gymLoc = await api.get('/gym-location', {
            params: { username },
            headers: { Authorization: `Bearer ${token}` }
        });

        const distance = getDistance(latitude, longitude, gymLoc.data.gymLat, gymLoc.data.gymLon);

        if (distance < 100) {
//             await api.post('/api/user/update-streak', { username }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
        }
    }
});

async function handleLog(){
	console.log("nothing yet");
}

export default function HomeScreen() {
	const { user } = useAuthContext();

	const [streak, setStreak] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);
	const [goal, setGoal] = useState(0);
	const [profilePic, setProfilePic] = useState(null);
	const [bio, setBio] = useState('');


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


	useEffect(() => {
		if (!user) {
			router.replace('/');
		}
	}, [user]);

	useFocusEffect(
		useCallback(() => {
			if (user) {
				fetchUserData()
			}
		}, [user])
	);

	async function fetchUserData() {
		if (!user?.username) {
			return;
		}

		try {
			const response = await api.get(`/api/user/${user.username}/fetchProfileData`,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			);

			setGoal(response.data.goal);
			setStreak(response.data.streak);
			setBestStreak(response.data.bestStreak);
			setProfilePic(response.data.profilePic);
			setBio(response.data.bio);
		}
		catch (error) {
			console.error("Error fetching user data:", error);
		}
	}

	const streakimage = 
		streak >= 20 ? require('../assets/images/streak20.png') :
		streak >= 15 ? require('../assets/images/streak15.png') :
		streak >= 10 ? require('../assets/images/streak10.png') :
		streak >= 5 ? require('../assets/images/streak5.png') :
		null;
	
	const min_bestStreak = 
		bestStreak >= 20 ? 4 :
		bestStreak >= 15 ? 3 :
		bestStreak >= 10 ? 2 :
		bestStreak >= 5 ? 1 :
		0;

  return (	
	<ScrollView contentContainerStyle={{ paddingBottom: 120}}>
		<View style = {styles.container}>
			<View style= {{width: '100%', backgroundColor: colors.background, borderRadius: 20, alignItems: 'center',justifyContent: 'center',borderWidth: 5, borderColor: colors.primary, WrapText: true}}>
				<TitleComp style = {{fontSize: 30, margin: 20, marginBottom: 25}}>MY PROFILE</TitleComp>
				
				<Image
				source={
					profilePic
					? { uri: profilePic }
					: require('../assets/images/defaultpfp.png')
				}
				style = {styles.Profile}
				/>
				<AppText style ={{fontSize: 14, margin: 15}}>{user?.username}</AppText>
				<AppText style ={{fontSize: 10, textAlign: 'center', color: 'grey', marginBottom: 15, marginTop: 10, WrapText: true, marginHorizontal: 20}}>{bio}</AppText>
			</View>


				<View style = {styles.featureBoxContainer}>
					<ProfileDisplay type='goal' base_numval={streak} optimal_numval={goal}>GOAL</ProfileDisplay>
					<ProfileDisplay type='streak' base_numval={streak} imgsrc={streakimage}>STREAK</ProfileDisplay>
					<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: '45%'}} onPress={handleLog} >LOG</ProfileDisplay>
					<ProfileDisplay type='badges' min_bestStreak={bestStreak} style = {{width: '100%', aspectRatio: 0, height: '50%', flexWrap: 'wrap'}} >BADGES</ProfileDisplay>
				</View>
		</View>
	</ScrollView>
  );
}

const styles = StyleSheet.create({
	container: {	
		alignItems: 'center',
		padding: 12,
		gap: 10,
	},
	Profile: {
		height: 120, 
		width: 120,
		borderRadius: 60,
	},
	featureBoxContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap:10
	},
});