import React ,{useState,ChangeEvent} from "react"; // Import React hooks (useState, ChangeEvent) to manage state and handle events.
import axios from "axios"; // Import Axios for making HTTP requests
import styles from "../../styles/QuizGenerator.module.css"; // Import CSS for styling
import { useRouter } from "next/navigation"; // Import Next.js router
interface UploadQuizProps { 
  setQuiz: (quiz: any) => void; // Define a prop that expects a function to set the quiz data in the parent component
}

const UploadQuiz: React.FC<UploadQuizProps> = ({ setQuiz }) => {
  const [file, setFile] = useState<File | null>(null); // Initialize file state to store the uploaded file (default is null)
  const [loading, setLoading] = useState(false); // Initialize loading state to manage upload process
  const router = useRouter(); // Initialize router
  // Handle file input changes
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]); // Set the selected file to the state
    }
  };

  const pagetry = async ()=>{
    console.log("Navigating to quiz...");
    router.push("/quiz");
  }
  // Handle file upload and quiz generation
  const handleUpload = async () => {
    if (!file) return alert("Please select a file"); // If no file is selected, show an alert

    setLoading(true); // Show loading state (spinner or button disable)

    const formData = new FormData(); 
    formData.append("file", file); // Add the selected file to the FormData object

    try {
      // Send POST request to the backend (ensure you have a backend endpoint for file handling)
      const response = await axios.post("http://localhost:5000/upload", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setQuiz(response.data.quiz); // Pass the generated quiz data to the parent component
      localStorage.setItem("quiz", JSON.stringify(response.data.quiz)); // Store in localStorage
      console.log("Navigating to /quiz...");
      router.push("/quiz"); // Redirect to quiz page
     
    } catch (error) {
        console.error("❌ Error Generating Quiz:", error);
        alert("Failed to generate quiz: " + (error));
    }

    setLoading(false); // Hide loading state after processing
  };

  return (
    <div className={styles.uploadContainer}>
      <input 
        type="file" 
        accept=".pdf, .txt, .docx, .pptx" // ✅ Add file types here
        onChange={handleFileChange} 
        className={styles.inputFile} placeholder="Drop Your File"
      /> {/* File input field that allows the user to select a PDF */}
      <button 
        onClick={handleUpload} 
        disabled={loading} 
        className={styles.uploadButton} >
        {loading ? "Processing..." : "Upload & Generate Quiz" }
      </button> 
      <button onClick={pagetry}>Quiz Page</button>
      {/* Button to trigger the file upload process, disabled while loading */}
    </div>
  );
};

export default UploadQuiz; // Export the UploadQuiz component for use in other parts of the app
