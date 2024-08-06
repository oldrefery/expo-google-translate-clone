import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

import { languages } from '~/assets/languages';
import { useRecording } from '~/utils/recording';
import { speechToText } from '~/utils/speech-to-text';
import { textToSpeech } from '~/utils/text-to-speech';
import { translate } from '~/utils/translate';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const { recording, startRecording, stopRecording } = useRecording();
  const [languageFrom, setLanguageFrom] = useState('English');
  const [languageTo, setLanguageTo] = useState('Dutch');
  const [selectLanguageMode, setSelectLanguageMode] = useState<'source' | 'target' | null>(null);

  const handleTranslate = async () => {
    const translation = await translate(input, languageFrom, languageTo);

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

        const translation = await translate(response?.text, languageFrom, languageTo);
        setOutput(translation);
      }
    }
  };

  const handleSwapLanguages = async () => {
    setLanguageFrom(languageTo);
    setLanguageTo(languageFrom);
  };

  if (selectLanguageMode) {
    return (
      <FlatList
        data={languages}
        renderItem={({ item }) => (
          <Text
            onPress={() => {
              if (selectLanguageMode === 'source') {
                setLanguageFrom(item.name);
              } else {
                setLanguageTo(item.name);
              }
              setSelectLanguageMode(null);
            }}
            className="p-2 px-5">
            {item.name}
          </Text>
        )}
      />
    );
  }

  return (
    <View className="mx-auto w-full max-w-xl">
      <Stack.Screen options={{ title: 'Translate' }} />

      {/*Language selectors*/}
      <View className="flex-row justify-around p-5">
        <Text
          onPress={() => setSelectLanguageMode('source')}
          className="font-semibold color-blue-600">
          {languageFrom}
        </Text>
        <FontAwesome name="exchange" size={18} color="grey" onPress={handleSwapLanguages} />
        <Text
          onPress={() => setSelectLanguageMode('target')}
          className="font-semibold color-blue-600">
          {languageTo}
        </Text>
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
