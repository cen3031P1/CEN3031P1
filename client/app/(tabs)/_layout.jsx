import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Appearance, useColorScheme, Image} from 'react-native';
import { Colors } from '../assets/color_configs';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorscheme = useColorScheme();

  return (
    <Tabs
    screenOptions = {{
      tabBarActiveTintColor: '#FFA500',
      tabBarInactiveTintColor: '#1E90FF',
      headerShown: false,
    }}
    style={styles.container}
    >
      <Tabs.Screen name="index" options={{ 
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
          name = {focused ? 'settings' : 'settings'}
          size = {size}
          color = {color}
          />
        )
      }} />
      <Tabs.Screen name="friend_list" options={{
        title: 'Friends List',
        tabBarIcon: ({ color,size, focused}) => (
          <Ionicons
          name = {focused ? 'settings' : 'settings'}
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
