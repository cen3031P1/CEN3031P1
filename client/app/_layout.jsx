import {Stack} from 'expo-router';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {AuthContextProvider, useAuthContext} from './hook/useAuthContext';


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
                <RootNavigator/>

                {/* <Stack screenOptions = {{headerShown: false}}> 
                    <Stack.Screen name='index'/> 
                    <Stack.Screen name='signin_screen'/> 
                    <Stack.Screen name="(tabs)"/>
                </Stack> */}

            </AuthContextProvider>
        </ThemeProvider>
    );
}

function RootNavigator() {
    const {user, loading} = useAuthContext();


   return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signin_screen" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}