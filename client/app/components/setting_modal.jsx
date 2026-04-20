import fonts from '../theme/fonts';
import colors from '../theme/colors';
import { useEffect, useState } from 'react';
import { Text,StyleSheet, Pressable,Modal,View, TextInput} from 'react-native';
import { X } from 'lucide-react-native';

export default function SettingModal({onPress_cancel, onPress_perform, onChangeText, type, title, subtext1, subtext2, action,visible, isdeleting = false, errorMessage, value, style, ...props}){
    const [showpassword, setShowPassword] = useState(true)

    return(
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={onPress_cancel}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                    <View style={{width : '85%', alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Text style={styles.modalBody}>
                            {subtext1}
                        </Text>
                        <Text style={styles.modalBody}>
                            {subtext2}
                        </Text>
                    </View>

                    {errorMessage ? <Text style={styles.modalErrorText}>{errorMessage}</Text> : null}

                    {type === 'delete' &&
                    <TextInput
                        style={styles.modalInput}
                        placeholder='Enter YOUR account password to confirm'
                        secureTextEntry={showpassword}
                        autoCapitalize='none'
                        autoCorrect={false}
                        editable={isdeleting}
                        value={value}
                        onChangeText={onChangeText}
                    />}

                    {(type === 'bio' || type === 'goal' || type === 'streak') &&
                    <TextInput
                        style={styles.modalInput}
                        placeholder= {'Change your ' + type.toLowerCase()}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={value}
                        onChangeText={onChangeText}
                    />}

                    {(type === 'make admin') &&
                    <TextInput
                        style={styles.modalInput}
                        placeholder= {'Username'}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={value}
                        onChangeText={onChangeText}
                    />}

                    <View style={styles.modalActions}>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={onPress_cancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                        

                        {type === 'delete' &&  
                            <Pressable
                                style={[styles.deleteButton, !isdeleting && styles.disabledButton]}
                                onPress={onPress_perform}
                                disabled={!isdeleting}
                            >
                                <Text style={styles.deleteButtonText}>{!isdeleting ? 'Deleting...' : 'Delete'}</Text>
                            </Pressable>
                        }

                        {type !== 'delete' &&  
                            <Pressable
                                style={styles.generalbutton}
                                onPress={onPress_perform}
                            >
                                <Text style={styles.generalButtonText}>{action}</Text>
                            </Pressable>
                        }

                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.35)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalCard: {
		width: '100%',
		maxWidth: 420,
		backgroundColor: 'lightgrey',
		borderRadius: 10,
		padding: 18,
		borderWidth: 1,
		borderColor: '#cdd7eb',
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: '800',
		marginBottom: 10,
		textAlign: 'center',
	},
	modalBody: {
		fontSize: 15,
		textAlign: 'center',
		marginBottom: 8,
		color: '#333',
	},
	modalInput: {
		height: 44,
		borderWidth: 1,
		borderColor: '#9da8bf',
		borderRadius: 6,
		paddingHorizontal: 12,
		backgroundColor: '#fff',
		marginTop: 4,
	},
	modalErrorText: {
		marginTop: 8,
		textAlign: 'center',
		color: '#b42318',
		fontSize: 14,
		fontWeight: '700',
	},
	modalActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
		marginTop: 14,
	},
	cancelButton: {
		flex: 1,
		height: 42,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#9da8bf',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f4f6fb',
	},
	deleteButton: {
		flex: 1,
		height: 42,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#d43f3a',
	},
	cancelButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#27364d',
	},
	deleteButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#fff',
	},
	generalbutton: {
		flex: 1,
		height: 42,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.settingbutton,
	},
	generalButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#fff',
	},
	disabledButton: {
		opacity: 0.7,
	},
})