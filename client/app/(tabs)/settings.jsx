import { View, Text, Alert, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';
import api from '../../api.js';


export default function SettingScreen() {
	const { user } = useAuthContext();
	const [visibleOnLeaderboard, setVisibleOnLeaderboard] = useState(true); // setVisibleOnLeaderboard updates visibleOnLeaderboard

	// Load current visibility setting when user changes
	useEffect(() => {
		async function loadVisibility() {
			if (!user?.username) {
				return;
			}

			try {
				// Get current visibility setting for this user
				const response = await api.get(`/api/leaderboard/visibility/${user.username}`);

				setVisibleOnLeaderboard(response.data.visibleOnLeaderboard !== false);
			} catch (error) {
				console.error("Error loading leaderboard visibility:", error);
			}
		}

		loadVisibility();
	}, [user]);

	// Toggle visibility on leaderboard
	async function handleTogglePrivacyMode() {
		if (!user?.username) {
			console.log("Not logged in");
			return;
		}

		const newVisibility = !visibleOnLeaderboard;

		try {
			// Set visibiliy to true/false
			await api.patch('/api/leaderboard/visibility', {
				userName: user.username,
				visibleOnLeaderboard: newVisibility,
			});
			setVisibleOnLeaderboard(newVisibility);
		} catch (error) {
			console.error('Error updating privacy mode:', error);
			Alert.alert('Update failed', 'Could not update your leaderboard privacy mode.');
		}
	}

	async function handleDelete(){
		console.log("nothing yet");
	}

	return (
    <View style={styles.container}>
		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Set Profile Picture</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Delete Account</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Set Gym</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Set Goal</Text>
		</Pressable>

		<Pressable onPress = {() => handleTogglePrivacyMode()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>
                {visibleOnLeaderboard ? 'Hide Me From Leaderboard' : 'Show Me On Leaderboard'}
            </Text>
		</Pressable>

	  
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center',
		gap: 15,
	},
	settingsButton: {
		width: 360,
		height: 50,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		alignItems: 'left',
		
	},
	settingText: {
		padding: 15,
	}
})