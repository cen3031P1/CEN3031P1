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
                <View style = {{flexDirection: 'row', width: '99%'}}>
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
		width: '96%',
		height: 50,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		alignItems: 'left',
        justifyContent: 'center',
        
    },
    settingText: {
        paddingLeft: 10,
        paddingTop: 2,
        width: '100%',
        fontSize: 20,
        fontFamily: fonts.settings,
        // color: colors.primary, 
        fontWeight: '800'
    },
    icon: {
        paddingLeft: 10,
        width: 30,
        height: 30,
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