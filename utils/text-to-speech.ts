import { supabase } from '~/utils/supabase';

export const textToSpeech = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: JSON.stringify({ input: text }),
  });

  if (error) {
    console.error(error);
  }

  return data;
};
