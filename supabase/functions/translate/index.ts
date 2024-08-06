import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import OpenAI from 'npm:openai';

import { corsHeaders } from '../_shared/cors.ts';

const openai = new OpenAI();

console.log('Start local DENO');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { input, from, to } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. You translated from ${from} to ${to}. You output only the translated text`,
        },
        { role: 'user', content: input },
      ],
      model: 'gpt-4o-mini',
    });

    return new Response(JSON.stringify(completion.choices[0].message), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
