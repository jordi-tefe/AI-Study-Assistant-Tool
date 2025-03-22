import mongoose from "mongoose"; // Import mongoose for MongoDB schema definition

// Define the schema for a quiz
const QuizSchema = new mongoose.Schema({
  quiz: [
    {
      question: String, // The question text
      options: [String], // The options for answers
      correctAnswer: String, // The correct answer
      explanation: String, // Explanation of the correct answer
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the quiz was created
});

// Export the Quiz model to interact with the quizzes collection in MongoDB
export default mongoose.model("Quiz", QuizSchema);
