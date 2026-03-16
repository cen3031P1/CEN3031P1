import {Stack, router} from 'expo-router';
import { Appearance,useColorScheme } from 'react-native';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { AuthContextProvider } from './context/AuthContext';

export default function RootLayout() {
    const colorscheme = useColorScheme();
    return (
        <ThemeProvider value={DefaultTheme}>
            <AuthContextProvider>
                <Stack screenOptions = {{headerShown: false}}> 
                    <Stack.Screen name='index'/> 
                    <Stack.Screen name='signin_screen'/> 
                    <Stack.Screen name="(tabs)"/>
                </Stack>
            </AuthContextProvider>
        </ThemeProvider>
    );
}