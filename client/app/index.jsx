import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image, ScrollView} from 'react-native';
import {useLogin} from './hook/useLogin.jsx';
import AppText from './components/AppText.jsx';
import TitleComp from './components/Titles.jsx';
import Input from './components/Input.jsx';
import colors from './theme/colors.jsx';
import {LinearGradient} from 'expo-linear-gradient';
import ButtonComp from './components/ButtonComp.jsx';
import {useAuthContext} from './hook/useAuthContext.jsx';
import {Dimensions} from 'react-native';


//universal sizing use Dimensions
//key: height: height * x -> xvh where x is a number between 0-1
//key: width: width * x -> xvw where x is a number between 0-1

const {width, height} = Dimensions.get('window')


export default function LoginScreen() {
    const {doLogin, totalFailure, loginFail, loginPass} = useLogin()
    const { user } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalid_Cred, setInvalid_Cred] = useState('');


    useEffect(() => {
        if (user) {
            router.replace('/(tabs)/home');
        }
    }, [user]);

    async function handleLogin(username, password){
        const success = await doLogin(username, password)
        if (success){router.replace('/(tabs)/home')};
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

    return (    
        
        <LinearGradient
        colors = {[colors.bgPrimary,colors.bgSecondary]}
        style= {{flex:1}}
        >
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.overlay}>

                <View style = {{marginBottom: 10, height: height*0.25, alignItems: 'center'}}>
                    <Image source={require('./assets/images/gfit_logo.png')}
                    style = {{
                        height: height * 0.25,
                        resizeMode: 'contain'
                        }}/>
                    
                    <View>
                        <TitleComp style = {{fontSize: 30, width: width * 1}}>GATOR FIT</TitleComp>
                    </View>
                </View>
                
                <View style ={styles.textbox}>
                    
                    <View>
                        {invalid_Cred !== '' && <AppText style={styles.failtext}>{invalid_Cred}</AppText>}
                    </View>
                    
                    <View style = {{marginBottom: 10, marginTop: 10}}>
                        <AppText style = {{fontSize: 15, width: width*.4}}>Log-In</AppText>
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
                        <ButtonComp style = {{width: '65%'}}onPress={() => handleLogin(username,password)}>Login</ButtonComp>
                        <ButtonComp style = {{width: '65%', backgroundColor: colors.bgPrimary}}onPress={handleSignin}>Sign-Up</ButtonComp>
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
        fontSize: 10,
        width: width*0.95,
        textAlign: 'center'
    },
    textbox: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        marginTop: 100,
        borderRadius: 10,
        width: width * 0.95,
        height: height * 0.55,
        maxHeight: 350,
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: colors.primary,
    },
    buttonrow: {
        flexDirection: 'row',
        gap: 20,
        width: width * 0.55,
        justifyContent: 'center',
    },
})