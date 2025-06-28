import React, { useState } from "react";
import axios from "axios";
import styles from "../../styles/QuizGenerator.module.css";
import Quiz from "./Quiz";
import { useRouter } from "next/navigation";

interface UploadQuizProps {
  setQuiz: (quiz: any) => void;
  file?: File | null;
  text:string;
}

const UploadQuiz: React.FC<UploadQuizProps> = ({ setQuiz, file ,text}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const [quiz, setQuiz] = useState<any>(null);

  const handleUpload = async () => {
    if (!text) return alert("Please select a file");

    setLoading(true);
    // const formData = new FormData();
    // formData.append("file", file);

    try {
    const response = await axios.post("https://ai-study-assistant-tool.onrender.com/upload", {text});

      setQuiz(response.data.quiz);
      localStorage.setItem("quiz", JSON.stringify(response.data.quiz));
      // router.push("/quiz");
    } catch (error) {
      console.error("❌ Error Generating Quiz:", error);
      alert("Failed to generate quizzz: " + error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.uploadContainer}>
      {/* <button onClick={handleUpload} disabled={loading || !text} className={styles.uploadButton}> */}
        {loading ? (
  <div className={styles["loader"]}>
    
  </div>
) :
         ( 
         <button onClick={handleUpload} disabled={loading || !text} className={styles.uploadButton}> 
          Generate Quiz 
          </button>)}
          
       
     
    </div>
  );
};

export default UploadQuiz;

