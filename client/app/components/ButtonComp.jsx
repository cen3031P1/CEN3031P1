import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet, Pressable} from 'react-native';
import AppText from './AppText';


export default function ButtonComp({onPress,children,style,...props}){
    return(
        <Pressable
        style = {[styles.button,style]}
        onPress={onPress}
        >
            <AppText style = {{color : colors.buttonText, fontSize: 12}}>{children}</AppText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button:{
        width: '80%',
        height: 45,
        backgroundColor: colors.secondary,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    }
})