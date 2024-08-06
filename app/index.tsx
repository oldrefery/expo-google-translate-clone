import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { textToSpeech } from '~/utils/text-to-speech';
import { translate } from '~/utils/translate';
import { speechToText } from '~/utils/speech-to-text';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Audio.Recording>();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }

    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    const response = await speechToText(uri);
    setInput(response.text);
  }

  const handleTranslate = async () => {
    const translation = await translate(input);

    setOutput(translation);
  };

  const handleReadOut = async () => {
    const data = await textToSpeech(output);

    if (data) {
      const { sound } = await Audio.Sound.createAsync({
        uri: `data:audio/mp3;base64,${data.mp3Base64}`,
      });
      sound.playAsync();
    }
  };

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
            onChangeText={setInput}
            value={input}
          />
          <FontAwesome5
            name="arrow-circle-right"
            size={24}
            color="blue"
            onPress={handleTranslate}
          />
        </View>
        <View className="flex-row justify-between">
          {recording ? (
            <FontAwesome name="stop-circle" size={18} color="darkgrey" onPress={stopRecording} />
          ) : (
            <FontAwesome name="microphone" size={18} color="darkgrey" onPress={startRecording} />
          )}
          <Text className="color-gray-500">{input.length} / 5000</Text>
        </View>
      </View>

      {/* Output container*/}
      {output && (
        <View className="gap-5 bg-gray-200 p-5">
          <Text className="min-h-32 text-xl">{output}</Text>
          <View className="flex-row justify-between">
            <FontAwesome name="volume-up" size={18} color="darkgrey" onPress={handleReadOut} />
            <FontAwesome name="copy" size={18} color="darkgrey" />
          </View>
        </View>
      )}
    </>
  );
}
