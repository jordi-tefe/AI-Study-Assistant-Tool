"use client"; // ✅ Required for Client Components

import React, { useEffect, useState } from "react";
import Quiz from "../components/Quiz"; // ✅ Correct import path

export default function QuizPage() {
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quiz"); // ✅ Correct localStorage key
    if (storedQuiz) {
      setQuiz(JSON.parse(storedQuiz));
    }
  }, []);

  return (
    <main className="main-container">
      <h1>Quiz</h1>
      {quiz ? <Quiz quiz={quiz} /> : <p>Loading quiz...</p>}
    </main>
  );
}
