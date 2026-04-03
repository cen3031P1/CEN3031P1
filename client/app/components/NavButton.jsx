import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet, Pressable} from 'react-native';
import AppText from './AppText';


export default function NavButton({onPress,children,style,...props}){
    return(
        <Pressable
        style = {[styles.button,style]}
        onPress={onPress}
        >
            <AppText>{children}</AppText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button:{
        width: '80%',
        height: 40,
        backgroundColor: colors.secondary,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '90%',
    }
})