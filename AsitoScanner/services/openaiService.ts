import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const OPENAI_API_KEY = 'your_openai_api_key'; // Replace with your actual OpenAI API key

const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    // Ensure file exists before processing
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      console.error("Image file not found:", imageUri);
      return "";
    }

    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return `data:image/jpeg;base64,${base64Image}`; // Ensure correct format
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return "";
  }
};



export const sendImageToOpenAI = async (imageUri: string) => {
  try {
    // Convert the image to Base64
    const base64Image = await convertImageToBase64(imageUri);

    if (!base64Image) {
      console.error("Failed to convert image to Base64.");
      return null;
    }

    // Send request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations', // Modify if using GPT-4 Vision
      {
        model: "dall-e-2", // Change if using GPT-4 Vision
        prompt: "Analyze this image",
        image: base64Image,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("OpenAI Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending image to OpenAI:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return null;
  }
};

