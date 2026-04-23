import { View, Text, TextInput, Button, FlatList, ScrollView, Modal, StyleSheet, Pressable, Dimensions, Image} from 'react-native';
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
import { ArrowLeft } from 'lucide-react-native';

const {width, height} = Dimensions.get('window')

export default function OtherUsersScreen() {

    const { user } = useAuthContext()
    const [finding, setFinding] = useState('')
    const [other_users, setOtherUsers] = useState([])
    const [message, setMessage] = useState('')

	useEffect(() => {
		if (!user) {
			router.replace('/');
		}
	}, [user]);

    useEffect(() => {
        if (finding.trim() === ''){
            setOtherUsers([]);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            performBestMatch(finding)
        }, 100) // delay of 100ms after user stops typing

        return () => clearTimeout(delayDebounceFn)
    }, [finding]);

    useFocusEffect(
        useCallback(() => {
            setFinding('');
            setOtherUsers([]);
            setMessage('');
        }, [user])
    );
	async function performBestMatch(name){
        if (!name.trim()) {
            setOtherUsers([]);
            return;
        }

        try {
			const response = await api.get(`/api/friends/${user.username}/match`, {
				params: {
                    userName: user.username,
                    search: name
				},
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
            setOtherUsers(response.data.users)
        } catch (error) {
            console.error("Error loading other users:", error)
        }
    }

    // Function to handle adding a friend
	async function addFriend(friendUsername) {
		if (!user) {
			setMessage('User not authenticated')
			return
		}

		try {
			const response = await api.post('/api/addfriend', {
				userName: user.username,
				friendUsername: friendUsername
			}, {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			})

			if (response.data.code === "FRIEND_ADDED") {
				setMessage('Friend added successfully!')
                setFinding('')
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

  return (
    <View style={{alignItems: 'center', padding: 20, width: '100%', height: '100%'}}>
        <View style = {{flexDirection: 'center', justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: colors.background, borderRadius: 10,borderWidth: 5, borderColor: colors.primary, marginBottom:10 }}>
            <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10}}>
                <Pressable style = {{position: 'absolute', left: 10}} onPress={() => router.replace('(tabs)/friend_list')}>
                    <ArrowLeft strokeWidth={2.5} marginTop={2}></ArrowLeft>
                </Pressable>
                <TitleComp style={{fontSize: 20, width: width*.8}}>Other Users</TitleComp>
            </View>

            <Input
                placeholder="Search for users..."
                style={{width: '90%', height: height*0.04, backgroundColor: 'white', marginBottom: 10, marginTop: 10}}
                value={finding}
                onChangeText={(text) => setFinding(text)}
            />
            {message !== '' && <Text style={{ fontFamily: fonts.general, marginBottom: 10, textAlign: 'center', color: message.includes('success') ? 'green' : 'red' }}>{message}</Text>}
        </View>



        <View style={{ flex:1,width: '100%', backgroundColor: colors.background, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 5, borderColor: colors.primary }}>

            {finding && (
                <AppText style = {{fontSize: 10, marginBottom: 10}}>Search results for "{finding}":</AppText>
            )}

            <FlatList
                style={{ width: '100%',flex:1}}
                data={other_users}
                keyExtractor={(item) => item.userName} // item is username, bio and profile pic
                renderItem={({ item }) => (
                    <View style={styles.friendCard}>

                        <View style={{ flexDirection: 'row', width: width*.4, height: height*.1, alignItems: 'center', justifyContent: 'center', gap: 30}}> 
                            {item.profilePic ? <Image source={{ uri: item.profilePic }} style={styles.profilePic} /> : <Image source={require('../assets/images/defaultpfp.png')} style={styles.profilePic} />}
                            <ButtonComp style = {{ width: width*.4, height: 35}} onPress={() => addFriend(item.userName)}> 
                                Add Friend
                            </ButtonComp>
                        </View>

                        <AppText style={{ flex: 1, textAlign: 'left', fontSize: 12, marginTop: 10}}> {item.userName} </AppText>
                        {item.bio ? <AppText style={{ flex: 1, textAlign: 'left', fontSize: 10, color: 'gray', marginBottom: 10, marginHorizontal: 10}}> {item.bio} </AppText> : <AppText style={{ flex: 1, textAlign: 'left', fontSize: 10, color: 'gray', marginBottom: 10, marginHorizontal: 10}}> No bio available. </AppText>}
                        <AppText style={{ flex: 1, textAlign: 'left', fontSize: 10, color: 'gray', marginBottom: 10, marginHorizontal: 10}}> Points: {item.points} </AppText>
                        <AppText style={{ flex: 1, textAlign: 'left', fontSize: 10, color: 'gray', marginBottom: 10, marginHorizontal: 10}}> Best Streak: {item.bestStreak} </AppText>
                    </View>
                )}
                ListEmptyComponent={() => (finding.trim() !== '' && <Text style={{ textAlign: 'center', color: 'gray', fontFamily: fonts.general}}>Theres no one with that Username. Try Again.</Text>)}
            />

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  friendCard: {
        marginBottom: 5,
        marginTop: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        borderWidth: 5,
        backgroundColor: 'lightgrey',
        borderColor: '#bad0eb',
        borderRadius: 15,
        width: width*.8,
        height: height*.3,
        alignItems: 'center'
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40
    }
});