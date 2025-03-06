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

// Function to send multiple images to OpenAI with the correct request structure
export const sendImagesToOpenAIWithBase64 = async (imageUris: string[]) => {
  console.log(`Sending ${imageUris.length} images to OpenAI for analysis`);

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

    // Construct OpenAI API request payload (matching the required format)
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe the image" },
            ...validImages
          ]
        }
      ],
      max_tokens: 300,
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
          timeout: 30000,
        }
    );

    console.log("OpenAI Response:", response.data.choices[0].message.content);
    return response.data;
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
