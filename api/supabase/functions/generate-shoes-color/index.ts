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

const outputSchema = z
  .object({
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
  })
  .partial();

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

// 검증 스키마와 지시 스키마(+메시지)를 분리해 프롬프트 크기 축소 (LLM이 지시를 잘 따르기 위함)
const formatInstructionSchema = z
  .object({
    collar: z.string(),
    laces: z.string(),
    insole: z.string(),
    mudguard: z.string(),
    midsole: z.string(),
    foxing: z.string(),
    quarter: z.string(),
    logo: z.string(),
    outsole: z.string(),
    toe: z.string(),
    tongue: z.string(),
    vamp: z.string(),
  })
  .partial();

const formatInstructions = StructuredOutputParser.fromZodSchema(
  formatInstructionSchema,
).getFormatInstructions();

const outputDescription = `
- **collar**: black, white, gray, golden, red, navy, burgundy, brown
- **laces**: black, white, gray, cream, red, navy, brown
- **insole**: black, white, cream, light-gray, navy
- **mudguard**: black, gray, white, cream, golden, olive, dark-green, royal-blue, navy, pink, red, brown
- **midsole**: black, gray, white, cream, royal-blue, pink, red, brown
- **foxing**: black, gray, white, cream, orange, olive, dark-green, royal-blue, navy, pink, red
- **quarter**: black, gray, white, cream, light-gray, golden, olive, dark-green, royal-blue, navy, pink, burgundy, red, orange, purple, teal, brown, coral, cocoa
- **logo**: black, gray, white, cream, orange, olive, dark-green, royal-blue, navy, pink, red
- **outsole**: black, gray, white, cream, royal-blue, pink, red, brown
- **toe**: black, gray, white, cream, orange, olive, dark-green, royal-blue, navy, pink, red
- **tongue**: black, white, gray, brown, navy
- **vamp**: black, gray, white, cream, orange, olive, dark-green, royal-blue, navy, pink, red

**IMPORTANT: You MUST ONLY USE the colors listed above for each part. Do not use any other colors.**

**IMPORTANT: If a user requests a color not available for a specific part, choose the closest matching color from that part's available colors.**
`.trim();

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
    model: "gpt-oss-120b",
    maxTokens: 2048,
    temperature: 0.3,
  });

  const variableParser = {
    outputDescription: () => outputDescription,
    formatInstructions: () => formatInstructions,
    message: (input: { message: string }) => input.message,
  };

  const promptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `
You are a helpful assistant that generates shoe color combinations.

Analyze the user's request and determine if they want:
1. A complete shoe customization (e.g., "I want autumn-themed shoes", "Make a cool design")
   → Return ALL shoe parts with colors
2. A partial modification (e.g., "Change only the laces to yellow", "Make the tongue red")
   → Return ONLY the parts mentioned by the user

## Available Parts & Colors
{{outputDescription}}

## Format Instructions
{{formatInstructions}}
`.trim(),
      { templateFormat: "mustache" },
    ),
    HumanMessagePromptTemplate.fromTemplate("{{message}}", {
      templateFormat: "mustache",
    }),
  ]);

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
