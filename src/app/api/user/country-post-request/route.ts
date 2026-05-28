import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userChoicesSchema } from "@/lib/validations/user-choices";
import { sql } from "@/lib/db";
import { headers } from "next/headers";
import { chatCompletion } from "@/lib/chat-completions/openai";
import { isProduction } from "@/lib/server/env";

type UpdatedPinnedCountriesRow = {
  selectedCountries: string[];
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const body = await request.json();

    const userChoicesValidation = userChoicesSchema.safeParse(body);

    if (!userChoicesValidation.success) {
      console.error("Validation failed:", userChoicesValidation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: userChoicesValidation.error.issues,
        },
        { status: 400 }
      );
    }
    const { country, vegan, other } = userChoicesValidation.data;

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: User lacks credential" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const updatedPinnedCountries = await sql<UpdatedPinnedCountriesRow>(
      `
          UPDATE "user"
          SET
            "selectedCountries" = CASE
              WHEN $1 = ANY("selectedCountries") THEN "selectedCountries"
              ELSE array_append("selectedCountries", $1)
            END,
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE "id" = $2
          RETURNING "selectedCountries"
          `,
      [country, userId]
    );


    if (updatedPinnedCountries.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const encoder = new TextEncoder();

    // Mock recipe for development to save tokens
    const mockRecipe = `(Russia 2)
Dish Name:
Vegan Borscht

Ingredients:
- 2 tbsp olive oil
- 1 onion, chopped
- 3 cloves of garlic, minced
- 3 medium beets, peeled and diced
- 3 medium carrots, peeled and diced
- 3 medium potatoes, peeled and diced
- 4 cups vegetable broth
- 1 can of diced tomatoes
- 1 tbsp apple cider vinegar
- 1 tsp dried dill
- Salt and pepper to taste
- Vegan sour cream and chopped fresh dill for garnish (optional)

Instructions:
1. In a large pot, heat the olive oil over medium heat. Add the onion and garlic and saute until softened.
2. Add the beets, carrots, and potatoes to the pot and saute for 5-7 minutes.
3. Pour in the vegetable broth and diced tomatoes. Bring the mixture to a boil, then reduce heat and let simmer for 20-25 minutes or until the vegetables are tender.
4. Stir in the apple cider vinegar and dried dill. Season with salt and pepper to taste.
5. Serve the borscht hot, garnished with vegan sour cream and chopped fresh dill if desired.

Nutrition:
- Calories: 310 kcal
- Protein: 8 g
- Carbs: 48 g
- Fat: 11 g
- Fibre: 10 g

Shopping List:
- 2 tbsp olive oil
- 1 onion, chopped
- 3 cloves of garlic, minced
- 3 medium beets, peeled and diced
- 3 medium carrots, peeled and diced
- 3 medium potatoes, peeled and diced
- 4 cups vegetable broth
- 1 can of diced tomatoes
- 1 tbsp apple cider vinegar
- 1 tsp dried dill
- Salt and pepper to taste
- Vegan sour cream and chopped fresh dill for garnish (optional)

`;

    let readableStream: ReadableStream;

    if (!isProduction) {
      // Development: Use mock recipe
      readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Simulate streaming by sending the text in chunks
            const words = mockRecipe.split(" ");
            for (let i = 0; i < words.length; i++) {
              const chunk = i === words.length - 1 ? words[i] : words[i] + " ";
              controller.enqueue(encoder.encode(chunk));
              // Add a small delay to simulate streaming
              await new Promise((resolve) => setTimeout(resolve, 20));
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    } else {
      // Production: Use actual OpenAI API
      const stream = await chatCompletion(country, vegan, other);

      readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const finishReason = chunk.choices[0].finish_reason;

              if (finishReason === "stop") {
                controller.close();
                break;
              }

              const message = chunk.choices[0]?.delta?.content || "";

              if (message) {
                // Send each chunk to the client
                controller.enqueue(encoder.encode(message));
              }
            }
          } catch (error) {
            controller.error(error);
          }
        },
      });
    }

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
