import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ImageBackground} from 'react-native';
import TitleComp from '../components/Titles.jsx';
import ProfileDisplay from '../components/ProfileDisplay.jsx';
import colors from '../theme/colors.jsx';
import AppText from '../components/AppText.jsx';
// will display profile picture
// log button
// goal
// streak
// badges? 

export default function HomeScreen() {
  return (
	<View style={styles.container}>
	<TitleComp style = {{fontSize: 40}}>MY PROFILE</TitleComp> 
	<Image
	source={require('../assets/images/defaultpfp.png')}
	style = {styles.Profile}
	/>
	<AppText style ={{fontSize: 12}}>USERNAME</AppText>
	<AppText style ={{fontSize: 10, textAlign: 'center', color: 'grey'}}>BIO - we just put smt i guess</AppText>


		<View style = {styles.featureBoxContainer}>

			<ProfileDisplay type='goal' base_numval={23} optimal_numval={32}>GOAL</ProfileDisplay>
			<ProfileDisplay type='streak' base_numval={23} optimal_numval={32}>STREAK</ProfileDisplay>
			<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: '45%'}} >LOG</ProfileDisplay>
			<ProfileDisplay type='log' style = {{width: '100%', aspectRatio: 0, height: '45%'}} >BADGES</ProfileDisplay>
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