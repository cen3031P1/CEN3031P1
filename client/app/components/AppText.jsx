import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet} from 'react-native';

export default function AppText({children, style }){
    return (
        <Text style ={[styles.text,style]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        marginBottom: -5,
        fontFamily: fonts.headers,
        width: '100%',
        textAlign: 'center'
    }
});