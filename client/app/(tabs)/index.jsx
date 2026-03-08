import { View, Text,Image} from 'react-native';

// will display profile picture
// badges -> best badges on click
// goal
// streak
// maybe calendar / map location

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Image
      src='../assets/images/defaultpfp.png'
      />
      
    </View>
  );
}