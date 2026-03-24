import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';
import { useEffect, useState } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';


export default function SettingScreen() {


	async function handleDelete(){
		console.log("nothing yet");
	}

	return (
    <View style={styles.container}>
		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Set Profile Picture</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Delete Account</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Set Gym</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Set Goal</Text>
		</Pressable>

		<Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
			<Text style = {styles.settingText}>Toggle Privacy Mode</Text>
		</Pressable>

	  
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center',
		gap: 15,
	},
	settingsButton: {
		width: 360,
		height: 50,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		alignItems: 'left',
		
	},
	settingText: {
		padding: 15,
	}
})