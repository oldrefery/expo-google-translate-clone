import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import OpenAI, { toFile } from 'npm:openai';

const openai = new OpenAI();

Deno.serve(async (req: Request) => {
  const { mp3Base64 } = await req.json();

  const buffer = Uint8Array.from(atob(mp3Base64), (c) => c.charCodeAt(0));
  const file = await toFile(buffer, 'audio.m4a', { type: 'm4a' });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });

  return new Response(JSON.stringify(transcription), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/speech-to-text' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
