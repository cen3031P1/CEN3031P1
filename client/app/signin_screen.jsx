import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ScrollView} from 'react-native';
import { useSignin } from './hook/useSignIn';
import AppText from './components/AppText.jsx';
import TitleComp from './components/Titles.jsx';
import Input from './components/Input.jsx';
import colors from './theme/colors.jsx';
import {LinearGradient} from 'expo-linear-gradient';
import ButtonComp from './components/ButtonComp.jsx';
import { useAuthContext} from './hook/useAuthContext.jsx';
//import * as Location from 'expo-location'

export default function SigninScreen() {
    const { user } = useAuthContext();
    const {signup, totalFailure, signUpFail, signUpPass} = useSignin();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [invalid_Cred, setInvalid_Cred] = useState('');
     const [isSigningUp, setIsSigningUp] = useState(false)
    
    useEffect(() => {
        if (user $$ !isSigningUp) {
            router.replace('/(tabs)/home');
        }
    }, [user]);

    async function getLocation(){
        const {status} = await Location.requestForegroundPermissionsAsync()

        if(status != 'granted'){
            Alert.alert('Permission denied', 'Location access is required')
            return
        }

    const location = await Location.getCurrentPositionAsync({})
    
    //server request
    async function signinVerification(){
        try {
            const response = await fetch('ip+port/signin',{
                method: 'POST',
                headers: {
                    'info-type' :'signinInfo',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON. stringify({username,password}),
            }
            );
            const data = await response.json();
            return data.result;
        }
        catch (error){
            console.log(error);
            return false;
        }
    }


    async function handleSignup(username,password,cpassword){

        if(password !== cpassword){
            setInvalid_Cred('Passwords do not match');
            return;
        }

        const success = await signup(username, password);
        if (success){router.replace('/map')}
        else {setIsSigningUp(false)}
    }
    useEffect(() => {
        /*
            useEffect probably not best for this?
            id recommend a conditional component using totalFailure on if it displays or not
            remains till user tries again maybe thatll reset totalFailure
        */
        console.log("display failure message, ask user to try again. Somethings wrong with server")
    }, [totalFailure])

    useEffect(() => {
        /*
        reasons this will run, 
        username or password missing 1
        username already in system 2
        bad username 3
        bad password 4
        some weird other thing that we dont know 0
        */
        if(signUpFail == 1){
            setInvalid_Cred("Missing username or password")
        } else if(signUpFail == 2){
            setInvalid_Cred("Sorry this username is already taken")
        } else if(signUpFail == 3){
            setInvalid_Cred("Bad Username. Usernames cannot have any special characters or spaces.")
        } else if(signUpFail == 4){
            setInvalid_Cred("Bad Password. Passwords must be at least 8 characters long and include at least one uppercase, number and symbol")
        }else if(signUpFail == 0){
            setInvalid_Cred("Sorry something unexpected occurred. Please try again")
        }else if (signUpFail == -1){
            setInvalid_Cred("")
        }
        
    }, [signUpFail])

    function handleBack(){
        router.replace('/');
    }
    
    return (    
        
            <LinearGradient
            colors = {[colors.bgPrimary,colors.bgSecondary]}
            style= {{flex:1}}
            >
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.overlay}>

                <View style = {{marginBottom: 10, height: '25%', alignItems: 'center'}}>
                    <Image source={require('./assets/images/gfit_logo.png')}
                    style = {{
                        height: '100%',
                        resizeMode: 'contain'
                        }}/>
                    
                    <View>
                        <TitleComp>GATOR FIT</TitleComp>
                    </View>
                </View>

                    <View style ={styles.textbox}>

                        <View>
                            {invalid_Cred !== '' && <AppText style={styles.failtext}>{invalid_Cred}</AppText>}
                        </View>

                        <View style = {{marginBottom: 10, marginTop: 5}}>
                            <AppText>Sign-Up</AppText>
                        </View>

                        <Input 
                            onChangeText={setUsername}
                            value = {username}
                            placeholder='Username'
                        ></Input>

                        <Input
                            onChangeText={setPassword}
                            value = {password}
                            placeholder='Password'
                            isPassword = 'true'
                        ></Input>

                        <Input
                            onChangeText={setCpassword}
                            value = {cpassword}
                            placeholder='Password'
                            isPassword = 'true'
                        ></Input>

                        <View style={styles.buttonrow}>
                            <ButtonComp style = {{width: '65%'}}onPress={handleBack}>Back</ButtonComp>
                            <ButtonComp style = {{width: '65%', backgroundColor: colors.bgPrimary}}onPress={() => handleSignup(username,password,cpassword)}>Sign-Up</ButtonComp>
                        </View>

                    </View>

                </View>
            </ScrollView>
            </LinearGradient>

    );
}


const styles = StyleSheet.create({
    overlay: {
        flex : 1,
        backgroundColor: 'rgba(255,255,255,.4)',
        alignItems: 'center',
    },
    failtext: {
        color: 'red',
        fontSize: '70%',
        width: '100%',
        textAlign: 'center'
    },
    textbox: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        marginTop: 100,
        borderRadius: 10,
        width: '85%',
        maxWidth: 700,
        maxHeight: 350,
        height: '55%',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: colors.primary,
    },
    buttonrow: {
        flexDirection: 'row',
        gap: 20,
        width: '65%',
        justifyContent: 'center',
    },
})
