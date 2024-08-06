import { supabase } from '~/utils/supabase';

export const translate = async (input: string, from: string, to: string) => {
  const { data, error } = await supabase.functions.invoke('translate', {
    body: JSON.stringify({
      input,
      from,
      to,
    }),
  });

  if (error) {
    console.log(error);
  }

  return data?.content || 'Something went wrong';
};
