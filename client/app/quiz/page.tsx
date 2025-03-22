"use client"; // ✅ Required for Client Components

import React, { useEffect, useState } from "react";
import Quiz from "../components/Quiz"; // ✅ Correct import path
import { useRouter } from "next/navigation"; // Import Next.js router

export default function QuizPage() {
  const [quiz, setQuiz] = useState<any>(null);
  const router =useRouter();

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quiz"); // ✅ Correct localStorage key
    if (storedQuiz) {
      setQuiz(JSON.parse(storedQuiz));
    }
  }, []);

  const Gohome = async () => {
    router.push("/");
  } 
  return (
    <main className="main-container">
      <button onClick={Gohome}>Home</button>
      <h1>Quiz</h1>
      {quiz ? <Quiz quiz={quiz} /> : <p>Loading quiz...</p>}
    </main>
  );
}
