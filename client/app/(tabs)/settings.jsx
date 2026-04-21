import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ScrollView, Alert, Platform, Modal} from 'react-native';
import { useEffect, useState } from 'react';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import SettingButton from '../components/SettingButton.jsx';
import { CircleUserRound, Cog, Crosshair, Dumbbell, Eye, HatGlasses, NotebookPenIcon, SquareArrowRightExit, Target, Trash } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '../../api.js';
import SettingModal from '../components/setting_modal.jsx';


// user can modify profile picture, account deletion, setting gym and goal, and toggling privacy mode
// set pfp, set gym, and logout can just happen instantly, i can create a popup for the user to input the goal and maybe to confirm deletion.
// maybe admin can do the same + modify a users or their own stats?

export default function SettingScreen() {
	const { user, dispatch } = useAuthContext();
	const [visibleOnLeaderboard, setVisibleOnLeaderboard] = useState(true); // setVisibleOnLeaderboard updates visibleOnLeaderboard
	const [isAdmin,setisAdmin] = useState(false)

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [privacyStatus, setPrivacyStatus] = useState(false);

	const [showBioModal, setShowBioModal] = useState(false);
	const [showGymModal, setShowGymModal] = useState(false);
	const [showGoalModal, setShowGoalModal] = useState(false);
	const [showAdminModal, setShowAdminModal] = useState(false);
	const [showStreakModal, setShowStreakModal] = useState(false);

	const [bio, setBio] = useState('');
	const [bioErrorMessage, setBioErrorMessage] = useState('');

	const [gym, setGym] = useState([0,0]);

	const [goal, setGoal] = useState(0);
	const [goalErrorMessage, setGoalErrorMessage] = useState('');

	const [deletePassword, setDeletePassword] = useState('');
	const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);

	const [streak, setStreak] = useState(0);
	const [streakErrorMessage, setStreakErrorMessage] = useState('');

	const [otherUser, setotherUser] = useState('');
	const [otherUserErrorMessage, setOtherUserErrorMessage] = useState('');

	useEffect(() => {
		if (!user) {
			router.replace('/');
		}
	}, [user]);

	async function getUserRole() {

		if (!user?.username) {
			return;
		}

		try	{
			
			const response = await api.get(`/api/user/${user.username}/getRole`,
			{
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			setisAdmin(response.data.role === 'admin');
		} catch (error) {
			console.error("Error fetching user role:", error);
		}
	}

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
				const response = await api.get(`/api/leaderboard/visibility/${user.username}`, {
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				});

				setVisibleOnLeaderboard(response.data.visibleOnLeaderboard !== false);
			} catch (error) {
				console.error("Error loading leaderboard visibility:", error);
			}
		}

		getUserRole();
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
			}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			setVisibleOnLeaderboard(newVisibility);
			setPrivacyStatus(prev => !prev);
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
			const response = await api.patch(`/api/user/${user.username}/profile-pic`, 
				{
				profilePic: `data:image/webp;base64,${manipulated.base64}`
				},
				{
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			);

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
		setDeletePassword('');
		setDeleteErrorMessage('');
		setShowDeleteModal(true);
	}

	//////////////////////////////////////////////////////////////////////////////////
	// ACCOUNT DELETION

	async function handleConfirmDeleteAccount() {
		console.log("Attempting to delete account for user:", user?.username);
		if (!user?.username || isDeletingAccount) {
			return;
		}

		if (!deletePassword.trim()) {
			setDeleteErrorMessage('Invalid password!');
			return;
		}
		setDeleteErrorMessage('');
		setIsDeletingAccount(true);

		try {
			const response = await api.delete(`/api/user/${user.username}`, {
				data: { password: deletePassword },
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});

			if (response?.data?.code === 'WRONG_PASSWORD') {
				setDeleteErrorMessage('Invalid password!');
				return;
			}

			if (response?.data?.code === 'WRONG_USERNAME') {
				setDeleteErrorMessage('User not found. Please log in again.');
				return;
			}
			await AsyncStorage.removeItem('user');
			dispatch({ type: 'LOGOUT' });
			setDeletePassword('');
			setDeleteErrorMessage('');
			setShowDeleteModal(false);
			router.replace('/');
		} catch (error) {
			if (error?.response?.data?.code === 'WRONG_PASSWORD') {
				setDeleteErrorMessage('Invalid password!');
			} else if (error?.response?.data?.code === 'MISSING_FIELDS') {
				setDeleteErrorMessage('Password is required.');
			} else if (error?.response?.data?.code === 'WRONG_USERNAME') {
				setDeleteErrorMessage('User not found. Please log in again.');
			} else {
				setDeleteErrorMessage('Could not delete your account. Please try again.');
			}
		} finally {
			setIsDeletingAccount(false);
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	// MAKING ADMIN

	async function handleMakeAdmin(){
		setotherUser('');
		setOtherUserErrorMessage('');
		setShowAdminModal(true);
	}

	async function performMakeAdmin() {
		try {
			const response = await api.patch(`/api/user/makeAdmin`, {
				params: {otherUser: otherUser,
				userName: user.username}
				}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			setShowAdminModal(false);
		} catch (error) {
			if (error?.response?.data?.code === 'USER_NOT_FOUND') {
				setOtherUserErrorMessage('User not found.');
			} else if (error?.response?.data?.code === 'CANNOT_MODIFY_SELF') {
				setOtherUserErrorMessage('You cannot change your own role.');
			} else if (error?.response?.data?.code === 'USER_ALREADY_ADMIN') {
				setOtherUserErrorMessage('User is already an admin.');
			} else {
				setOtherUserErrorMessage('Could not update user role. Please try again.');
			}
		}
	}


	async function handleGym(){
		setShowGymModal(true);
	}

	//////////////////////////////////////////////////////////////////////////////////
	// SETTING BIO GOAL STREAK

	async function handleGoal(){
		setGoal('');
		setGoalErrorMessage('');
		setShowGoalModal(true);
	}

	async function performSetGoal(){
		try {
			const response = await api.patch(`/api/user/${user.username}/setGoal`, {
				goal: goal,
				}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});

			setShowGoalModal(false);
		} catch (error) {
			if (error?.response?.data?.code === 'GOAL_TOO_HIGH') {
				setGoalErrorMessage('Goal must be less than 999999.');
			} else if (error?.response?.data?.code === 'USER_NOT_FOUND') {
				setGoalErrorMessage('User not found. Please log in again.');
			} else {
				setGoalErrorMessage('Could not set goal. Please try again.');
			}
		}
	}

	const handleGoalvalue = (text) => {
		const numericText = text.replace(/[^0-9]/g, '');
		setGoal(numericText);
	}
	async function handleBio(){
		setBio('');
		setBioErrorMessage('');
		setShowBioModal(true);
	}

	async function performSetBio(){
		try {
			const response = await api.patch(`/api/user/${user.username}/setBio`, {
				bio: bio,
				}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}

			});
			setShowBioModal(false);
		} catch (error) {
			if (error?.response?.data?.code === 'USER_NOT_FOUND') {
				setBioErrorMessage('User not found. Please log in again.');
			} else if (error?.response?.data?.code === 'BIO_TOO_LONG') {
				setBioErrorMessage('Bio must be less than 150 characters.');
			} else {
				setBioErrorMessage('Could not set bio. Please try again.');
			}
		}
	}

	const handleStreakvalue = (text) => {
		const numericText = text.replace(/[^0-9]/g, '');
		setStreak(numericText);
	}

	async function handleSetStreak(){
		setStreak('');
		setStreakErrorMessage('');
		setShowStreakModal(true);
	}

	async function performSetStreak(){
		try {
			const response = await api.patch(`/api/user/${user.username}/setStreak`, {
				streak: streak,
				}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			setShowStreakModal(false);
		} catch (error) {
            console.log("====begin====")
            console.log(process.env.EXPO_PUBLIC_API_URL)
// 			if (error?.response?.data?.code === 'USER_NOT_FOUND') {
// 				setStreakErrorMessage('User not found. Please log in again.');
// 			} else if (error?.response?.data?.code === 'STREAK_TOO_HIGH') {
// 				setStreakErrorMessage('Streak must be a number between 0 and 9999.');
// 			}
            console.log('status:', error?.response?.status);
            console.log('data:', error?.response?.data);
            console.log('url:', error?.config?.url);
            console.log(error);
		}
	}

	/////////////////////////////////////////////////////////////////////////////////
	// LOGOUT

	async function performLogout() {
		try {
			await AsyncStorage.removeItem('user');
			dispatch({ type: 'LOGOUT' });
			router.replace('/home');
		} catch (error) {
			console.error('Error logging out:', error);
			Alert.alert('Logout failed', 'Could not log out. Please try again.');
		}
	}

	async function handleLogout(){
		setShowLogoutModal(true);
	}


	return (
	<ScrollView>
		<View style={styles.container}>
			<SettingButton onPress={() => handleTogglePrivacyMode()} Icon = {HatGlasses} isPrivacy = 'true' PrivateOn = {!visibleOnLeaderboard}>Toggle Privacy</SettingButton>
			<SettingButton onPress={() => handleSetProfilePicture()} Icon = {CircleUserRound}>Set Profile Picture</SettingButton>
			<SettingButton onPress={() => handleBio()} Icon = {NotebookPenIcon}>Set Bio</SettingButton>
			<SettingButton onPress={() => handleGym()} Icon = {Dumbbell}>Set Gym</SettingButton>
			<SettingButton onPress={() => handleGoal()} Icon = {Target}>Set Goal</SettingButton>
			<SettingButton onPress={() => handleDelete()} Icon = {Trash}>Delete Account</SettingButton>
			<SettingButton onPress={() => handleLogout()} Icon = {SquareArrowRightExit}>Logout</SettingButton>

			{/* maybe admins have exclusive settings */}
			{isAdmin && <SettingButton onPress={() => handleMakeAdmin()} Icon = {Cog}>Make Admin</SettingButton>}
			{isAdmin && <SettingButton onPress={() => handleSetStreak()} Icon = {Cog}>Set Streak</SettingButton>}

		</View>

		<SettingModal
			type='delete'
			title='Delete Account'
			subtext1='This action is permanent. Your profile and stats will be deleted.'
			subtext2='Are you sure you want to continue?'
			visible={showDeleteModal}
			onRequestClose={() => {
				if (!isDeletingAccount) {
					setShowDeleteModal(false);
				}
			}}
			onPress_cancel={() => {setShowDeleteModal(false)}}
			onPress_perform={() => {
				console.log("Attempting to delete account for user:", user?.username);
				handleConfirmDeleteAccount();
			}}
			isdeleting = {!isDeletingAccount}
			errorMessage = {deleteErrorMessage}
			value={deletePassword}
			onChangeText={setDeletePassword}
		/>

		<SettingModal
			type='logout'
			title='Log Out'
			subtext1='You will need to log in again to access your account.'
			subtext2='Do you want to continue?'
			action= 'Log Out'
			visible={showLogoutModal}
			onRequestClose={() => {setShowLogoutModal(false)}}
			onPress_cancel={() => {setShowLogoutModal(false)}}
			onPress_perform={async () => {
				setShowLogoutModal(false);
				await performLogout();
			}}
		/>

		<SettingModal
			type='bio'
			title='Set Bio'
			subtext1='Write a short bio to display on your profile.'
			subtext2='Bio must be less than 150 characters.'
			action= 'Set Bio'
			visible={showBioModal}
			errorMessage={bioErrorMessage}
			onRequestClose={() => {setShowBioModal(false)}}
			onPress_cancel={() => {setShowBioModal(false)}}
			onPress_perform={async () => {
				await performSetBio();
			}}
			onChangeText={(text) => setBio(text)}
		/>

		<SettingModal
			type='gym'
			title='Set Gym'
			subtext1='This setting with calibrate your current location as your gym.'
			subtext2='This can be changed at any time.'
			action= 'Set Gym'
			visible={showGymModal}
			onRequestClose={() => {setShowGymModal(false)}}
			onPress_cancel={() => {setShowGymModal(false)}}
			onPress_perform={async () => {
				setShowGymModal(false);
				console.log("New gym:", gym);
			}}
		/>

		<SettingModal
			type='goal'
			title='Set Goal'
			subtext1='Enter your fitness goal in terms of streaks. For example, "1000".'
			subtext2='This has to be less than 9999.'
			action= 'Set Goal'
			visible={showGoalModal}
			errorMessage={goalErrorMessage}
			onRequestClose={() => {setShowGoalModal(false)}}
			onPress_cancel={() => {setShowGoalModal(false)}}
			value = {goal}
			onPress_perform={async () => {	
				performSetGoal();
			}}
			onChangeText={(text) => handleGoalvalue(text)}
		/>

		<SettingModal
			type='make admin'
			title='Make Admin'
			subtext1='Enter the username of the user you want to make an admin.'
			subtext2='This action is not reversible yet.'
			action= 'Make Admin'
			visible={showAdminModal}
			errorMessage={otherUserErrorMessage}
			onRequestClose={() => {setShowAdminModal(false)}}
			onPress_cancel={() => {setShowAdminModal(false)}}
			value = {otherUser}
			onPress_perform={async () => {	
				performMakeAdmin(otherUser);
			}}
			onChangeText={(text) => setotherUser(text)}
		/>

		<SettingModal
			type='streak'
			title='Set Streak'
			subtext1='Enter your desired streak'
			subtext2='This has to be less than 9999.'
			action= 'Set Streak'
			visible={showStreakModal}
			errorMessage={streakErrorMessage}
			onRequestClose={() => {setShowStreakModal(false)}}
			onPress_cancel={() => {setShowStreakModal(false)}}
			value = {streak}
			onPress_perform={async () => {	
				performSetStreak();
			}}
			onChangeText={(text) => handleStreakvalue(text)}
		/>

	</ScrollView>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 25,
		alignItems: 'center',
		gap: 10,
	}
})