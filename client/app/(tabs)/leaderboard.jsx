import { View, Text, FlatList, Button, useWindowDimensions } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';

export default function LeaderboardScreen() {
  const {user} = useAuthContext()
  const [leaderboard, setLeaderboard] = useState([])
  const [sortBy, setSortBy] = useState('points')
  const windowWidth = useWindowDimensions().width

  const tableWidth = windowWidth * 0.5;

  // Load leaderboard when screen is focused and when user or sortBy changes
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadGlobalLeaderboard()
      }
    }, [user, sortBy])
  )

  async function loadGlobalLeaderboard() {
    try {
      const response = await api.get('/api/leaderboard/', {
        params: {
          sortBy
        }
      })
      setLeaderboard(response.data.leaderboard)
    } catch (error) {
      console.error("Error loading global leaderboard:", error)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Text style ={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>Global Leaderboard</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        <Button title="Points" onPress={() => setSortBy('points')} />
        <Button title="Best Streak" onPress={() => setSortBy('bestStreak')} />
      </View>

    <View style={{ width: tableWidth}}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 5 }}>
        <Text style={{ width: 100, fontWeight: 'bold', textAlign: 'center' }}>Rank</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Username</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>{sortBy === 'points' ? 'Points' : 'Best Streak'}</Text>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 5 }}>
            <Text style={{ width: 100, textAlign: 'center' }}>#{index + 1}</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>{item.userName}</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>{item[sortBy]}</Text>
          </View>
        )}
      />
    </View>
    </View>
  );
}