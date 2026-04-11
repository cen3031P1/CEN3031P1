import { View, Text, FlatList, Button, useWindowDimensions,ScrollView} from 'react-native';
import { useEffect, useState, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';
import TitleComp from '../components/Titles.jsx';
import AppText from '../components/AppText.jsx';
import ButtonComp from '../components/ButtonComp.jsx';

export default function LeaderboardScreen() {
  const {user} = useAuthContext()
  const [leaderboard, setLeaderboard] = useState([])
  const [sortBy, setSortBy] = useState('points')
  
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{ flex: 1, alignItems: 'center', width: '100%', padding: 20 }}>

        <TitleComp style = {{marginBottom: 20}}>Global Leaderboard</TitleComp>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 , justifyContent: 'center'}}>
          <ButtonComp onPress={() => setSortBy('points')}>Points</ButtonComp>
          <ButtonComp onPress={() => setSortBy('bestStreak')}>Best Streak</ButtonComp>
        </View>

      <View style={{ width: '100%'}}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingBottom: 15}}>
          <AppText style={{ width: '25%', fontWeight: 'bold', textAlign: 'center' ,fontSize: 14}}>Rank</AppText>
          <AppText style={{ width: '50%', fontWeight: 'bold', textAlign: 'center', fontSize: 14}}>Username</AppText>
          <AppText style={{ width: '25%', fontWeight: 'bold', textAlign: 'center', fontSize: 14}}>{sortBy === 'points' ? 'Points' : 'Best Streak'}</AppText>
        </View>

        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item._id}
          style = {{width: '100%'}}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', paddingHorizontal: 10}}>
              <AppText style={{ width: '25%', textAlign: 'center', fontSize : 15, paddingTop : 10}} >#{index + 1}</AppText>
              <AppText style={{ width: '50%', textAlign: 'center', fontSize : 15 , paddingTop : 10}} >{item.userName}</AppText>
              <AppText style={{ width: '25%', textAlign: 'center', fontSize : 15 , paddingTop : 10}} >{sortBy === 'points' ? item.points : item.bestStreak}</AppText>
            </View>
          )}
        />
      </View>

    </View>
    </ScrollView>
  );
}