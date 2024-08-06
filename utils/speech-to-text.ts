import { readAsStringAsync } from 'expo-file-system';
import { Platform } from 'react-native';

import { supabase } from '~/utils/supabase';

export const speechToText = async (uri: string | null) => {
  if (uri) {
    const recordData = await uriToBase64(uri);

    const { data, error } = await supabase.functions.invoke('speech-to-text', {
      body: JSON.stringify({ mp3Base64: recordData }),
    });

    if (error) {
      console.log(error);
    }

    return data;
  }

  return 'Something went wrong';
};

const uriToBase64 = async (uri: string) => {
  if (Platform.OS === 'web') {
    const res = await fetch(uri);
    const blob = await res.blob();
    const base64: string = await convertBlobToBase64(blob);
    return base64.split('base64,')[1];
  } else {
    return readAsStringAsync(uri, { encoding: 'base64' });
  }
};

const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
