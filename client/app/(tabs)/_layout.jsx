import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Appearance, useColorScheme, Image} from 'react-native';
<<<<<<< HEAD
import { Tabs,Redirect} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import {useAuthContext} from '../hook/useAuthContext';

export default function TabLayout() {
  const colorscheme = useColorScheme();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      <Redirect href="/" />;
    }
  }, [user]);
=======
import { Tabs, Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import useAuthContext from '../hook/useAuthContext.jsx';

export default function TabLayout() {
  const colorscheme = useColorScheme();
  const {user} = useAuthContext()
>>>>>>> 97df680190a35e38793f573b21a71cc0bea816e2

  useEffect(() => {
    if(!user){
      router.replace('/signin_screen')
    }
  },[user] )

  
  return (
    <Tabs
    screenOptions = {{
      tabBarActiveTintColor: '#FFA500',
      tabBarInactiveTintColor: '#1E90FF',
      headerShown: false,
      tabBarStyle: {
        height: '6.5%'
      },
      tabBarLabelStyle: {
        fontSize: 11,
      }
    }}
    style={styles.container}
    >
      <Tabs.Screen name="home" options={{ 
        title: 'Home',
        tabBarIcon: ({ color,size, focused}) => (
          <Ionicons
          name = {focused ? 'home' : 'home'}
          size = {size}
          color = {color}
          />
        )
      }} />
      <Tabs.Screen name="leaderboard" options={{
        title: 'Leaderboard',
        tabBarIcon: ({ color,size, focused}) => (
          <Ionicons
          name = {focused ? 'trophy' : 'trophy'}
          size = {size}
          color = {color}
          />
        )
      }} />
      <Tabs.Screen name="friend_list" options={{
        title: 'Friends List',
        tabBarIcon: ({ color,size, focused}) => (
          <Ionicons
          name = {focused ? 'people' : 'people'}
          size = {size}
          color = {color}
          />
        )
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Settings',
        tabBarIcon: ({ color,size, focused}) => (
          <Ionicons
          name = {focused ? 'settings' : 'settings'}
          size = {size}
          color = {color}
          />
        )
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
