import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import OpenAI, { toFile } from 'npm:openai';

import { corsHeaders } from '../_shared/cors.ts';

const openai = new OpenAI();

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mp3Base64 } = await req.json();

    const buffer = Uint8Array.from(atob(mp3Base64), (c) => c.charCodeAt(0));
    const file = await toFile(buffer, 'audio.m4a', { type: 'm4a' });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    return new Response(JSON.stringify(transcription), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
