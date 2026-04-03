import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';
import useAuthContext from '../hook/useAuthContext.jsx';

// will display profile picture
// goal
// streak
// maybe calendar / map location

export default function HomeScreen() {
	
	const { user } = useAuthContext();
	console.log('user:', user);

  	return (

    <View style={styles.container}>
	<Text style={styles.title}>Hello {user?.username}!</Text>
      <Image
      source={
	  	user?.profilePic
		? { uri: user.profilePic }
		: require('../assets/images/defaultpfp.png')
		}

		style={styles.Profile}
      />
	<View style = {styles.featureBoxContainer}>
		<Pressable onPress={()=>console.log("will do smt")} style ={styles.featureBox}>
			<Text style={styles.boxText}>Goal</Text>
		</Pressable>
		<Pressable onPress={()=>console.log("will do smt")} style ={styles.featureBox}>
			<Text style={styles.boxText}>Streak</Text>
		</Pressable>
		<Pressable onPress={()=>console.log("will do smt")} style ={styles.featureBox}>
			<Text style={styles.boxText}>Log</Text>
		</Pressable>
		<Pressable onPress={()=>console.log("will do smt")} style ={styles.featureBox}>
			<Text style={styles.boxText}>Calendar/map</Text>
		</Pressable>
	</View>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {	
		flex: 1, 
		alignItems: 'center',
		padding: 12,
		gap: 40,
	},
	title: {
		fontSize: 60,
		fontWeight: 'bold',
		color: '#fffff',
	},
	Profile: {
		height: 270, 
		width: 270,
		borderRadius: 135,
		resizeMode: 'fill',
	},
	featureBoxContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	featureBox: {
		backgroundColor: 'lightblue',
		height: 150,
		width: '48%',
		backgroundColor: 'lightblue',
		alignItems: 'center',
		paddingTop: 20,
		justifyContent: 'space-between',
		marginBottom: 12,
		borderRadius: 5,
	},
	boxText: {

	}
});