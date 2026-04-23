import { getAIResponse } from '../services/openai.service.js';

export const handleChat = async (req, res) => {
    try {
      console.log("BODY:", req.body);
  
      const message = req.body?.message;
  
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
  
      const reply = await getAIResponse(message);
  
      res.json({ reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };