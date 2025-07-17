// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ChatCerebras } from "@langchain/cerebras";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as z from "zod";

Deno.serve(async (req) => {
  const { message } = await req.json();

  const CEREBRAS_API_KEY = Deno.env.get("CEREBRAS_API_KEY");

  if (!CEREBRAS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "CEREBRAS_API_KEY is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const outputSchema = z.object({
    setup: z.string().describe("The setup of the joke"),
    punchline: z.string().describe("The punchline to the joke"),
    rating: z
      .number()
      .optional()
      .describe("How funny the joke is, from 1 to 10"),
  });

  const llm = new ChatCerebras({
    apiKey: CEREBRAS_API_KEY,
    model: "llama-3.3-70b",
    maxTokens: 2048,
  });
  const structuredLlm = llm.withStructuredOutput(outputSchema);

  const output = await structuredLlm.invoke([
    new SystemMessage("Tell me a joke about cats."),
    // new HumanMessage(message),
  ]);

  return new Response(JSON.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-shoes-color' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
