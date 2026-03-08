import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';

export default function LoginScreen() {

    //server request
    async function loginVerification(username, password){
        try {
            const response = await fetch('ip+port/login',{
                method: 'POST',
                headers: {
                    'info-type' :'loginInfo'
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

    async function handleLogin(username, password){
        setInvalid_Cred('');
        if (username == '' || password == ''|| !basicVerify(password)|| !basicVerify(username)){
            setInvalid_Cred('Invalid Username or Password');
            return;
        }
        const result = await loginVerification(username,password);

        if(result){
            router.replace('/(tabs)');
        }
        else{
            setInvalid_Cred('Username or Password does not exist');
            return;
        }
    }

    // idk what we are requiring
    // i assume no spaces and maybe a min/max char len
    function basicVerify(text){
        if( text == null|| text.includes(' ') || text.length > 15 || text.length <5){
            return false;
        }
        return true; 
    }

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