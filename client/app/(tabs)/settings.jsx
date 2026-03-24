import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';
import { useEffect, useState } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';


export default function SettingScreen() {


	async function handleDelete(){
		console.log("nothing yet");
	}

	return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable onPress = {() => handleDelete()}style={styles.settingsButton}>
		<Text style = {styles.settingText}>Delete Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {

	},
	settingsButton: {
		width: 120,
		height: 50,
		backgroundColor: '#1E90FF',
		borderRadius: 5,
		justifyContent: 'center', 
		alignItems: 'center'
	},
	settingText: {

	}
})