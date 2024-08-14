// src/components/SummaryList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Summary {
  filename: string;
  summary: string;
}

const SummaryList: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get<Summary[]>(
        "http://37.27.35.61:3000/api/summaries"
      );
      setSummaries(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching summaries:", err);
      setError("Error fetching summaries. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading summaries...</div>;
  if (error) return <div>Error: {error}</div>;
  if (summaries.length === 0) return <div>No summaries available</div>;

  return (
    <div className="summary-list">
      <h2>Summaries</h2>
      <div className="card-container">
        {summaries.map((summary) => (
          <div key={summary.filename} className="card">
            <h3>{summary.filename}</h3>
            <p>{summary.summary.substring(0, 150)}...</p>
            <button onClick={() => setSelectedSummary(summary)}>
              View Full Summary
            </button>
          </div>
        ))}
      </div>
      {selectedSummary && (
        <div className="modal">
          <h3>{selectedSummary.filename}</h3>
          <p>{selectedSummary.summary}</p>
          <button onClick={() => setSelectedSummary(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default SummaryList;
