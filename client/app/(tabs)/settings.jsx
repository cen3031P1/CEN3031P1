import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ScrollView} from 'react-native';
import { useEffect, useState } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';
import SettingButton from '../components/SettingButton.jsx';
import { CircleUserRound, Crosshair, Dumbbell, Eye, HatGlasses, SquareArrowRightExit, Target, Trash } from 'lucide-react-native';

// user can modify profile picture, account deletion, setting gym and goal, and toggling privacy mode
// maybe admin can do the same + modify a users or their own stats?

export default function SettingScreen() {


	async function handleProfile(){
		console.log("nothing yet");
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
	async function handlePrivacy(){
		setPrivacyStatus(prev => !prev);
	}

	const [isAdmin,setisAdmin] = useState(false)
	// modifying the privacy status will visually toggle the icon
	const [PrivacyStatus, setPrivacyStatus] = useState(false) 

	return (
	<ScrollView>
		<View style={styles.container}>
			<SettingButton onPress={() => handlePrivacy()} Icon = {HatGlasses} isPrivacy = 'true' PrivateOn = {PrivacyStatus}>Toggle Privacy</SettingButton>
			<SettingButton onPress={() => handleProfile()} Icon = {CircleUserRound}>Set Profile Picture</SettingButton>
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