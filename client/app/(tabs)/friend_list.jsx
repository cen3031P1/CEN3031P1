import { View, Text, TextInput, Button, FlatList, useWindowDimensions, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';
import TitleComp from '../components/Titles.jsx';
import Input from '../components/Input.jsx';
import ButtonComp from '../components/ButtonComp.jsx';
import fonts from '../theme/fonts.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import { router } from 'expo-router';

export default function FriendsScreen() {

	const { user } = useAuthContext()
	const [friendUsername, setFriendUsername] = useState('')
	const [message, setMessage] = useState('')
	const [friends, setFriends] = useState([])
	const windowWidth = useWindowDimensions().width

	// Load friends when the page is loaded
	useEffect(() => {
		if (user) {
			loadFriends()
		}
	}, [user])

	useEffect(() => {
		if (!user) {
			router.replace('/');
		}
	}, [user]);
	
	// Function to load friends from the server
	async function loadFriends() {
		console.log("loading friends for:", user.username)
		try {
			const response = await api.get(`/api/friends/${user.username}`,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				}
			) // GET request to fetch friends!!
			setFriends(response.data.friends)
		} catch (error) {
			console.error("Error loading friends:", error)
		}
	}

	// Function to handle adding a friend
	async function addFriend() {
		if (!user) {
			setMessage('User not authenticated')
			return
		}

		try {
			const response = await api.post('/api/addfriend', {
				userName: user.username,
				friendUsername,
			}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			})

			if (response.data.code === "FRIEND_ADDED") {
				setMessage('Friend added successfully!')
				setFriendUsername('')
				loadFriends() // Refresh the friends list after adding a friend
			} else {
				setMessage('Failed to add friend: ' + response.data.message)
			}
		} catch (error) {
			if (!error.response) {
				setMessage('Network error: ' + error.message)
				return
			}
			switch (error.response.data.code) {
				case "MISSING_FIELDS":
					setMessage('Please enter a username')
					break
				case "CANNOT_ADD_SELF":
					setMessage('You cannot add yourself as a friend')
					break
				case "FRIEND_NOT_FOUND":
					setMessage('User not found')
					break
				case "USER_NOT_FOUND":
					setMessage('Your account was not found')
					break
				case "FRIEND_ALREADY_ADDED":
					setMessage('You are already friends with this user')
					break
				default:
					setMessage('Something went wrong')
					break
			}
		}
	}

	// Function to handle removing a friend
	async function removeFriend(friendUsername) {
		try {
			const response = await api.delete('/api/removefriend', {
				params: {
					userName: user.username,
					friendUsername
				},
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			})

			setMessage('Friend removed successfully!')
			loadFriends() // Refresh the friends list after removing a friend

		} catch (error) {
			if (!error.response) {
				setMessage('Network error: ' + error.message)
				return
			}
			setMessage('Failed to remove friend: ' + error.response.data.message)
		}
	}


	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>

			<View style={{alignItems: 'center', padding: 20, width: '100%'}}>
				

				<View style={{ width: '100%', backgroundColor: colors.background, padding: 15, borderRadius: 10, alignItems: 'center',borderWidth: 5, borderColor: colors.primary, gap: 15, marginBottom:5 }}>

					<TitleComp style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 10}}>Friends</TitleComp>
					
					<Input
						placeholder="Enter friend's username"
						value={friendUsername}
						onChangeText={setFriendUsername}
						style = {{ width: '100%' ,height: 30}}
					/>

					<ButtonComp style = {{ width: '100%'}} onPress={addFriend}>
						Add Friend
					</ButtonComp>
					
					{message !== '' && <Text style={{ fontFamily: fonts.general, textAlign: 'center', color: message.includes('success') ? 'green' : 'red' }}>{message}</Text>}

				</View>

				<View style={{ width: '100%', backgroundColor: colors.background, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 5, borderColor: colors.primary }}>
					<FlatList
						style={{ width: '100%'}}
						scrollEnabled={false}
						data={friends}
						keyExtractor={(item) => item} // Assuming friends is an array of usernames (strings).
						// Maybe change this to item._id if we decide to switch to storing friend IDs instead of usernames.
						renderItem={({ item }) => (
							<View style={{marginBottom: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'center', borderWidth: 5,backgroundColor: 'lightgrey', borderColor: '#bad0eb', borderRadius: 15, width: '100%', height: 60, alignItems: 'center' }}>

								{/* <Text style={{ flex: 1, textAlign: 'left'}}>{item}</Text> */}
								<AppText style={{ flex: 1, textAlign: 'left', fontSize: 12}}> {item} </AppText>

								<ButtonComp style = {{ width: '30%', height: 35, marginRight: 10}} onPress={() => removeFriend(item)}>
									Remove
								</ButtonComp>

							</View>
						)}
						ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: 'gray', fontFamily: fonts.general}}>No friends found. Add some friends to see them here!</Text>}
					/>
				</View>


			</View>

		</ScrollView>
	);
}