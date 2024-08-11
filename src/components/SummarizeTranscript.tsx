// src/components/SummarizeTranscript.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Transcript {
  filename: string;
  content: {
    transcript: string;
  };
}

const SummarizeTranscript: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get("http://37.27.35.61:3000/transcripts");
      setTranscripts(response.data);
    } catch (err) {
      setError("Error fetching transcripts");
    }
  };

  const handleTranscriptSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTranscript(event.target.value);
  };

  const handleSummarize = async () => {
    if (!selectedTranscript) {
      setError("Please select a transcript");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await axios.post("http://37.27.35.61:3000/summarize", {
        filename: selectedTranscript,
      });

      // Since the summarization is asynchronous, we'll need to poll for the result
      const checkSummary = async () => {
        try {
          const summaryResponse = await axios.get(
            `http://37.27.35.61:3000/summary/${selectedTranscript}`
          );
          if (summaryResponse.data.summary) {
            setSummary(summaryResponse.data.summary);
            setLoading(false);
          } else {
            // If summary is not ready, check again after 5 seconds
            setTimeout(checkSummary, 5000);
          }
        } catch (err) {
          setError("Error fetching summary");
          setLoading(false);
        }
      };

      checkSummary();
    } catch (err) {
      setError("Error starting summarization process");
      setLoading(false);
    }
  };

  return (
    <div className="summarize-transcript">
      <h2>Summarize Transcript</h2>
      <select value={selectedTranscript} onChange={handleTranscriptSelect}>
        <option value="">Select a transcript</option>
        {transcripts.map((transcript) => (
          <option key={transcript.filename} value={transcript.filename}>
            {transcript.filename}
          </option>
        ))}
      </select>
      <button
        onClick={handleSummarize}
        disabled={loading || !selectedTranscript}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {summary && (
        <div>
          <h3>Summary:</h3>
          <pre>{summary}</pre>
        </div>
      )}
    </div>
  );
};

export default SummarizeTranscript;
