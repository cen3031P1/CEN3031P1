import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';
import {useLogin} from './hook/useLogin.jsx'

export default function LoginScreen() {
    const {doLogin, totalFailure, loginFail, loginPass} = useLogin()

    async function handleLogin(username, password){

        await doLogin(username, password)
    }

    useEffect(() => {
        console.log('something broke bad')
    }, [totalFailure])

    useEffect(() => {
        console.log("login success")
    }, [loginPass])
    
    useEffect(() => {
        if(loginFail == 1){
            setInvalid_Cred("Missing username or password")
        } else if(loginFail == 2){
            setInvalid_Cred("Incorrect username or password")
        } else if(loginFail == 3){
            setInvalid_Cred("Incorrect username or password")
        } else if(loginFail == 0){
            setInvalid_Cred("Sorry something unexpected occurred. Please try again")
        } else if(loginFail == -1){
            setInvalid_Cred("")
        }
    }, [loginFail])

    function handleSignin(){
        router.replace('/signin_screen');
    }  

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalid_Cred, setInvalid_Cred] = useState('');
    
    return (
        <View style={styles.container}>
            <Image source={require('./assets/images/gfit_logo.png')}
            style = {{height: 300, width: 300}}/>

            <View style={styles.titleformat}>
                <Text style={styles.gator}>
                    Gator
                </Text>
                <Text style={styles.fit}>
                    Fit
                </Text>
            </View>
            

            <Text>Log-in or Sign-in</Text>
            {invalid_Cred !== '' && <Text style ={styles.failtext}>{invalid_Cred}</Text>}

            <TextInput
            onChangeText={setUsername}
            value = {username}
            placeholder='Username'
            style = {styles.inputbox}
            />
            <TextInput
            onChangeText={setPassword}
            value = {password}
            placeholder='Password'
            secureTextEntry= {true}
            style = {styles.inputbox}
            />

            <View style={styles.buttonrow}>
                <Pressable onPress={() => handleLogin(username,password)} style ={styles.button}>
                    <Text style={styles.buttontext}>login</Text>
                </Pressable>
                <Pressable onPress={handleSignin} style ={styles.button}>
                    <Text style={styles.buttontext}>sign-in</Text>
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
        gap: 12,
    },
    failtext: {
        color: 'red'
    },
    inputbox: {
        borderWidth: 1,
        borderColor: '#444',
    },
    buttonrow: {
        flexDirection: 'row',
        gap: 15,
    },
    button: {
        width: 90,
        height: 30,
        backgroundColor: '#1E90FF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttontext: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    gator: {
        color: '#FFA500',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    fit: {
        color: '#1E90FF',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    titleformat: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignContent: 'top',
    }
})