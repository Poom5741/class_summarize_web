// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";

import UploadAudio from "./components/UploadAudio";
import TranscriptList from "./components/TranscriptList";
import SummarizeTranscript from "./components/SummarizeTranscript";
import SummaryList from "./components/SummaryList";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/upload">Upload Audio</Link>
            </li>
            <li>
              <Link to="/transcripts">Transcripts</Link>
            </li>
            <li>
              <Link to="/summarize">Summarize</Link>
            </li>
            <li>
              <Link to="/summaries">Summaries</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<h1>Welcome to Audio Transcription App</h1>}
          />
          <Route path="/upload" element={<UploadAudio />} />
          <Route path="/transcripts" element={<TranscriptList />} />
          <Route path="/summarize" element={<SummarizeTranscript />} />
          <Route path="/summaries" element={<SummaryList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
