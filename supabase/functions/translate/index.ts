import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import OpenAI from 'npm:openai';

const openai = new OpenAI();

console.log('Start local DENO');

Deno.serve(async (req) => {
  const { input, from, to } = await req.json();
  console.log({ input, from, to });

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
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/translate' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
