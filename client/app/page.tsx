'use client';

import React, { useEffect,useState, useRef, ChangeEvent } from "react";
import UploadQuiz from "./components/UploadQuiz";
import ShortNote from "./components/Shortnote";
import WelcomePage from "./components/WelcomePage";
import ChatBot from "./components/chatbot";
import Quiz from "./components/Quiz";
import "../styles/globals.css";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const shortNoteRef = useRef<HTMLDivElement>(null);
  const [activeComponent, setActiveComponent] = useState<"shortnote" | "quiz" | "chatbot">("shortnote");

  const handleQuizGenerated = (quizData: any) => {
    setQuiz(quizData);
    localStorage.setItem("quiz", JSON.stringify(quizData));
    // router.push("/quiz");
  };

  const handleGetStarted = () => {
    if (shortNoteRef.current) {
      shortNoteRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // if (event.target.files && event.target.files[0]) {
    //   setFile(event.target.files[0]);
    // }

    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
  
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
      const response=  await axios.post("https://ai-study-assistant-tool-production.up.railway.app/Extract", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        const data = await response.data;
        setText(data.text); // 👈 save extracted text
      } catch (error) {
        console.error("Error extracting text:", error);
        alert("Error extracting text:"+ error);
      }
    }
  };
  // Inside your Home component
// useEffect(() => {
//   if (text) {
//     console.log("✅ Extracted text is ready:", text.slice(0, 200)); // Preview first 200 chars
//   }
// }, [text]);

  return (
    <main className="main-container">
      <WelcomePage onGetStartedClick={handleGetStarted} />

      <div className="upload-bar">
  <label className="customFileUpload">
    <input
      type="file"
      accept=".pdf, .txt, .docx, .pptx"
      onChange={handleFileChange}
    />
    {file ? `📄 ${file.name}` : "📤 Click to Upload File"}
  </label>
</div>


      <div ref={shortNoteRef} className="content-section">
        <div className="toggle-buttons">
          <button
            className={activeComponent === "shortnote" ? "active" : ""}
            onClick={() => setActiveComponent("shortnote")}
          >
            Short Notes Generator
          </button>
          <button
            className={activeComponent === "quiz" ? "active" : ""}
            onClick={() => setActiveComponent("quiz")}
          >
            Quiz Generator
          </button>
          <button
            className={activeComponent === "chatbot" ? "active" : ""}
            onClick={() => setActiveComponent("chatbot")}
          >
            ChatBot
          </button>
        </div>

        {activeComponent === "shortnote" && (
          <>
            <h1>AI Short Note Generator</h1>
            <ShortNote text={text} />
          </>
        )}

        {activeComponent === "quiz" && (
          <>
            <h1>AI Quiz Generator</h1>
            <UploadQuiz text={text} setQuiz={handleQuizGenerated} />
            {/* {text : Here is the quiz} */}
            {quiz && <Quiz quiz={quiz} />} {/* This renders the quiz after generation */}
          </>
        )}

        {activeComponent === "chatbot" && (
          <>
            <h1>AI ChatBot</h1>
            <ChatBot text={text} />
          </>
        )}
      </div>
    </main>
  );
}


// 'use client';

// import React ,{useState ,useRef} from "react"; // Import useState to manage state for answers and score
// import UploadQuiz from "./components/UploadQuiz"; // Import UploadQuiz component to handle file upload
// import ShortNote from "./components/Shortnote";
// import WelcomePage from "./components/WelcomePage";
// import ChatBot from "./components/chatbot";
// import Quiz from "./components/Quiz"; // Import Quiz component to display the quiz
// import "../styles/globals.css"
// import { useRouter } from "next/navigation"; // Import Next.js router
// export default function Home() {
//     const router = useRouter(); // Initialize router
//   const [quiz, setQuiz] = useState<any>(null); // State to store quiz data

//   const shortNoteRef = useRef<HTMLDivElement>(null); // Create ref for ShortNote section
//  // State to manage which component is active
//  const [activeComponent, setActiveComponent] = useState<"shortnote" | "quiz" | "chatbot">("shortnote");

//   const handleQuizGenerated = (quizData: any) => {
//     setQuiz(quizData);
//     localStorage.setItem("quiz", JSON.stringify(quizData)); // Store quiz in localStorage
//     router.push("/quiz"); // Navigate to quiz page
//   };

//    // Function to smoothly scroll to ShortNote
//    const handleGetStarted = () => {
//     if (shortNoteRef.current) {
//         shortNoteRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
// };


//   return (
//     <main className="main-container">
        
//         <WelcomePage onGetStartedClick={handleGetStarted} /> {/* Pass function to WelcomePage */}

// <>{/* Section with the option to switch between ShortNote, Quiz, and ChatBot */}
//       <div ref={shortNoteRef} className="content-section">
//         <div className="toggle-buttons">
//           <button
//             className={activeComponent === "shortnote" ? "active" : ""}
//             onClick={() => setActiveComponent("shortnote")}
//           >

//             Short Note Generator
//           </button>
//           <button
//             className={activeComponent === "quiz" ? "active" : ""}
//             onClick={() => setActiveComponent("quiz")}
//           >

//             Quiz Generator
//           </button>
//           <button
//             className={activeComponent === "chatbot" ? "active" : ""}
//             onClick={() => setActiveComponent("chatbot")}
//           >
//             ChatBot
//           </button>
//         </div>

//         {activeComponent === "shortnote" && (
//           <>
//             <h1>AI Short Note Generator</h1>
//             <ShortNote />
//           </>
//         )}

//         {activeComponent === "quiz" && (
//           <>
//             <h1>AI Quiz Generator</h1>
//             <UploadQuiz setQuiz={handleQuizGenerated} />
//           </>
//         )}

//         {activeComponent === "chatbot" && (
//           <>
//             <h1>AI ChatBot</h1>
//             <ChatBot />
//           </>
//         )}
//       </div>
//             </>
    
//     </main>
//   );
// }
