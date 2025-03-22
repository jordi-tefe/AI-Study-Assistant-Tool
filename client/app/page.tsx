'use client';

import React ,{useState} from "react"; // Import useState to manage state for answers and score
import UploadQuiz from "./components/UploadQuiz"; // Import UploadQuiz component to handle file upload
import Quiz from "./components/Quiz"; // Import Quiz component to display the quiz
import "../styles/globals.css"
import { useRouter } from "next/navigation"; // Import Next.js router
export default function Home() {
    const router = useRouter(); // Initialize router
  const [quiz, setQuiz] = useState<any>(null); // State to store quiz data
  const handleQuizGenerated = (quizData: any) => {
    setQuiz(quizData);
    localStorage.setItem("quiz", JSON.stringify(quizData)); // Store quiz in localStorage
    router.push("/quiz"); // Navigate to quiz page
  };
  return (
    <main className="main-container">
      <h1>AI Quiz Generator</h1>
      <UploadQuiz setQuiz={handleQuizGenerated} /> {/* Pass setQuiz to UploadQuiz to update the quiz */}
      {/* {quiz && <Quiz quiz={quiz} />} Display quiz if it has been generated */}
    </main>
  );
}
