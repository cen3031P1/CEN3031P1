import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, Image} from 'react-native';


export default function SigninScreen() {

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
        if (username == '' || password == '' || cpassword == '' || !basicVerify(username) || !basicVerify(password) || !basicVerify(cpassword)){
            setInvalid_Cred('Invalid Username or Password');
            return; 
        }
        if(password !== cpassword){
            setInvalid_Cred('Passwords do not match');
            return; 
        }
        const result = await signinVerification(username,password);
        // not sure how we want this, we obv dont want duplicate username and password pairs 
        // so im not sure which we are making unique or how signup verification will be done.
        if (result){
            router.replace('/(tabs)');
        }
        else{
            setInvalid_Cred('Invalid Username or Password, Please change one field');
            return; 
        }
    }

    function basicVerify(text){
        if(text == null|| text.includes(' ') || text.length > 15 || text.length <5){
            return false;
        }
        return true; 
    }

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
        style = {styles.inputbox}
        />
        <TextInput
        onChangeText={setCpassword}
        value = {cpassword}
        placeholder='Confirm Password'
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