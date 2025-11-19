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
import z from "zod";

const MODE = Deno.env.get("MODE");
const CEREBRAS_API_KEY = Deno.env.get("CEREBRAS_API_KEY");

// TODO: production Origin 설정
const corsHeaders = {
  "Access-Control-Allow-Origin": MODE === "production" ? "http://TODO" : "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

const outputSchema = z.object({
  collar: z.union([
    z.literal("black"),
    z.literal("white"),
    z.literal("gray"),
    z.literal("golden"),
    z.literal("red"),
    z.literal("navy"),
    z.literal("burgundy"),
    z.literal("brown"),
  ]),
  laces: z.union([
    z.literal("black"),
    z.literal("white"),
    z.literal("gray"),
    z.literal("cream"),
    z.literal("red"),
    z.literal("navy"),
    z.literal("brown"),
  ]),
  insole: z.union([
    z.literal("black"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("light-gray"),
    z.literal("navy"),
  ]),
  mudguard: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("golden"),
    z.literal("olive"),
    z.literal("dark-green"),
    z.literal("royal-blue"),
    z.literal("navy"),
    z.literal("pink"),
    z.literal("red"),
    z.literal("brown"),
  ]),
  midsole: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("royal-blue"),
    z.literal("pink"),
    z.literal("red"),
    z.literal("brown"),
  ]),
  foxing: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("orange"),
    z.literal("olive"),
    z.literal("dark-green"),
    z.literal("royal-blue"),
    z.literal("navy"),
    z.literal("pink"),
    z.literal("red"),
  ]),
  quarter: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("light-gray"),
    z.literal("golden"),
    z.literal("olive"),
    z.literal("dark-green"),
    z.literal("royal-blue"),
    z.literal("navy"),
    z.literal("pink"),
    z.literal("burgundy"),
    z.literal("red"),
    z.literal("orange"),
    z.literal("purple"),
    z.literal("teal"),
    z.literal("brown"),
    z.literal("coral"),
    z.literal("cocoa"),
  ]),
  logo: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("orange"),
    z.literal("olive"),
    z.literal("dark-green"),
    z.literal("royal-blue"),
    z.literal("navy"),
    z.literal("pink"),
    z.literal("red"),
  ]),
  outsole: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("royal-blue"),
    z.literal("pink"),
    z.literal("red"),
    z.literal("brown"),
  ]),
  toe: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("orange"),
    z.literal("olive"),
    z.literal("dark-green"),
    z.literal("royal-blue"),
    z.literal("navy"),
    z.literal("pink"),
    z.literal("red"),
  ]),
  tongue: z.union([
    z.literal("black"),
    z.literal("white"),
    z.literal("gray"),
    z.literal("brown"),
    z.literal("navy"),
  ]),
  vamp: z.union([
    z.literal("black"),
    z.literal("gray"),
    z.literal("white"),
    z.literal("cream"),
    z.literal("orange"),
    z.literal("olive"),
    z.literal("dark-green"),
    z.literal("royal-blue"),
    z.literal("navy"),
    z.literal("pink"),
    z.literal("red"),
  ]),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);
const outputFormatInstructions = outputParser.getFormatInstructions();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { message } = await req.json();

  if (!CEREBRAS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "CEREBRAS_API_KEY is not set" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-shoes-color' \
    --header 'Content-Type: application/json' \
    --data '{"message":"string"}'

*/
