import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet, Pressable,View, Image, Platform} from 'react-native';
import AppText from './AppText';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window')

const all_badges =[
   {key: 5, img: require('../assets/images/5.png')},
   {key: 10, img: require('../assets/images/10.png')},
   {key: 15, img: require('../assets/images/15.png')},
   {key: 20, img: require('../assets/images/20.png')},
]

export default function ProfileDisplay({imgsrc,min_bestStreak=0,base_numval,optimal_numval,onPress,atgym,points=0,time=0,type,children,style,...props}){
    const badges = all_badges.filter(badge => badge.key <= min_bestStreak);

    return(
        <View style = {[styles.display,style]}>
            <View style ={{backgroundColor: colors.secondary, width: '100%', alignItems: 'center',justifyContent: 'center', borderColor: colors.primary, borderBottomWidth:5,borderTopStartRadius: 15, borderTopEndRadius: 15}}>
                <AppText style = {{color : colors.buttonText, padding: 10,paddingTop: 14, fontSize: 15, width: '100%', textAlign: 'center'}}>{children}</AppText>
            </View>
                
            {type === 'goal' &&
                <View style = {[styles.subdisplay]}>
                    <AppText style ={[styles.numdisplay, [base_numval > optimal_numval ? {color: 'green'} : {color: 'red'}], [optimal_numval === 0 ? {fontSize: 50} : {fontSize: 30}]]}>{optimal_numval}</AppText>
                    {optimal_numval !== 0 && (
                        <AppText style = {styles.textdisplay}>{base_numval > optimal_numval ? 'You\'ve reached your goal!' : 'Keep going!'}</AppText>
                    )}
                    {optimal_numval === 0 && (
                        <AppText style = {styles.textdisplay}>No goal set</AppText>
                    )}
                </View>
            }

            {type === 'streak' &&
                <View style = {styles.subdisplay}>
                    <Image source={imgsrc} style={{width: width*.25, resizeMode: 'contain'}} />
                    <AppText style ={[styles.numdisplay, {fontSize: 35,position: 'absolute'}, [base_numval < 5 ? {top: '40%'} : {top: '55%'}] ]}>{base_numval}</AppText>
                </View>
            }

            {type === 'log'&&
                <View style = {[styles.subdisplay, {justifyContent: 'null'}]}>
                    <AppText style ={[styles.textdisplay,{fontSize: 9, width: width*.85}]}>You will get points based off the duration you've been at the gym, as well as your streak.</AppText>
                    <AppText style ={[styles.textdisplay,{fontSize: 9, marginBottom: 5, width: width*.85}]}>If you are encountering location errors, try setting your gym in the settings menu.</AppText>
                    <View style = {{flexDirection: 'row',justifyContent: 'center', width: width*.85, marginTop: 10}}>
                        <View style = {{flexDirection: 'column', width: width*.3}}>
                            <AppText style ={[styles.textdisplay,{fontSize: 9}]}>At Gym: </AppText>
                            <AppText style ={[styles.textdisplay, [atgym ? {color: 'green'} : {color: 'red'}],{fontSize: 12}]}>{atgym ? "Yes" : "No"}</AppText>
                        </View>
                        <View style = {{flexDirection: 'column', width: width*.4}}>
                            <AppText style ={[styles.textdisplay,{fontSize: 9}]}>Points Gained: </AppText>
                            <AppText style ={[styles.textdisplay, [points !==0 ? {color: 'green'} : {color: 'red'}],{fontSize: 12}]}>{points !== 0? points : "0"}</AppText>
                        </View>
                        <View style = {{flexDirection: 'column', width: width*.3}}>
                            <AppText style ={[styles.textdisplay,{fontSize: 9}]}>Minutes: </AppText>
                            <AppText style ={[styles.textdisplay, [time !==0 ? {color: 'green'} : {color: 'red'}],{fontSize: 12}]}>{time !== 0? time : "0"}</AppText>
                        </View>
                    </View>
                </View>
            }

            {type === 'badges'&&
                <View style = {styles.badgecontainer}>
                    {badges.map((badge) => (
                        <Image key={badge.key} source={badge.img} style={{width: width*.2, minWidth: 75, aspectRatio: .5, maxHeight:300, resizeMode: 'contain', marginHorizontal: 5}} />
                    ))}
                     {min_bestStreak===0 &&
                     <AppText style = {styles.textdisplay}>No Badges Yet</AppText>
                     }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    display:{
        width: '48%',
        maxHeight: 400,
        aspectRatio: 1,
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
        width: '100%'
    },
    textdisplay: {
        width: '100%',
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
    },
    badgecontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
})