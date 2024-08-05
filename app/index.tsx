import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Stack } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      {/*Language selectors*/}
      <View className="flex-row justify-around p-5">
        <Text className="font-semibold color-blue-600">English</Text>
        <FontAwesome name="exchange" size={18} color="grey" />
        <Text className="font-semibold color-blue-600">Dutch</Text>
      </View>

      {/*Input container*/}
      <View className="border-y border-gray-300 p-5">
        <View className="flex-row gap-5 ">
          <TextInput
            placeholder="Enter your text"
            className="min-h-32 flex-1 text-xl"
            multiline
            maxLength={5000}
          />
          <FontAwesome5 name="arrow-circle-right" size={24} color="blue" />
        </View>
        <View className="flex-row justify-between">
          <FontAwesome name="microphone" size={18} color="darkgrey" />
          <Text className="color-gray-500">0 / 5000</Text>
        </View>
      </View>

      {/* Output container*/}
      <View className="gap-5 bg-gray-300 p-5">
        <Text className="min-h-32 text-xl">Output</Text>
        <View className="flex-row justify-between">
          <FontAwesome name="volume-up" size={18} color="darkgrey" />
          <FontAwesome name="copy" size={18} color="darkgrey" />
        </View>
      </View>
    </>
  );
}
