import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;
const model = google("gemini-2.5-flash");

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const result = streamText({
      model,
      prompt,
      maxOutputTokens: 256,
      onError: (error) => {
        console.error("Error generating suggestions:", error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in /api/suggest-messages:", error);
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error in /api/suggest-messages:", error);
      return Response.json(
        {
          success: false,
          error: "An unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
