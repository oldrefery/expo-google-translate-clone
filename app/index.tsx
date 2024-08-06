import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useRecording } from '~/utils/recording';
import { speechToText } from '~/utils/speech-to-text';
import { textToSpeech } from '~/utils/text-to-speech';
import { translate } from '~/utils/translate';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const { recording, startRecording, stopRecording } = useRecording();

  const handleTranslate = async () => {
    const translation = await translate(input);

    setOutput(translation);
  };

  const handleReadOut = async () => {
    await textToSpeech(output);
  };

  const handleRecord = async () => {
    if (!recording) {
      await startRecording();
    } else {
      const uri = await stopRecording();
      console.log('stopRecording', uri);

      if (uri) {
        const response = await speechToText(uri);
        setInput(response?.text || 'speechToText has a problem');
      }
    }
  };

  return (
    <View className="mx-auto w-full max-w-xl">
      <Stack.Screen options={{ title: 'Translate' }} />

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
          <FontAwesome
            name={recording ? 'stop-circle' : 'microphone'}
            size={18}
            color="darkgrey"
            onPress={handleRecord}
          />
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
    </View>
  );
}
