import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ImageBackground} from 'react-native';
import {useLogin} from './hook/useLogin.jsx';
import AppText from './components/AppText.jsx';
import TitleComp from './components/Titles.jsx';
import Input from './components/Input.jsx';
import colors from './theme/colors.jsx';
import {LinearGradient} from 'expo-linear-gradient';
import ButtonComp from './components/ButtonComp.jsx';
import useAuthContext from './hook/useAuthContext.jsx';

export default function LoginScreen() {
    const {doLogin, totalFailure, loginFail, loginPass} = useLogin()
    
    const { user } = useAuthContext();

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    async function handleLogin(username, password){
        const success = await doLogin(username, password)
        if (success){router.replace('/(tabs)')};
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
        <View style = {{flex : 1}}>
        
            <LinearGradient
            colors = {[colors.bgPrimary,colors.bgSecondary]}
            style= {{flex:1}}
            >
            
                <View style={styles.overlay}>

                    <Image source={require('./assets/images/gfit_logo.png')}
                    style = {{
                        height: 300, 
                        width: '90%', 
                        marginTop: 20, 
                        maxWidth: 500,
                        resizeMode: 'contain'
                        }}/>
                    
                        <View style = {{marginBottom: 100, width: '90%'}}>
                            <TitleComp>GATOR FIT</TitleComp>
                        </View>
                    <View style ={styles.textbox}>
                        
                        <View>
                            {invalid_Cred !== '' && <AppText style={styles.failtext}>{invalid_Cred}</AppText>}
                        </View>
                        
                        <View style = {{marginBottom: 10, marginTop: 10}}>
                            <AppText>Log-In</AppText>
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

                        <View style={styles.buttonrow}>
                            <ButtonComp onPress={() => handleLogin(username,password)}>Login</ButtonComp>
                            <ButtonComp onPress={handleSignin}>Sign-in</ButtonComp>
                        </View>

                    </View>

                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex : 1,
        backgroundColor: 'rgba(255,255,255,.4)',
        alignItems: 'center',
        gap: 12,
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
        paddingVertical: 12,
        borderRadius: 10,
        width: '85%',
        height: '40%',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: colors.primary,
    },
    buttonrow: {
        flexDirection: 'row',
        gap: 25,
        justifyContent: 'center',
        fontSize: '80%',
    },
})