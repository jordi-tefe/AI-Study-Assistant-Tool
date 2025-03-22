import React ,{useState} from "react"; // Import useState to manage state for answers and score

import styles from "../../styles/QuizGenerator.module.css"; // Import the CSS file for styling

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizProps {
  quiz: Question[]; // Define the quiz prop which is an array of questions
}

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({}); // Store the user's answers in an object
  const [score, setScore] = useState<number | null>(null); // Store the user's score

  // Handle quiz submission
  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++; // Compare the user's answer with the correct answer
    });
    setScore(correct); // Set the score after submission
  };

  return (
    <div className={styles.quizContainer}>
      {quiz.map((q, i) => (
        <div key={i} className={styles.question}>
          <p>
            <strong>Question {i + 1}:</strong> {q.question}
          </p>
          {q.options.map((opt, j) => (
            <button key={j} onClick={() => setAnswers({ ...answers, [i]: opt })} className={styles.optionButton}>
              {opt}
            </button>
          ))}
          {answers[i] && (
            <div>
              {answers[i] === q.correctAnswer ? (
                <p className={styles.correct}>Correct!</p> // If the answer is correct, display "Correct!"
              ) : (
                <p className={styles.incorrect}>Incorrect</p> // If the answer is incorrect, display "Incorrect"
              )}
              
              <p className={styles.explanation}><strong>Explanation:</strong> {q.explanation}</p> {/* Show explanation */}
            </div>
          )}
        </div>
      ))}
      <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
      {score !== null && <h2 className={styles.score}>Score: {score} / {quiz.length}</h2>} {/* Show score */}
    </div>
  );
};

export default Quiz; // Export the Quiz component
