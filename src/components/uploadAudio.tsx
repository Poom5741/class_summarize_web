// src/components/UploadAudio.tsx
import React, { useState } from "react";
import axios from "axios";

const UploadAudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!file) return alert("Please select a file first.");

      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("audio", file);

      const response = await axios.post(
        "http://37.27.35.61:3000/transcript",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(response.data.message);
    } catch (error) {
      setError("Error uploading and transcribing audio");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload an Audio File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {loading && <p>Loading... Please wait.</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default UploadAudio;
