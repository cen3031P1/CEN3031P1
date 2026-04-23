import { View, Text, FlatList, Button, ScrollView, Dimensions } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api.js';
import { useAuthContext } from '../hook/useAuthContext.jsx';
import TitleComp from '../components/Titles.jsx';
import AppText from '../components/AppText.jsx';
import ButtonComp from '../components/ButtonComp.jsx';
import colors from '../theme/colors.jsx';
import { router } from 'expo-router';

const {width, height} = Dimensions.get('window')

export default function LeaderboardScreen() {
	const { user } = useAuthContext()
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

	useEffect(() => {
		if (!user) {
			router.replace('/');
		}
	}, [user]);

	async function loadGlobalLeaderboard() {
		try {
			const response = await api.get('/api/leaderboard/', {
				params: {
					sortBy
				},
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			})
			setLeaderboard(response.data.leaderboard)
		} catch (error) {
			console.error("Error loading global leaderboard:", error)
		}
	}
	return (
			<View style={{ alignItems: 'center', width: '100%', padding: 20,flex:1}}>
				<View style={{ width: '100%', backgroundColor: colors.background, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center',borderWidth: 5, borderColor: colors.primary, gap: 15, marginBottom:10 }}>

					<TitleComp style={{ fontSize: 28, marginVertical: 15}}>Global Leaderboard</TitleComp>
					<View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', width: '100%', marginBottom: 10}}>
						<ButtonComp style={{ width: 150 }} onPress={() => setSortBy('points')}>Points</ButtonComp>
						<ButtonComp style={{ width: 150 }} onPress={() => setSortBy('bestStreak')}>Best Streak</ButtonComp>
					</View>

				</View>


				<View style={{ width: '100%', height: height * 0.42, backgroundColor: colors.background, paddingTop: 15, borderRadius: 10, alignItems: 'center',borderWidth: 5, borderColor: colors.primary, marginBottom: 15}}>
					<View style={{ flexDirection: 'row', width: '100%', borderBottomWidth: 5, borderBottomColor: colors.primary, paddingBottom: 10}}>
						<AppText style={{ width: '25%',  textAlign: 'center', fontSize: 11 }}>Rank</AppText>
						<AppText style={{ width: '50%', textAlign: 'center', fontSize: 11 }}>Username</AppText>
						<AppText style={{ width: '25%', textAlign: 'center', fontSize: 11 }}>{sortBy === 'points' ? 'Points' : 'Best Streak'}</AppText>
					</View>


					<FlatList
						data={leaderboard}
						keyExtractor={(item) => item._id}
						style={{ width: '100%', flex: 1}}
						contentContainerStyle={{paddingBottom: 12}}
						renderItem={({ item, index }) => (
							<View style={{ flexDirection: 'row', paddingVertical: 10 }}>
								<AppText style={{ width: '25%', textAlign: 'center', fontSize: 10 }} >#{index + 1}</AppText>
								<AppText style={{ width: '50%', textAlign: 'center', fontSize: 10 }} >{item.userName}</AppText>
								<AppText style={{ width: '25%', textAlign: 'center', fontSize: 10 }} >{sortBy === 'points' ? item.points : item.bestStreak}</AppText>
							</View>
						)}
					/>
				</View>

			</View>
	);
}