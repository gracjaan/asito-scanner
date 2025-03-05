import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const OPENAI_API_KEY = ''; // Replace with your API key

// Function to encode the image to a Base64 string using Expo FileSystem
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

export const sendImageToOpenAI = async (imageUri: string) => {
  const base64Image = await encodeImage(imageUri);
  if (!base64Image) {
    console.error("Failed to encode image to Base64");
    return null;
  }
  // Create a data URL from the base64 string
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What is in this image?" },
              { type: "image_url", image_url: { url: dataUrl } }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(response.data.choices[0]);
    return response.data;
  } catch (error: any) {
    console.error("Error sending image to OpenAI:", error.response?.data || error.message);
    return null;
  }
};
