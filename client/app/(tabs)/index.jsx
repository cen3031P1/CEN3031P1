import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ImageBackground} from 'react-native';
import TitleComp from '../components/Titles.jsx';
import ProfileDisplay from '../components/ProfileDisplay.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
import useAuthContext from '../hook/useAuthContext.jsx';

// will display profile picture
// log button
// goal
// streak
// badges 

async function handleLog(){
	console.log("nothing yet");
}

export default function HomeScreen() {

	const { user } = useAuthContext();
	console.log('user:', user);

	// useEffect(() => {
	// 		if (!user) {
	// 			router.replace('/');
	// 		}
	// 	}, [user]);

  return (
	<View style={styles.container}>
	<TitleComp style = {{fontSize: 40}}>MY PROFILE</TitleComp> 
	<Image
      source={
	  	user?.profilePic
		? { uri: user.profilePic }
		: require('../assets/images/defaultpfp.png')
	}

	style = {styles.Profile}
	/>
	<AppText style ={{fontSize: 14}}>{user?.username}</AppText>
	<AppText style ={{fontSize: 10, textAlign: 'center', color: 'grey'}}>BIO - asdasdasdasdasd</AppText>


		<View style = {styles.featureBoxContainer}>

			<ProfileDisplay type='goal' base_numval={23} optimal_numval={32}>GOAL</ProfileDisplay>
			<ProfileDisplay type='streak' base_numval={23} optimal_numval={32}>STREAK</ProfileDisplay>
			<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: '40%'}} onPress={handleLog} >LOG</ProfileDisplay>
			<ProfileDisplay type='badges' style = {{width: '100%', aspectRatio: 0, height: '40%'}} >BADGES</ProfileDisplay>
		</View>

	</View>
  );
}

const styles = StyleSheet.create({
	container: {	
		alignItems: 'center',
		padding: 12,
		gap: 25,
	},
	Profile: {
		height: 120, 
		width: 120,
		borderRadius: 60,
		resizeMode: 'fill',
	},
	featureBoxContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
		// backgroundColor: colors.background
	},
});