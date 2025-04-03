import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { OPENAI_API_KEY } from '@/constants/Config';

// Function to encode an image to Base64
const encodeImage = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error encoding image:", error);
    return "";
  }
};

export interface OpenAIAnalysisResponse {
  answer: string;
  isComplete: boolean;
  suggestedAction?: string;
}

export const sendImagesToOpenAIWithBase64 = async (
  imageUris: string[],
  analyticalQuestion: string
): Promise<OpenAIAnalysisResponse | null> => {
  console.log(`Sending ${imageUris.length} images to OpenAI for analysis with question: "${analyticalQuestion}"`);

  if (!imageUris || imageUris.length === 0) {
    console.error("No images provided.");
    return null;
  }

  try {
    // Encode all images to Base64
    const encodedImages = await Promise.all(imageUris.map(uri => encodeImage(uri)));

    // Filter out any failed encodings
    const validImages = encodedImages
      .filter(base64 => base64 !== "")
      .map(base64 => ({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } }));

    if (validImages.length === 0) {
      console.error("All image encodings failed.");
      return null;
    }

    console.log(`Successfully encoded ${validImages.length} images.`);

    const structuredPrompt = `
"You are an expert building inspector assistant. Please analyze the provided images to answer this specific question: '${analyticalQuestion}'
Respond with a JSON object in the following format:
{
  'answer': 'Please answer with: “{Yes/No}, {state + explanation}”. Where “Yes/No” answers our specific questions. The “state” can be either good or bad and the “explanation” provides general information on the state. If you cannot answer a question properly or there is insufficient detail to assess the questions, answer with: “Cannot answer”. Be specific about what you see in the images.',
  'Reasoning': Apply reasoning technology, and briefly, concisely, and more in-depth, describe and reason on the factors that lead you to your answer.',
  'isComplete': true/false (whether the images provide enough information to fully answer the question),
  'suggestedAction': 'If isComplete is false, provide a brief and specific suggestion (maximum 13 words) for what additional photos are needed',
  'FutureActions': 'If the state is 'bad', briefly and concisely provide a suggestion on how to turn its state to Good.'
}

For the 'answer' field, focus specifically on answering the analytical question. Be thorough but concise.
For the 'isComplete' field, set to true only if you can confidently answer the question based on the provided images.
For the 'suggestedAction' field, provide clear guidance on what specific additional photos would help if the current ones are insufficient. Adhere strictly to the maximum 13-word limit.
For the 'FutureActions' field, If the state is 'bad', briefly and concisely provide a suggestion on how to turn its state to Good.

Ensure your response is ONLY the JSON object with no additional text before or after."
`;

    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: structuredPrompt },
            ...validImages
          ]
        }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    };

    // Send request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 80000,
      }
    );

    const responseContent = response.data.choices[0].message.content;
    console.log("OpenAI Response:", responseContent);

    try {
      // Parse the JSON response
      const parsedResponse: OpenAIAnalysisResponse = JSON.parse(responseContent);
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing OpenAI response as JSON:", parseError);
      // Fallback response if parsing fails
      return {
        answer: responseContent,
        isComplete: false,
        suggestedAction: "Please take clearer photos as the analysis couldn't be properly processed."
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error sending images to OpenAI:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Unknown Error:", error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    return null;
  }
};
