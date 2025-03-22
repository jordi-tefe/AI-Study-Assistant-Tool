import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import styles from "../../styles/QuizGenerator.module.css";

const ShortNote: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);
    setDownloadUrl(null); // Reset previous download URL

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/summarize", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
          },
        responseType: "blob", // Expect a file (PDF)
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url); // Store URL for popup download
    } catch (error) {
      console.error("❌ Error Generating Summary:", error);
      alert("Failed to generate short note.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        accept=".pdf, .txt, .docx , .pptx"
        onChange={handleFileChange}
        className={styles.inputFile}
      />
      <button onClick={handleUpload} disabled={loading} className={styles.uploadButton}>
        {loading ? "Processing..." : "Upload & Generate Short Note"}
      </button>

      {/* Popup for download */}
      {downloadUrl && (
        <div className={styles.popup}>
          <p>✅ Short note is ready!</p>
          <a href={downloadUrl} download="short-note.pdf" className={styles.downloadButton}>
            Download Short Note
          </a>
        </div>
      )}
    </div>
  );
};

export default ShortNote;
