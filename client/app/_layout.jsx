import {Stack, router} from 'expo-router';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { AuthContextProvider } from './context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    
    const [loaded, error] = useFonts({
        'PressStart2P-Regular': require('./assets/PressStart2P-Regular.ttf')
    });

    useEffect(() => {
        if (loaded || error) {
        SplashScreen.hideAsync();
        }
    }, [loaded, error]);

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