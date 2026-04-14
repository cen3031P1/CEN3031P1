import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet, Pressable,View, Image} from 'react-native';
import AppText from './AppText';

//mainly for displaying goal and streak and maybe badges

export default function ProfileDisplay({imgsrc,base_numval,optimal_numval,onPress,type,children,style,...props}){
    return(
        <View style = {[styles.display,style]}>
            {type !== 'log' &&
                <View style ={{backgroundColor: colors.secondary, width: '100%', alignItems: 'center',justifyContent: 'center', borderColor: colors.primary, borderBottomWidth:5,borderTopStartRadius: 15, borderTopEndRadius: 15}}>
                    <AppText style = {{color : colors.buttonText, padding: 10,paddingTop: 14}}>{children}</AppText>
                </View>
            }
            
            {(type === 'log') &&
                <Pressable onPress={onPress} style ={{backgroundColor: colors.secondary, width: '100%', alignItems: 'center',justifyContent: 'center', borderColor: colors.primary, borderBottomWidth:5,borderTopStartRadius: 15, borderTopEndRadius: 15}}>
                    <AppText style = {{color : colors.buttonText, padding: 10,paddingTop: 14}}>{children}</AppText>
                </Pressable>
            }
            

                
            {type === 'goal' &&
                <View style = {styles.subdisplay}>
                    <AppText style ={[styles.numdisplay, [base_numval > optimal_numval ? {color: 'green'} : {color: 'red'}], [optimal_numval === 0 ? {fontSize: 50} : {fontSize: 30}], { fontWeight: 'bold'}]}>{optimal_numval}</AppText>
                    {optimal_numval !== 0 && (
                        <AppText style = {styles.textdisplay}>{base_numval > optimal_numval ? 'You\'ve reached your goal!' : 'Keep going!'}</AppText>
                    )}
                </View>
            }

            {type === 'streak' &&
                <View style = {styles.subdisplay}>
                    <Image source={imgsrc} style={{width: 105, height: 100, resizeMode: 'cover'}} />
                    <AppText style ={[styles.numdisplay, {fontSize: 40, fontWeight: 'bold',position: 'absolute'}, [base_numval < 5 ? {top: '30%'} : {top: '55%'}] ]}>{base_numval}</AppText>
                </View>
            }
                

            {type === 'log'&&
                <View style = {styles.subdisplay}>
                    <AppText style ={styles.textdisplay}> description of point allocation</AppText>
                </View>
            }

            {type === 'badges'&&
                <View style = {styles.subdisplay}>
                    <AppText style ={styles.textdisplay}> images of badges maybe based off the highest streak? </AppText>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    display:{
        width: '48%',
        aspectRatio: 1,
        maxHeight: 200,
        borderRadius: 20,
        borderWidth: 5,
        backgroundColor: colors.background,
        borderColor: colors.primary,
        overflow: 'hidden',
    },
    subdisplay:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    textdisplay: {
        width: '110%',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
        color: colors.regularText,
    },
    numdisplay: {
        fontSize: 20,
        color: colors.regularText,
        includeFontPadding: false,
        textAlign: 'center',
    }
})