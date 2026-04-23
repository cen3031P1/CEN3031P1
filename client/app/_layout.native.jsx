import {Stack} from 'expo-router';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {AuthContextProvider, useAuthContext} from './hook/useAuthContext';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LOCATION_TASK } from './tasks/locationTask.js';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error('Task error:', error);
        return;
    }
    if (data) {
        const { latitude, longitude } = data.locations[0].coords;
        console.log('📍 Background location update:', latitude, longitude);
    }
});

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
    const {user, loading} = useAuthContext();


   return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signin_screen" />
            <Stack.Screen name = "map"/>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
