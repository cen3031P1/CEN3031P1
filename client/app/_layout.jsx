import {Stack, router} from 'expo-router';
import { Appearance,useColorScheme } from 'react-native';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';

export default function RootLayout() {
    const colorscheme = useColorScheme();
    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack screenOptions = {{headerShown: false}}> 
                <Stack.Screen name='index'/> 
                <Stack.Screen name='signin_screen'/> 
                <Stack.Screen name="(tabs)"/>
            </Stack>
        </ThemeProvider>
    );
}