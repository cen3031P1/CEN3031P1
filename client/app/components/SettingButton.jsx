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
                <View style = {{flexDirection: 'row', alignItems: 'center',flex :1}}>
                    <Icon style = {styles.icon}/>
                    <AppText style ={[styles.settingText,{width: '60%'}]} numberOfLines={1}>{children}</AppText>
                </View>

                <View style = {{justifyContent: 'center', alignItems: 'center', height: 30, marginRight:5}}>

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
        width: '100%',
        padding: 4,
        justifyContent: 'center',
        backgroundColor: '#e4e9f5',
        alignItems: 'center',
        borderRadius: 5,
    },
    button:{
		width: '100%',
		height: 53,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 18,
        textAlign: 'left',
        fontFamily: fonts.settings,
        fontWeight: '800',
        marginBottom: 1,
        flexShrink: 1
    },
    icon: {
        margin: 5,
        width: 35,
        height: 35,
        marginTop: 7,
    },
    endicon:{
        width: 30,
        height: 30,
    },
    toggle:{
        flexShrink: 0,
        marginTop: -7,
    },
    toggletext:{
        fontFamily: fonts.settings,
        fontWeight: '800',
        marginTop: -3
    }
})