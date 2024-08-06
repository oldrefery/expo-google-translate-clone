import { Audio } from 'expo-av';

import { supabase } from '~/utils/supabase';

export const textToSpeech = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: JSON.stringify({ input: text }),
  });

  if (error) {
    console.error(error);
  }

  if (data) {
    const { sound } = await Audio.Sound.createAsync({
      uri: `data:audio/mp3;base64,${data.mp3Base64}`,
    });
    sound.playAsync();
  }
};
