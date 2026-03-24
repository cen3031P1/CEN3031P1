import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';
import { useSignin } from './hook/useSignIn';

export default function SigninScreen() {

    const {signup, totalFailure, signUpFail, signUpPass} = useSignin();
    //server request
    async function signinVerification(){
        try {
            const response = await fetch('ip+port/signin',{
                method: 'POST',
                headers: {
                    'info-type' :'signinInfo'
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
        
        const success = await signup(username, password)
        if (success){router.replace("/(tabs)")};
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

    useEffect(() => {
        console.log("load next page somehow? sign up success")
    }, [signUpPass])

    function handleBack(){
        router.replace('/');
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
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

        <Text>Enter your desired information.</Text>
        {invalid_Cred !== '' && <Text style ={styles.failtext}>{invalid_Cred}</Text>}

        <Text>Your password must contain: </Text>
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
        secureTextEntry={true}
        style = {styles.inputbox}
        />
        <TextInput
        onChangeText={setCpassword}
        value = {cpassword}
        placeholder='Confirm Password'
        secureTextEntry={true}
        style = {styles.inputbox}
        />

        <View style={styles.buttonrow}>
            <Pressable onPress={handleBack} style ={styles.button}>
                <Text style={styles.buttontext}>go back</Text>
            </Pressable>
            <Pressable onPress={() =>handleSignup(username,password,cpassword)} style ={styles.button}>

                {/* need validation i think */}

                <Text style={styles.buttontext}>Sign-Up</Text>
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