import { View, Text, Alert, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';
import api from '../../api.js';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SettingScreen() {
	const { user, dispatch } = useAuthContext();
	const [visibleOnLeaderboard, setVisibleOnLeaderboard] = useState(true); // setVisibleOnLeaderboard updates visibleOnLeaderboard

	////////////////////////////////////////////////////////////////////////////////////
	// LEADERBOARD VISIBILITY TOGGLE

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


	////////////////////////////////////////////////////////////////////////////////////
	// PROFILE PICTURE UPLOAD

	async function handleSetProfilePicture(){

		// Request permission to access media library
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
		  Alert.alert('Permission Denied', 'Permission to access media library is required!');
		  return;
		}

		// Open image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1], // square aspect ratio
			quality: 1,
		});

		if (result.canceled) {
			return;
		}

		// Compress the image to reduce file size
		const manipulated = await ImageManipulator.manipulateAsync(
			result.assets[0].uri,
			[{ resize: { width: 300 } }], 
			{ compress: 0.7, format: ImageManipulator.SaveFormat.WEBP, base64: true }
		);

		// Upload the image to the server
		try {
			const response = await api.patch(`/api/user/${user.username}/profile-pic`, {
				profilePic: `data:image/webp;base64,${manipulated.base64}`,
			});

			// Update user profile pic in auth context
			const updatedUser = {...user, profilePic: response.data.profilePic};
			dispatch({type: "LOGIN", payload: updatedUser});
			await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

			Alert.alert('Success', 'Profile picture updated!');
		} catch (error) {
			console.error('Error uploading profile picture:', error);
			Alert.alert('Upload Failed', 'Could not upload profile picture. Please try again.');
		}
	}


	async function handleDelete(){
		console.log("nothing yet");
	}

	return (
    <View style={styles.container}>
		<Pressable onPress = {() => handleSetProfilePicture()}style={styles.settingsButton}>
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