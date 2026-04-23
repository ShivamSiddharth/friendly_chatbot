import axios from "axios";

export const getAIResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("GEMINI ERROR:", error.response?.data || error.message);
    throw error;
  }
};