import React, { useState, useEffect } from "react";
import axios from "axios";

interface Transcript {
  transcript: string;
}

const TranscriptList: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTranscript, setSelectedTranscript] =
    useState<Transcript | null>(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Transcript[]>(
        "http://37.27.35.61:3000/api/transcripts"
      );
      setTranscripts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transcripts:", err);
      setError("Error fetching transcripts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading transcripts...</div>;
  if (error)
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchTranscripts}>Retry</button>
      </div>
    );
  if (transcripts.length === 0) return <div>No transcripts available</div>;

  return (
    <div className="transcript-list">
      <h2>Transcripts</h2>
      <div className="card-container">
        {transcripts.map((transcript, index) => (
          <div key={index} className="card">
            <h3>Transcript {index + 1}</h3>
            <p>
              {transcript.transcript.substring(0, 100) ||
                "No transcript available"}
              ...
            </p>
            <button onClick={() => setSelectedTranscript(transcript)}>
              View Full Transcript
            </button>
          </div>
        ))}
      </div>
      {selectedTranscript && (
        <div className="modal">
          <h3>Full Transcript</h3>
          <p>{selectedTranscript.transcript}</p>
          <button onClick={() => setSelectedTranscript(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TranscriptList;
