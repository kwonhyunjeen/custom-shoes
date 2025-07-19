// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ChatCerebras } from "@langchain/cerebras";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import * as z from "zod";

// 프롬프트 토큰을 줄이기 위해 `z.union([z.literal("black"), ...])` 대신 `z.string()`로 선언
const outputSchema = z.object({
  collar: z.string(),
  eyestay: z.string(),
  heel_counter: z.string(),
  insole: z.string(),
  laces: z.string(),
  logo: z.string(),
  midsole: z.string(),
  mudguard: z.string(),
  outsole: z.string(),
  quarter: z.string(),
  toe: z.string(),
  tongue: z.string(),
  vamp: z.string(),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);
const outputFormatInstructions = outputParser.getFormatInstructions();

Deno.serve(async (req) => {
  const { message } = await req.json();

  const CEREBRAS_API_KEY = Deno.env.get("CEREBRAS_API_KEY");

  if (!CEREBRAS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "CEREBRAS_API_KEY is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const llm = new ChatCerebras({
    apiKey: CEREBRAS_API_KEY,
    model: "llama-3.3-70b",
    maxTokens: 2048,
  });

  const variableParser = {
    outputFormatInstructions: () => outputFormatInstructions,
    message: (input: { message: string }) => input.message,
  };

  // TODO: 프롬프트 고도화
  const promptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `
You are a helpful assistant that generates shoe color combinations.

The colors you can use are:
black, white, cobblestone, sport-red, sail, old-royal, royal-tint, pink-foam, kumquat, tour-yellow, light-bone, malachite

{{outputFormatInstructions}}
`.trim(),
      { templateFormat: "mustache" },
    ),
    HumanMessagePromptTemplate.fromTemplate("{{message}}", {
      templateFormat: "mustache",
    }),
  ]);

  console.debug(
    "Prompt:",
    await promptTemplate.format({ outputFormatInstructions, message }),
  );

  const runnable = RunnableSequence.from([
    variableParser,
    promptTemplate,
    llm,
    outputParser,
  ]);

  const output = await runnable.invoke({ message });

  // console.debug("Output:", output);

  return new Response(JSON.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-shoes-color' \
    --header 'Content-Type: application/json' \
    --data '{"message":"string"}'

*/
