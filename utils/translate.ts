import { supabase } from '~/utils/supabase';

export const translate = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('translate', {
    body: JSON.stringify({
      input: text,
      from: 'English',
      to: 'Dutch',
    }),
  });

  if (error) {
    console.log(error);
  }

  return data?.content || 'Something went wrong';
};
