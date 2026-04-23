import { router} from 'expo-router';
import { useEffect, useState, useCallback, use} from 'react';
import { View, ScrollView, StyleSheet, Image} from 'react-native';
import TitleComp from '../components/Titles.jsx';
import ProfileDisplay from '../components/ProfileDisplay.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import api from '../../api.js';
import { useFocusEffect } from '@react-navigation/native';
import { useGymProximity } from '../hook/useGymProximity.jsx';

// async function handleLog(){
// 	console.log("nothing yet");
// }

export default function HomeScreen() {
	const { user } = useAuthContext();
	//Using new hook to check if user is at gym
	const atGym = useGymProximity(user);
	const [pointGain, setPointGain] = useState(0);
	const [start_time, setStartTime] = useState(null);
	const [minutes, setMinutes] = useState(0);
	const [isTracking, setIsTracking] = useState(false);
	const [points, setPoints] = useState(0);

	const [streak, setStreak] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);
	const [goal, setGoal] = useState(0);
	const [profilePic, setProfilePic] = useState(null);
	const [bio, setBio] = useState('');

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

	//point gain and minutes tracking
	useEffect(() => {
		if (!start_time || !atGym) {
			return;
		}
		const interval = setInterval(() => {
			//this formula is basically 10 points per minute at the gym (i guessed)
			const elapsed = Math.floor((Date.now() - start_time) / 60000);
			setMinutes(elapsed);
			setPointGain(elapsed + bestStreak);
		}, 60000); //update every 60 seconds
		return () => clearInterval(interval); //clean
		}, [start_time, atGym, bestStreak]);

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
			setPoints(response.data.points);
			setBestStreak(response.data.bestStreak);
		}
		catch (error) {
			console.error("Error fetching user data:", error);
		}
	}
	//This is for if they stay at gym
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
					<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: '45%'}} points = {pointGain} atGym = {atGym}>LOG</ProfileDisplay>
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
