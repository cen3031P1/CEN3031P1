import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';

export default function FriendsScreen() {

  const {user} = useAuthContext()
  const [friendUsername, setFriendUsername] = useState('')
  const [message, setMessage] = useState('')
  const [friends, setFriends] = useState([])

  // Load friends when the page is loaded
  useEffect(() => { 
    if (user) {
      loadFriends()
    }
  }, [user])


  async function loadFriends() {
    console.log("loading friends for:", user.username)
    try {
      const response = await api.get(`/api/friends/${user.username}`) // GET request to fetch friends!!
      console.log("friends response:", response.data)
      setFriends(response.data.friends)
    } catch (error) {
      console.error("Error loading friends:", error)
    }
  }

  async function handleAddFriend() {
    if (!user) {
      setMessage('User not authenticated')
      return
    }

    try {
      const response = await api.post('/api/addfriend', {
        userName: user.username,
        friendUsername
      })
      if (response.data.success) {
        setMessage('Friend added successfully!')
        setFriendUsername('')
      } else {
        setMessage('Failed to add friend: ' + response.data.message)
      }
    } catch (error) {
      if (!error.response) {
        setMessage('Network error: ' + error.message)
        return
      }
      switch(error.response.data.code){
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>friends list</Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item} // Assuming friends is an array of usernames (strings).
                                      // Maybe change this to item._id if we decide to switch to storing friend IDs instead of usernames.
        renderItem={({ item }) => <Text>{item}</Text>}
        ListEmptyComponent={() => <Text>No friends found. Add some friends to see them here!</Text>}
      />


      <TextInput
        placeholder="Enter friend's username"
        value={friendUsername}
        onChangeText={setFriendUsername}
        style={{ height: 40, borderColor: 'gray', padding: 8, width: '80%', marginBottom: 10 }}
      />
      <Button title="Add Friend" onPress={handleAddFriend} />
      {message !== '' && <Text>{message}</Text>}
    </View>
  );
}