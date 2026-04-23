import { router} from 'expo-router';
import { useEffect, useState, useCallback} from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, TouchableOpacity, Text, Dimensions} from 'react-native';
import TitleComp from '../components/Titles.jsx';
import ProfileDisplay from '../components/ProfileDisplay.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import api from '../../api.js';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { LOCATION_TASK } from '../tasks/locationTask.js';
import { useGymProximity } from '../hook/useGymProximity.jsx';


async function handleLog(){
	console.log("nothing yet");
}

const {width, height} = Dimensions.get('window')

export default function HomeScreen() {
	const { user } = useAuthContext();
	const { atGym, proxyDispatch } = useGymProximity(user);
const [pointGain, setPointGain] = useState(0);
	const [start_time, setStartTime] = useState(null);
	const [minutes, setMinutes] = useState(0);

	const [streak, setStreak] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);
	const [goal, setGoal] = useState(0);
	const [profilePic, setProfilePic] = useState(null);
	const [bio, setBio] = useState('');
const [isTracking, setIsTracking] = useState(false);

    const startBackgroundTracking = async () => {
        const { status: foreground } = await Location.requestForegroundPermissionsAsync();
        const { status: background } = await Location.requestBackgroundPermissionsAsync();

        if (foreground !== 'granted' || background !== 'granted') {
            Alert.alert('Permission denied', 'Background location access is required');
            return;
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,   // 10 seconds for testing
            distanceInterval: 0,   // fire regardless of movement
            showsBackgroundLocationIndicator: true,
        });

        setIsTracking(true);
        Alert.alert('Tracking started!');
    };

useEffect(() => {
		if (!atGym && !start_time) { //for just now arriving
			setStartTime(Date.now());
		}
		if (!atGym && start_time) {
			//left the gym
			updateStreakAndPoints();
			setStartTime(null);
			setMinutes(0);
			setPointGain(0);
		}
	}, [atGym]);

    const stopBackgroundTracking = async () => {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
        setIsTracking(false);
        Alert.alert('Tracking stopped!');
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
async function updateStreakAndPoints() {
		if (pointGain === 0) return; //no points = skip
		try {
			//This is how database gets updated
			await api.patch(`/api/user/${user.username}/updateStreakAndPoints`,{
					points: points + pointGain,
					streak: streak + 1,
				},
				{ //This is the auth header
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			); //Using prev here since its async... alternative is fetching again ?
			//prev in this case is just curr points and streak
			setPoints(prev => prev + pointGain);
			setStreak(prev => prev + 1);
		}
		catch (error) {
			console.error("Error updating streak and points:", error);
		}
	}
  return (
	<ScrollView contentContainerStyle={{ paddingBottom: 200}}>
		<View style = {styles.container}>
			<View style= {{width: '100%', backgroundColor: colors.background, borderRadius: 20, alignItems: 'center',justifyContent: 'center',borderWidth: 5, borderColor: colors.primary, WrapText: true}}>
				<TitleComp style = {{fontSize: 25, margin: 20, marginBottom: 25, width: '100%'}}>MY PROFILE</TitleComp>

				<Image
				source={
					profilePic
					? { uri: profilePic }
					: require('../assets/images/defaultpfp.png')
				}
				style = {styles.Profile}
				/>
				<AppText style ={{fontSize: 12, margin: 15}}>{user?.username}</AppText>
				<AppText style ={{fontSize: 10, textAlign: 'center', color: 'grey', marginBottom: 15, marginTop: 10, WrapText: true, marginHorizontal: 20, width: '95%'}}>{bio}</AppText>
			</View>

				<View style = {styles.featureBoxContainer}>
					<ProfileDisplay type='goal' base_numval={streak} optimal_numval={goal}>GOAL</ProfileDisplay>
					<ProfileDisplay type='streak' base_numval={streak} imgsrc={streakimage}>STREAK</ProfileDisplay>
{/* 					<ProfileDisplay type='points' base_numval={points} imgsrc={pointsimage}>STREAK</ProfileDisplay> */}

{/* 		<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: 270}} atgym={atGym} onPress={handleLog} >LOG</ProfileDisplay> */}
                					<ProfileDisplay type='log' atgym={atGym} points={pointGain} time={minutes} style = {{width: '100%', aspectRatio: 0, height: 210}} >LOG</ProfileDisplay>

					<ProfileDisplay type='badges' min_bestStreak={bestStreak} style = {{width: '100%', aspectRatio: 0, height: '50%', flexWrap: 'wrap', marginTop: 0, paddingTop: 0}} >BADGES</ProfileDisplay>
				</View>
		</View>
{/* 		<TouchableOpacity */}
{/*             onPress={isTracking ? stopBackgroundTracking : startBackgroundTracking} */}
{/*             style={{ */}
{/*                 backgroundColor: isTracking ? 'red' : 'green', */}
{/*                 padding: 12, */}
{/*                 borderRadius: 8, */}
{/*                 margin: 10 */}
{/*             }} */}
{/*         > */}
{/*             <Text style={{ color: 'white' }}> */}
{/*                 {isTracking ? 'Stop Tracking' : 'Start Tracking'} */}
{/*             </Text> */}
{/*         </TouchableOpacity> */}
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
		borderWidth: 2,
		borderColor: 'lightgrey'
	},
	featureBoxContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap:10
	},
});
