// src/components/SummarizeTranscript.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Transcript {
  transcript: string;
}

const SummarizeTranscript: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedTranscriptIndex, setSelectedTranscriptIndex] = useState<
    number | null
  >(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get<Transcript[]>(
        "http://37.27.35.61:3000/api/transcripts"
      );
      setTranscripts(response.data);
    } catch (err) {
      setError("Error fetching transcripts");
    }
  };

  const handleTranscriptSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTranscriptIndex(Number(event.target.value));
  };

  const handleSummarize = async () => {
    if (selectedTranscriptIndex === null) {
      setError("Please select a transcript");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await axios.post(
        "http://37.27.35.61:3000/api/summaries",
        {
          transcript: transcripts[selectedTranscriptIndex].transcript,
        }
      );

      // Since the summarization might be asynchronous, we'll check the response
      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
        setLoading(false);
      } else {
        // If summary is not immediately available, you might need to implement polling
        setError("Summary not immediately available. Please try again later.");
        setLoading(false);
      }
    } catch (err) {
      setError("Error during summarization process");
      setLoading(false);
    }
  };

  return (
    <div className="summarize-transcript">
      <h2>Summarize Transcript</h2>
      <select
        value={selectedTranscriptIndex !== null ? selectedTranscriptIndex : ""}
        onChange={handleTranscriptSelect}
      >
        <option value="">Select a transcript</option>
        {transcripts.map((transcript, index) => (
          <option key={index} value={index}>
            Transcript {index + 1}
          </option>
        ))}
      </select>
      <button
        onClick={handleSummarize}
        disabled={loading || selectedTranscriptIndex === null}
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
