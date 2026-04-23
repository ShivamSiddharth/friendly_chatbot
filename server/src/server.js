import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import cors from "cors";

app.use(cors({
  origin: "*"
}));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("API KEY:", process.env.GEMINI_API_KEY);
  console.log(`Server running on port ${PORT}`);
});