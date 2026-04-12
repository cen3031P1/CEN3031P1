import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image} from 'react-native';
import TitleComp from '../components/Titles.jsx';
import ProfileDisplay from '../components/ProfileDisplay.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import api from '../../api.js';

// will display profile picture
// log button
// goal
// streak
// badges 

async function handleLog(){
	console.log("nothing yet");
}

export default function HomeScreen() {
	const { user } = useAuthContext();
	console.log('user:', user);

	const [points, setPoints] = useState(0);
	const [streak, setStreak] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);
	const [streakimage, setStreakImage] = useState("");

	useEffect(() => {
		if (user) {
			console.log("User is authenticated, fetching user data...");
			fetchUserData()
		}
	}, [user]);


	useEffect(() => {
		if (!user) {
			router.replace('/');
		}
	}, [user]);

	async function fetchUserData() {
		try {
			const response = await api.get(`/api/user/${user.username}/points`,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			);
			setPoints(response.data.points);
		}
		catch (error) {
			console.error("Error fetching user data:", error);
		}

		try {
			const response = await api.get(`/api/user/${user.username}/streak`,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			);
			setStreak(response.data.streak);
		}
		catch (error) {
			console.error("Error fetching user data:", error);
		}

		try {
			const response = await api.get(`/api/user/${user.username}/best-streak`,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			);
			setBestStreak(response.data.bestStreak);
		}
		catch (error) {
			console.error("Error fetching user data:", error);
		}
	}

	useEffect(() => {
		if (streak >= 20) {
			setStreakImage(require('../assets/images/streak20.png'));
		}
		else if (streak >= 15) {
			setStreakImage(require('../assets/images/streak15.png'));
		}
		else if (streak >= 10) {
			setStreakImage(require('../assets/images/streak10.png'));
		} 
		else if (streak >= 5) {
			setStreakImage(require('../assets/images/streak5.png'));
		}
		else {
			setStreakImage(null);
		}
	}, [streak]);

  return (	
	<ScrollView>
		<View style = {styles.container}>
			<TitleComp style = {{fontSize: 36}}>MY PROFILE</TitleComp> 
			
			<Image
			source={
				user?.profilePic
				? { uri: user.profilePic }
				: require('../assets/images/defaultpfp.png')
			}

			style = {styles.Profile}
			/>
			<AppText style ={{fontSize: 14}}>{user?.username}</AppText>
			<AppText style ={{fontSize: 10, textAlign: 'center', color: 'grey'}}>BIO - asdasdasdasdasd</AppText>


				<View style = {styles.featureBoxContainer}>

					<ProfileDisplay type='goal' base_numval={streak} optimal_numval={2}>GOAL</ProfileDisplay>
					<ProfileDisplay type='streak' base_numval={streak} imgsrc={streakimage}>STREAK</ProfileDisplay>
					<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: '45%'}} onPress={handleLog} >LOG</ProfileDisplay>
					<ProfileDisplay type='badges' style = {{width: '100%', aspectRatio: 0, height: '50%'}} >BADGES</ProfileDisplay>
				</View>
		</View>
	</ScrollView>
  );
}

const styles = StyleSheet.create({
	container: {	
		alignItems: 'center',
		padding: 12,
		gap: 15,
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
		gap: 8,
	},
});