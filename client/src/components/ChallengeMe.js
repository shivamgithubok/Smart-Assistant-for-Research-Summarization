import React, { useState, useEffect } from 'react';
import axios from '../axios';

function ChallengeMe({ addToHistory }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/challenge');
        setQuestions(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load questions.');
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (index) => {
    const question = questions[index];
    const userAnswer = answers[index] || '';
    if (!userAnswer.trim()) {
      setError('Please enter an answer.');
      return;
    }

    try {
      const res = await axios.post('/evaluate', { question, user_answer: userAnswer });
      setEvaluations((prev) => ({ ...prev, [index]: res.data }));
      addToHistory({
        type: 'challenge',
        question,
        answer: userAnswer,
        evaluation: res.data.answer,
        justification: res.data.justification,
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to evaluate answer.');
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h2 className="card-title" style={{ marginBottom: 12 }}>Challenge Me</h2>
      {error && <div className="text-error text-sm mb-4">{error}</div>}
      {questions.length === 0 && !error && <p>Loading questions...</p>}
      {questions.map((question, index) => (
        <div key={index} className="challenge-item">
          <div className="question-text">{index + 1}. {question}</div>
          <textarea
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Your answer..."
            className="form-control mt-2"
            rows="2"
            disabled={evaluations[index]}
            style={{ marginBottom: 8 }}
          />
          <button
            onClick={() => handleSubmit(index)}
            disabled={evaluations[index] || !answers[index]?.trim()}
            className="btn btn-success mt-2"
            style={{ minWidth: 90 }}
          >
            Submit
          </button>
          {evaluations[index] && (
            <div className="evaluation-badge mt-2">
              <div><strong>Evaluation:</strong> {evaluations[index].answer}</div>
              <div><strong>Justification:</strong> <span className="bg-yellow-light">{evaluations[index].justification}</span></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChallengeMe;