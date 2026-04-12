import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ScrollView, Alert, Platform, Modal} from 'react-native';
import { useEffect, useState } from 'react';
import {useAuthContext} from '../hook/useAuthContext.jsx';
import SettingButton from '../components/SettingButton.jsx';
import { CircleUserRound, Crosshair, Dumbbell, Eye, HatGlasses, NotebookPenIcon, SquareArrowRightExit, Target, Trash } from 'lucide-react-native';
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

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showBioModal, setShowBioModal] = useState(false);
	const [showGymModal, setShowGymModal] = useState(false);
	const [showGoalModal, setShowGoalModal] = useState(false);

	
	const [bio, setBio] = useState('');
	const [gym, setGym] = useState([0,0]);
	const [goal, setGoal] = useState('');
	const [deletePassword, setDeletePassword] = useState('');
	const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
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

	const handleGoalvalue = (text) => {
		const numericText = text.replace(/[^0-9]/g, '');
		setGoal(numericText);
	}

	async function handleGym(){
		setShowGymModal(true);
	}
	async function handleGoal(){
		setGoal('');
		setShowGoalModal(true);
	}
	async function handleBio(){
		setBio('');
		setShowBioModal(true);
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

	const [isAdmin,setisAdmin] = useState(false)

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
			{isAdmin && <SettingButton onPress={() => handleDelete} Icon = {Eye} isPrivacy = 'true'>Set Goal</SettingButton>}

		</View>

		{/* DELETE ACCOUNT CONFIRMATION MODAL */}
		{/* <Modal
			animationType='fade'
			transparent={true}
			visible={showDeleteModal}
			onRequestClose={() => {
				if (!isDeletingAccount) {
					setShowDeleteModal(false);
				}
			}}
		>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalCard}>
					<Text style={styles.modalTitle}>Delete Account</Text>
					<Text style={styles.modalBody}>
						This action is permanent. Your profile and stats will be deleted.
					</Text>
					<Text style={styles.modalBody}>
						Are you sure you want to continue?
					</Text>

					<TextInput
						style={styles.modalInput}
						placeholder='Enter YOUR account password to confirm'
						secureTextEntry
						autoCapitalize='none'
						autoCorrect={false}
						editable={!isDeletingAccount}
						value={deletePassword}
						onChangeText={(text) => {
							setDeletePassword(text);
							if (deleteErrorMessage) {
								setDeleteErrorMessage('');
							}
						}}
					/>

					{!!deleteErrorMessage && (
						<Text style={styles.modalErrorText}>{deleteErrorMessage}</Text>
					)}

					<View style={styles.modalActions}>
						<Pressable
							style={styles.cancelButton}
							onPress={() => {
								setShowDeleteModal(false);
								setDeletePassword('');
								setDeleteErrorMessage('');
							}}
							disabled={isDeletingAccount}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</Pressable>

						<Pressable
							style={[styles.deleteButton, isDeletingAccount && styles.disabledButton]}
							onPress={async () => {handleConfirmDeleteAccount();}}
							disabled={isDeletingAccount}
						>
							<Text style={styles.deleteButtonText}>{isDeletingAccount ? 'Deleting...' : 'Delete'}</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal> */}


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
			deleteErrorMessage = {deleteErrorMessage}
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
			subtext2='This can be changed at any time.'
			action= 'Set Bio'
			visible={showBioModal}
			onRequestClose={() => {setShowBioModal(false)}}
			onPress_cancel={() => {setShowBioModal(false)}}
			onPress_perform={async () => {	
				setShowBioModal(false);
				console.log("New bio:", bio);
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
			subtext2='This can be changed at any time.'
			action= 'Set Goal'
			visible={showGoalModal}
			onRequestClose={() => {setShowGoalModal(false)}}
			onPress_cancel={() => {setShowGoalModal(false)}}
			value = {goal}
			onPress_perform={async () => {	
				setShowGoalModal(false);
				console.log("New goal:", goal);
			}}
			onChangeText={(text) => handleGoalvalue(text)}
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
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.35)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalCard: {
		width: '100%',
		maxWidth: 420,
		backgroundColor: 'lightgrey',
		borderRadius: 10,
		padding: 18,
		borderWidth: 1,
		borderColor: '#cdd7eb',
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: '800',
		marginBottom: 10,
		textAlign: 'center',
	},
	modalBody: {
		fontSize: 15,
		textAlign: 'center',
		marginBottom: 8,
		color: '#333',
	},
	modalInput: {
		height: 44,
		borderWidth: 1,
		borderColor: '#9da8bf',
		borderRadius: 6,
		paddingHorizontal: 12,
		backgroundColor: '#fff',
		marginTop: 4,
	},
	modalErrorText: {
		marginTop: 8,
		textAlign: 'center',
		color: '#b42318',
		fontSize: 14,
		fontWeight: '700',
	},
	modalActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
		marginTop: 14,
	},
	cancelButton: {
		flex: 1,
		height: 42,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#9da8bf',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f4f6fb',
	},
	deleteButton: {
		flex: 1,
		height: 42,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#d43f3a',
	},
	cancelButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#27364d',
	},
	deleteButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#fff',
	},
	logoutButton: {
		flex: 1,
		height: 42,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#355fa3',
	},
	logoutButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#fff',
	},
	disabledButton: {
		opacity: 0.7,
	},
})