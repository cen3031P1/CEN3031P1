import { View, Text, TextInput, Button} from 'react-native';
import { useState } from 'react';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';

export default function FriendsScreen() {

  const {user} = useAuthContext()
  const [friendUsername, setFriendUsername] = useState('')
  const [message, setMessage] = useState('')

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