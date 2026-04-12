import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { AuthContextProvider } from './context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import useAuthContext from './hook/useAuthContext.jsx';
import { Stack } from 'expo-router';

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
            </AuthContextProvider>
        </ThemeProvider>
    );
}

function RootNavigator() {
    const {user, loading} = useAuthContext()


   return (
         <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signin_screen" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}