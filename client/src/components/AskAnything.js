import React, { useState } from 'react';

function AskAnything({ onAskAnything, challengeActive, pendingChallenge }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAskAnything(input, setError, setInput);
  };

  let placeholder = 'Type your question and press Enter...';
  let buttonText = 'Submit';
  if (challengeActive && pendingChallenge) {
    placeholder = 'Type your answer to the challenge and press Enter...';
    buttonText = 'Submit Answer';
  }

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        autoFocus
      />
      <button type="submit" className="btn btn-primary" style={{ minWidth: 100 }}>
        {buttonText}
      </button>
      {error && <div className="text-error text-sm" style={{ marginTop: 4 }}>{error}</div>}
    </form>
  );
}

export default AskAnything;