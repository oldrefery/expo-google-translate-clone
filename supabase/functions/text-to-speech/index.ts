import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import OpenAI from 'npm:openai';

const openai = new OpenAI();

Deno.serve(async (req: Request) => {
  const { input } = await req.json();
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input,
  });

  const buffer = new Uint8Array(await mp3.arrayBuffer());
  const mp3Base64 = btoa(String.fromCharCode(...buffer));
  return new Response(JSON.stringify({ mp3Base64 }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/text-to-speech' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
