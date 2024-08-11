// src/components/TranscriptList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Transcript {
  filename: string;
  content: {
    transcript: string;
  };
}

const TranscriptList: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get("http://37.27.35.61:3000/transcripts");
      setTranscripts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching transcripts");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="transcript-list">
      <h2>Transcripts</h2>
      <div className="card-container">
        {transcripts.map((transcript) => (
          <div key={transcript.filename} className="card">
            <h3>{transcript.filename}</h3>
            <p>{transcript.content.transcript.substring(0, 100)}...</p>
            <button
              onClick={() => {
                /* Implement view full transcript */
              }}
            >
              View Full Transcript
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptList;
