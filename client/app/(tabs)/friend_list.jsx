import { View, Text, TextInput, Button, FlatList, ScrollView, Modal} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';
import TitleComp from '../components/Titles.jsx';
import Input from '../components/Input.jsx';
import ButtonComp from '../components/ButtonComp.jsx';
import fonts from '../theme/fonts.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import { router, useFocusEffect } from 'expo-router';
import SettingModal from '../components/setting_modal.jsx';
export default function FriendsScreen() {

	const { user } = useAuthContext()
	const [friendUsername, setFriendUsername] = useState('')
	const [message, setMessage] = useState('')
	const [friends, setFriends] = useState([])

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

	useFocusEffect(
		useCallback(() => {
			if (user) {
				loadFriends()
			}
		}, [user])
	);

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
			<View style={{alignItems: 'center', padding: 20, width: '100%', height: '100%'}}>

				<View style={{ width: '100%', backgroundColor: colors.background, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center',borderWidth: 5, borderColor: colors.primary, marginBottom:10 }}>

					<TitleComp style={{ fontSize: 40, marginVertical: 15}}>Friends</TitleComp>

					<ButtonComp style = {{ width: '100%', marginBottom: 10}} onPress={()=> router.replace('(tabs)/other_users')}>
						Add Friends
					</ButtonComp>

					{/* {message !== '' && <Text style={{ fontFamily: fonts.general, marginBottom: 10, textAlign: 'center', color: message.includes('success') ? 'green' : 'red' }}>{message}</Text>} */}

				</View>

                    <View style={{ flex:1,width: '100%', backgroundColor: colors.background, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 5, borderColor: colors.primary }}>
                        <FlatList
                            style={{ width: '100%',flex:1}}
                            data={friends}
                            keyExtractor={(item) => item} // Assuming friends is an array of usernames (strings).
                            // Maybe change this to item._id if we decide to switch to storing friend IDs instead of usernames.
                            renderItem={({ item }) => (
                                <View style={{marginBottom: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'center', borderWidth: 5,backgroundColor: 'lightgrey', borderColor: '#bad0eb', borderRadius: 15, width: '100%', height: 60, alignItems: 'center' }}>

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
	);
}