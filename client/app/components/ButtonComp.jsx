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
            <AppText style = {{color : colors.buttonText, fontSize: 14}}>{children}</AppText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button:{
        width: '65%',
        height: 40,
        backgroundColor: colors.secondary,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
    }
})