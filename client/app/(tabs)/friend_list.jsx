import { View, Text, TextInput, Button, FlatList, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';

export default function FriendsScreen() {

  const {user} = useAuthContext()
  const [friendUsername, setFriendUsername] = useState('')
  const [message, setMessage] = useState('')
  const [friends, setFriends] = useState([])
  const windowWidth = useWindowDimensions().width
  const tableWidth = windowWidth * 0.5;

  // Load friends when the page is loaded
  useEffect(() => { 
    if (user) {
      loadFriends()
    }
  }, [user])


  // Function to load friends from the server
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

  // Function to handle adding a friend
  async function addFriend() {
    if (!user) {
      setMessage('User not authenticated')
      return
    }

    try {
      const response = await api.post('/api/addfriend', {
        userName: user.username,
        friendUsername
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

  // Function to handle removing a friend
  async function removeFriend(friendUsername) {
    try {
      const response = await api.delete('/api/removefriend', {
        params: {
          userName: user.username,
          friendUsername
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Your Friends</Text>

      <View style={{ width: tableWidth}}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item} // Assuming friends is an array of usernames (strings).
                                      // Maybe change this to item._id if we decide to switch to storing friend IDs instead of usernames.
        renderItem={({ item }) => (
          <View style={{ alignItems: 'center',  marginBottom: 30, justifyContent: 'center' }}>
            <Text style={{ flex: 1, textAlign: 'center', marginTop: 10}}>{item}</Text>
              <View style={{ position: 'absolute', right: 60}}>
                <Button title="Remove" onPress={() => removeFriend(item)} />
              </View>
          </View>
        )}
        ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: 'gray' }}>No friends found. Add some friends to see them here!</Text>}
      />
      </View>


      <View style={{ width: tableWidth, marginTop: 20, backgroundColor: '#f0f4ff', padding: 15, borderRadius: 10 }}>
        <TextInput
          placeholder="Enter friend's username"
          value={friendUsername}
          onChangeText={setFriendUsername}
          style={{ height: 40, borderColor: 'gray', padding: 8, marginBottom: 10, textAlign: 'center', backgroundColor: 'white', borderRadius: 5 }}
      />
      <Button title="Add Friend" onPress={addFriend} />
      {message !== '' && <Text style={{ marginTop: 10, textAlign: 'center', color: message.includes('success') ? 'green' : 'red' }}>{message}</Text>}
      </View>
    </View>
  );
}