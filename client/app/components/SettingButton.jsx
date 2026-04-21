import fonts from '../theme/fonts';
import colors from '../theme/colors';
import react from 'react';
import { Text,StyleSheet, Pressable, View} from 'react-native';
import AppText from './AppText';
import { AlignCenter, AlignJustify, FlameKindling, X,} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingButton({PrivateOn=false , isPrivacy=false, Icon, onPress,children,style,...props}){
    return(

        <View style = {styles.border}>
            <Pressable
            style ={[styles.button,style]}
            onPress={onPress}
            >
                <View style = {{flexDirection: 'row', width: '80%'}}>
                    <Icon style = {styles.icon}/>
                    <AppText style ={styles.settingText}>{children}</AppText>
                    {!isPrivacy && <X style = {styles.icon}/>}

                    {isPrivacy &&
                        <View style= {{flexDirection: 'column', alignItems: 'center', height: 30}}>
                            <Text style = {styles.toggletext}>{PrivateOn ? 'ON' : 'OFF'}</Text>
                            <Ionicons
                                name = 'toggle'
                                style = {[styles.toggle, {transform: [{scaleX: PrivateOn ? 1 : -1}]}]}
                                size = {30}
                                color = {PrivateOn ? colors.secondary : 'black'}
                            />
                        </View>
                    }
                </View>

            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    border:{
        width: '105%',
        height: 65,
        justifyContent: 'center',
        backgroundColor: '#e4e9f5',
        alignItems: 'center',
        borderRadius: 5,
    },
    button:{
		width: '97%',
		height: 53,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		alignItems: 'left',
        justifyContent: 'center',

    },
    settingText: {
        paddingTop: 5,
        width: '100%',
        fontSize: 20,
        fontFamily: fonts.settings,
        fontWeight: '800'
    },
    icon: {
        margin: 5,
        width: 35,
        height: 35,
        marginTop: 7
    },
    toggle:{
        marginTop: -7,
    },
    toggletext:{
        fontFamily: fonts.settings,
        fontWeight: '800',
        marginTop: -3
    }
})