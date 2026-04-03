import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet} from 'react-native';

export default function TitleComp({children, style }){
    return (
        <Text style ={[styles.text,style]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 35,
        fontWeight: 'bold',
        fontFamily: fonts.headers,
        color: colors.primary,
        textShadowColor: colors.secondary,
        textShadowOffset: { width: 2.5, height: 2.5 },
        textShadowRadius: 0,
        textAlign: 'center',
    }
});