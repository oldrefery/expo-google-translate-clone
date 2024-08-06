import { EncodingType, readAsStringAsync } from 'expo-file-system';

import { supabase } from '~/utils/supabase';

export const speechToText = async (uri: string | null) => {
  if (uri) {
    const recordData = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });

    const { data, error } = await supabase.functions.invoke('speech-to-text', {
      body: JSON.stringify({ mp3Base64: recordData }),
    });

    if (error) {
      console.error(error);
    }

    return data;
  }

  return 'Something went wrong';
};
