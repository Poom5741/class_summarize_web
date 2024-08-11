// src/components/SummaryList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Summary {
  filename: string;
  content: {
    summary: string;
  };
}

const SummaryList: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get("http://37.27.35.61:3000/summaries");
      setSummaries(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching summaries");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="summary-list">
      <h2>Summaries</h2>
      <div className="card-container">
        {summaries.map((summary) => (
          <div key={summary.filename} className="card">
            <h3>{summary.filename}</h3>
            <p>{summary.content.summary.substring(0, 150)}...</p>
            <button
              onClick={() => {
                /* Implement view full summary */
              }}
            >
              View Full Summary
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryList;
