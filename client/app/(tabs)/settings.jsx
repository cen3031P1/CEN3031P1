import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ScrollView, Alert} from 'react-native';
import { useEffect, useState } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';
import SettingButton from '../components/SettingButton.jsx';
import { CircleUserRound, Crosshair, Dumbbell, Eye, HatGlasses, SquareArrowRightExit, Target, Trash } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api.js';

// user can modify profile picture, account deletion, setting gym and goal, and toggling privacy mode
// set pfp, set gym, and logout can just happen instantly, i can create a popup for the user to input the goal and maybe to confirm deletion.
// maybe admin can do the same + modify a users or their own stats?

export default function SettingScreen() {


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
	async function handleGym(){
		console.log("nothing yet");
	}
	async function handleGoal(){
		console.log("nothing yet");
	}
	async function handleLogout(){
		console.log("nothing yet");
	}
	// async function handlePrivacy(){
	// 	setPrivacyStatus(prev => !prev);
	// }

	const { user, dispatch } = useAuthContext();
	const [visibleOnLeaderboard, setVisibleOnLeaderboard] = useState(true);

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
			setPrivacyStatus(prev => !prev);
		} catch (error) {
			console.error('Error updating privacy mode:', error);
			Alert.alert('Update failed', 'Could not update your leaderboard privacy mode.');
		}
	}

	const [isAdmin,setisAdmin] = useState(false)

	// modifying the privacy status will visually toggle the icon
	const [PrivacyStatus, setPrivacyStatus] = useState(false) 

	return (
	<ScrollView>
		<View style={styles.container}>
			<SettingButton onPress={() => handleTogglePrivacyMode()} Icon = {HatGlasses} isPrivacy = 'true' PrivateOn = {PrivacyStatus}>Toggle Privacy</SettingButton>
			<SettingButton onPress={() => handleSetProfilePicture()} Icon = {CircleUserRound}>Set Profile Picture</SettingButton>
			<SettingButton onPress={() => handleGym()} Icon = {Dumbbell}>Set Gym</SettingButton>
			<SettingButton onPress={() => handleGoal()} Icon = {Target}>Set Goal</SettingButton>
			<SettingButton onPress={() => handleDelete()} Icon = {Trash}>Delete Account</SettingButton>
			<SettingButton onPress={() => handleLogout()} Icon = {SquareArrowRightExit}>Logout</SettingButton>


			{/* maybe admins have exclusive settings */}
			{isAdmin && <SettingButton onPress={() => handleDelete} Icon = {Eye} isPrivacy = 'true'>Set Goal</SettingButton>}

		</View>
	</ScrollView>

  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 25,
		alignItems: 'center',
		gap: 10,
	},
})