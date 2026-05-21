import OpenAI from "openai";

const openaiObject = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chatCompletion(
  country: string,
  vegan: boolean,
  additionalNote: string
) {
  const veganNote = vegan ? ", taking into account that the user is vegan" : "";

  const additionalNoteText =
    additionalNote && additionalNote.trim() ? `. ${additionalNote}` : "";

  const stream = await openaiObject.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `make me a dish from ${country}${veganNote}${additionalNoteText}
Include:
- dish name
- ingredients
- cooking instructions
- estimated nutrition information with these exact labels: Calories, Protein, Carbs, Fat, Fibre
- a shopping list section

Use these section headings: Dish Name, Ingredients, Instructions, Nutrition, Shopping List.`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 2000,
    stream: true,
  });

  return stream;
}

export async function imageGeneration(recipe: string) {
  const image = await openaiObject.images.generate({
    model: "dall-e-3",
    prompt: recipe,
    n: 1,
    size: "1024x1024",
  });

  const result = image?.data && image.data[0]?.url;

  console.log(result);

  return result;
}

export async function audioGeneration(recipe: string) {
  const audio = await openaiObject.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: recipe,
  });

  // Convert the audio response to a buffer
  const buffer = Buffer.from(await audio.arrayBuffer());

  // Convert buffer to base64
  const base64Audio = buffer.toString("base64");

  // Return as a data URL that can be used by audio players
  return `data:audio/mp3;base64,${base64Audio}`;
}

export async function imageToText(picture: string) {
  const response = await openaiObject.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe what you see" },
          {
            type: "image_url",
            image_url: {
              url: picture,
            },
          },
        ],
      },
    ],
    stream: true,
  });

  return response;
}
