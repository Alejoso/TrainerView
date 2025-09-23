import openai from "./openAI";

export async function generateEmbeddings(textToEmbbed: string): Promise<number[]> {
  if (!textToEmbbed || textToEmbbed.trim() === "") {
    throw new Error("Error, faltan campos necesarios");
  }

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: textToEmbbed,
  });

  return response.data[0].embedding;
}
