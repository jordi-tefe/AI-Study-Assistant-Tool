import React, { useState } from "react";
import axios from "axios";
import styles from "../../styles/QuizGenerator.module.css";

interface ShortNoteProps {
  file?: File | null;
  text: string ;
}

const ShortNote: React.FC<ShortNoteProps> = ({ file,text }) => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!text) return alert("Please select a file first!");

    setLoading(true);
    setDownloadUrl(null);

    // const formData = new FormData();
    // formData.append("file", file);

    try {
      const response = await axios.post("https://ai-study-assistant-tool.onrender.com/summarize", {text} ,{
        responseType: "blob", // Expecting a PDF
      });

      // Validate the response content type
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/pdf")) {
        console.error("❌ Server returned non-PDF response:", contentType);
        alert("Server error: Not a PDF file returned");
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      setDownloadUrl(url);
    } catch (error: any) {
      console.error("❌ Error generating summary:", error);
      if (error.response?.data) {
        alert(`Backend error: ${error.response.data.error || 'Unknown error'}`);
      } else {
        alert("Failed to generate short note.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setDownloadUrl(null); // Hide popup after download
  };

  return (
    <div className={styles.uploadContainer}>
      {/* <button
        onClick={handleUpload}
        disabled={loading || !text}
        className={styles.uploadButton}
      > */}
        {loading ?  (
  <div className={styles["loader"]}>
    
  </div>
)
 : (<button
  onClick={handleUpload}
  disabled={loading || !text}
  className={styles.uploadButton}
  >
  Generate Short Note
  </button>
) }
     

      {downloadUrl && (
        <div className={styles.popup}>
          <p>✅ Short note is ready!</p>
          <a
            href={downloadUrl}
            download="short-note.pdf"
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            Download Short Note
          </a>
        </div>
      )}
    </div>
  );
};

export default ShortNote;


// import React, { useState, ChangeEvent } from "react";
// import axios from "axios";
// import styles from "../../styles/QuizGenerator.module.css";

// const ShortNote: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a file");

//     setLoading(true);
//     setDownloadUrl(null); // Reset previous download URL

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post("http://localhost:5000/summarize", formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         responseType: "blob", // Expect a file (PDF)
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       setDownloadUrl(url); // Store URL for popup download
//     } catch (error) {
//       console.error("❌ Error Generating Summary:", error);
//       alert("Failed to generate short note.");
//     }

//     setLoading(false);
//   };
//   const handleDownload = () => {
//     // Close the popup after the user clicks the download link
//     setDownloadUrl(null);
//   };

//   return (
//     <div className={styles.uploadContainer}>
//       <input
//         type="file"
//         accept=".pdf, .txt, .docx , .pptx"
//         onChange={handleFileChange}
//         className={styles.inputFile}
//       />
//       <button onClick={handleUpload} disabled={loading} className={styles.uploadButton}>
//         {loading ? "Processing..." : "Upload & Generate Short Note"}
//       </button>

//       {/* Popup for download */}
//       {downloadUrl && (
//         <div className={styles.popup}>
//           <p>✅ Short note is ready!</p>
//           <a href={downloadUrl} download="short-note.pdf" className={styles.downloadButton} onClick={handleDownload} >
//             Download Short Note
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShortNote;
