import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet, Pressable,View} from 'react-native';
import AppText from './AppText';

//mainly for displaying goal and streak and maybe badges

export default function ProfileDisplay({imgsrc,base_numval,optimal_numval,onPress,type,children,style,...props}){
    return(
        <View style = {[styles.display,style]}>
            <View style ={{backgroundColor: colors.secondary, width: '100%', alignItems: 'center',justifyContent: 'center', borderColor: colors.primary, borderBottomWidth:5}}>
                <AppText style = {{color : colors.buttonText, padding: 10,paddingTop: 14}}>{children}</AppText>
            </View>
            
            

            {type !== 'log' &&
                <View style = {styles.subdisplay}>
                    {type === 'goal' &&
                        <>
                            <AppText style ={styles.textdisplay}> Current Goal: </AppText>
                            <AppText style ={styles.textdisplay}>{base_numval}</AppText>
                            <AppText style ={styles.textdisplay}> Goal Status: </AppText>
                            <AppText style ={styles.textdisplay}>{base_numval}</AppText>
                        </>
                    }
                    {type === 'streak' &&
                        <>
                            <AppText style ={styles.textdisplay}>current Streak: </AppText>
                            <AppText style ={styles.textdisplay}>{optimal_numval}</AppText>
                            <AppText style ={styles.textdisplay}>Best Streak: </AppText>
                            <AppText style ={styles.textdisplay}>{optimal_numval}</AppText>
                        </>
                    }

                </View>
            }

            {type === 'log'&&
                <View style = {styles.subdisplay}>
                    <AppText> button </AppText>
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
        borderRadius: 5,
        borderWidth: 5,
        borderColor: colors.primary,
        alignItems: 'center',
        fontSize: 25,
        flexDirection: 'column',
    },
    subdisplay:{
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column'
    },
    titlebox:{

    },
    textdisplay: {
        fontSize: 10,
        marginTop: 18,
        textAlign: 'center',
        color: colors.regularText,
    }
})