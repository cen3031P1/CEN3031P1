<<<<<<< HEAD
import {Stack} from 'expo-router';
=======
>>>>>>> 97df680190a35e38793f573b21a71cc0bea816e2
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
<<<<<<< HEAD
import {AuthContextProvider, useAuthContext} from './hook/useAuthContext';

=======
import useAuthContext from './hook/useAuthContext.jsx';
import { Stack, router } from 'expo-router';
>>>>>>> 97df680190a35e38793f573b21a71cc0bea816e2

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
<<<<<<< HEAD

                {/* <Stack screenOptions = {{headerShown: false}}> 
                    <Stack.Screen name='index'/> 
                    <Stack.Screen name='signin_screen'/> 
                    <Stack.Screen name="(tabs)"/>
                </Stack> */}

=======
>>>>>>> 97df680190a35e38793f573b21a71cc0bea816e2
            </AuthContextProvider>
        </ThemeProvider>
    );
}

function RootNavigator() {
<<<<<<< HEAD
    const {user, loading} = useAuthContext();


   return (
        <Stack screenOptions={{ headerShown: false }}>
=======


   return (
         <Stack screenOptions={{ headerShown: false }}>
>>>>>>> 97df680190a35e38793f573b21a71cc0bea816e2
            <Stack.Screen name="index" />
            <Stack.Screen name="signin_screen" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}