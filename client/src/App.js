import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import './index.css';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import AskAnything from './components/AskAnything';
import HistoryDisplay from './components/HistoryDisplay';
import axios from './axios';

function App() {
  const [document, setDocument] = useState(null);
  const [summary, setSummary] = useState('');
  const [mode, setMode] = useState('upload');
  const [challengeActive, setChallengeActive] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState([]); // array of questions
  const [history, setHistory] = useState([]);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  const handleUpload = (doc, sum) => {
    setDocument(doc);
    setSummary(sum);
    setMode('summary');
    setHistory([]);
    setPendingChallenges([]);
    setChallengeActive(false);
  };

  const addToHistory = (interaction) => {
    setHistory((prev) => [...prev, interaction]);
  };

  // Handle Challenge Me button
  const handleChallengeClick = async () => {
    if (pendingChallenges.length > 0) {
      // If already pending challenges, close them
      setPendingChallenges([]);
      setChallengeActive(false);
      return;
    }
    setLoadingChallenge(true);
    try {
      const res = await axios.get('/challenge');
      const questions = Array.isArray(res.data) ? res.data : [res.data];
      setPendingChallenges(questions);
      setChallengeActive(true);
      // Add each challenge question to history
      questions.forEach((question) => {
        addToHistory({ type: 'challenge-question', question });
      });
    } catch (err) {
      addToHistory({ type: 'error', message: err.response?.data?.detail || 'Failed to load challenge questions.' });
    } finally {
      setLoadingChallenge(false);
    }
  };

  // Unified handler for AskAnything
  const handleAskAnything = async (input, setError, setInput) => {
    if (pendingChallenges.length > 0) {
      // Answering the first pending challenge question
      const currentQuestion = pendingChallenges[0];
      if (!input.trim()) {
        setError('Please enter an answer.');
        return;
      }
      try {
        const res = await axios.post('/evaluate', { question: currentQuestion, user_answer: input });
        addToHistory({
          type: 'challenge',
          question: currentQuestion,
          answer: input,
          evaluation: res.data.answer,
          justification: res.data.justification,
        });
        setPendingChallenges((prev) => prev.slice(1));
        if (pendingChallenges.length === 1) {
          setChallengeActive(false);
        }
        setInput('');
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to evaluate answer.');
      }
      return;
    }
    // Normal ask flow
    if (!input.trim()) {
      setError('Please enter a question.');
      return;
    }
    try {
      const res = await axios.post('/ask', { question: input });
      addToHistory({
        type: 'ask',
        question: res.data.question,
        answer: res.data.answer,
        justification: res.data.justification,
      });
      setInput('');
      setError('');
    } catch (err) {
      let detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail = detail.map(e => e.msg).join(', ');
      } else if (typeof detail === 'object' && detail !== null) {
        detail = JSON.stringify(detail);
      }
      if (detail && detail.includes("No document uploaded")) {
        detail = "Please upload a document before asking questions.";
      }
      setError(detail || 'Failed to get answer.');
    }
  };

  // Centered upload card like ChatGPT
  if (mode === 'upload') {
    return (
      <div className="centered-upload-bg">
        <div className="centered-upload-card">
          <h1 className="app-title">Smart Research Assistant</h1>
          <FileUpload onUpload={handleUpload} />
        </div>
      </div>
    );
  }

  // Main split interface after upload
  return (
    <SplitPane split="vertical" minSize={300} defaultSize={window.innerWidth * 0.55} className="main-split-pane">
      {/* Left: Chatbot/History/AskAnything/ChallengeMe */}
      <div className="chatbot-pane">
        <div className="chat-history-container">
          <HistoryDisplay history={history} />
        </div>
        <div className="chatbot-bottom-bar-row">
          <AskAnything
            onAskAnything={handleAskAnything}
            challengeActive={challengeActive}
            pendingChallenge={pendingChallenges.length > 0 ? { question: pendingChallenges[0] } : null}
          />
          <button
            className={`btn btn-challenge${challengeActive ? ' active' : ''}`}
            onClick={handleChallengeClick}
            style={{ marginLeft: 8 }}
            disabled={loadingChallenge}
          >
            {challengeActive ? 'Close Challenge' : loadingChallenge ? 'Loading...' : 'Challenge Me'}
          </button>
        </div>
      </div>
      {/* Right: Summary */}
      <div className="summary-pane">
        <SummaryDisplay summary={summary} />
      </div>
    </SplitPane>
  );
}

export default App;