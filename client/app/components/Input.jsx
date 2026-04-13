import fonts from '../theme/fonts';
import colors from '../theme/colors';
import { useState } from 'react';
import { Text,StyleSheet,TextInput, Pressable} from 'react-native';
import AppText from './AppText';
import { View } from 'react-native';
import { EyeOff,Eye } from 'lucide-react-native';

export default function Input({style, isPassword = false, ...props}){
    const[hidePassword, setHidePassword] = useState(true);

    return (
        <View style = {[styles.container, style]}>
            <TextInput 
                {...props}
                style = {[styles.input]}
                secureTextEntry = {isPassword ? hidePassword : false}        
                />
                
                {isPassword && (
                    <Pressable
                        onPress={() => setHidePassword(prev => !prev)}
                        style = {styles.button}
                    >   
                        <View style = {styles.icon}>
                            {hidePassword ?
                                <EyeOff></EyeOff> : <Eye></Eye>
                            }
                        </View>

                    </Pressable>
                )}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: '10%',
        width: '100%',
        minWidth: 250,
        borderWidth : 2,
        borderRadius: 7,
        borderColor : colors.border,
        flexDirection: 'row',
    },
    input:{
        flex: 1,
        paddingLeft: 5,
        fontSize: 10,
        height: '100%',
        fontFamily: fonts.general,
    },
    button:{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: 2,
        height: '100%',
    },
    buttontext:{
        textAlign: 'right'
    },
    icon: {
        width: '92%',
        height: '92%',
    }
})
