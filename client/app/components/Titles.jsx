import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet} from 'react-native';
import AppText from './AppText';

export default function TitleComp({children, style }){
    return (
        <AppText style = {[styles.text,style]}>
            {children}
        </AppText>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 35,
        fontFamily: fonts.headers,
        color: colors.primary,
        textShadowColor: colors.secondary,
        textShadowOffset: { width: 2.5, height: 2.5 },
        textShadowRadius: 1,
        textAlign: 'center',
    }
});