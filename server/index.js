import express from "express"; // Import express for creating the server
import cors from "cors"; // Import CORS to allow cross-origin requests
import mongoose from "mongoose"; // Import mongoose for MongoDB integration
import dotenv from "dotenv"; // Import dotenv to manage environment variables
import fileUpload from "express-fileupload"; // Import express-fileupload to handle file uploads
// import pdfParse from "pdf-parse"; // Import pdf-parse to read content from PDF files
import pdfParse from "pdf-parse/lib/pdf-parse.js";

import axios from "axios"; // Import axios to make HTTP requests to external APIs
import Quiz from "./models/Quiz.js"; // Import the Quiz model for saving quiz data in the database

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an instance of the express app

// Middleware to handle CORS and JSON requests
app.use(cors()); 
app.use(express.json());
app.use(fileUpload()); // Middleware for handling file uploads

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected")) // If connection is successful
  .catch((err) => console.log("❌ MongoDB Error:", err)); // Log errors if any
  app.post("/upload", async (req, res) => {
    try {
      if (!req.files || !req.files.pdf) {
        return res.status(400).json({ error: "❌ No PDF file uploaded" });
      }
  
      const pdfBuffer = req.files.pdf.data;
      if (!pdfBuffer) {
        return res.status(400).json({ error: "❌ Uploaded file is empty" });
      }
  
      // Extract text from PDF
      const text = await pdfParse(pdfBuffer).then((data) => data.text);
  
      if (!text.trim()) {
        return res.status(400).json({ error: "❌ PDF contains no readable text" });
      }
  
      // ⚠️ Limit text length to avoid exceeding OpenAI's token limit
      const maxTextLength = 3000; // Adjust based on your needs
      const trimmedText = text.length > maxTextLength ? text.substring(0, maxTextLength) + "..." : text;
  
      // AI Prompt
      const prompt = `
Generate exactly 30 quiz questions in strict JSON format. 
Each question must follow this structure:

[
  {
    "question": "What is React?",
    "options": ["Library", "Framework", "Language", "Database"],
    "correctAnswer": "Library",
    "explanation": "React is a JavaScript library."
  }
]
  

DO NOT include any additional text or explanations—return only valid JSON.
Text: "${text}"
`;

  
      console.log("📩 Sending request to OpenAI:", prompt); // ✅ Debugging log

    //   fetch("https://api.openai.com/v1/models", {
    //     method:"GET",
    //     headers : {
    //         "Authorization": "Bear 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 "
    //     }
    //   }).then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.log(err));
  
      // AI API request
    //   const response = await axios.post(
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              model: "deepseek/deepseek-r1:free", // ✅ DeepSeek model via OpenRouter
              messages: [{ role: "user", content: prompt }], 
              
              temperature: 0.7,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, // ✅ Use OpenRouter API key
                "HTTP-Referer": "<YOUR_SITE_URL>", // Optional (replace with your site URL)
                "X-Title": "<YOUR_SITE_NAME>", // Optional (replace with your site name)
                "Content-Type": "application/json",
              },
            }
          );
          

      console.log("✅ OpenAI Response:", response.data); // ✅ Debugging log
  
      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error("Invalid AI response format");
      }
  
      // Parse AI response
    //   const quizData = JSON.parse(response.data.choices[0].message.content);
    try {
        let rawResponse = response.data.choices[0].message.content;
        
        console.log("🔍 AI Raw Response:", rawResponse); // Debugging
    
        // Clean response by removing Markdown formatting if present
        let cleanedResponse = rawResponse.replace(/```json|```/g, "").trim();
    
        // Validate JSON before parsing
        const quizData = JSON.parse(cleanedResponse);
         // Save to MongoDB
      const newQuiz = new Quiz({ quiz: quizData });
      await newQuiz.save();
  
      res.status(200).json({ quiz: quizData });
    
        // res.json({ quiz: quizData });

    } catch (error) {
        console.error("❌ AI API Error: Invalid JSON response", error);
        // alert("Failed to generate quiz: AI response is not valid JSON.");
    }
    
    

  
     
    } catch (error) {
      console.error("❌ AI API Error:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data?.error?.message || "AI API request failed" });
    }
  });
  
// Route to get all quizzes from MongoDB
app.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Fetch all quizzes from the database
    res.json(quizzes); // Send quizzes as a response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" }); // Handle errors if fetching quizzes fails
  }
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Authorization": "Bearer <OPENROUTER_API_KEY>",
//       "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
//       "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       "model": "deepseek/deepseek-r1:free",
//       "messages": [
//         {
//           "role": "user",
//           "content": "What is the meaning of life?"
//         }
//       ]
//     })
//   });