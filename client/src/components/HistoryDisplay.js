import React, { useEffect, useRef } from 'react';

function HistoryDisplay({ history }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  if (history.length === 0) return null;

  return (
    <div className="chat-history-container">
      {history.map((item, index) => {
        if (item.type === 'challenge-question') {
          return (
            <div key={index} className="message-group">
              <div className="history-item question">
                <p><strong>Challenge Question:</strong> {item.question}</p>
              </div>
            </div>
          );
        }
        if (item.type === 'error') {
          return (
            <div key={index} className="message-group">
              <div className="history-item error">
                <p className="text-error"><strong>Error:</strong> {item.message}</p>
              </div>
            </div>
          );
        }
        return (
          <div key={index} className="message-group">
            <div className="history-item question">
              {item.type === 'ask' ? (
                <p><strong>Question:</strong> {item.question}</p>
              ) : (
                <p><strong>Challenge Question:</strong> {item.question}</p>
              )}
            </div>
            <div className="history-item answer">
              {item.type === 'ask' ? (
                <>
                  <p><strong>Answer:</strong> {item.answer}</p>
                  <p className="text-muted"><strong>Justification:</strong> {item.justification}</p>
                </>
              ) : (
                <>
                  <p><strong>Your Answer:</strong> {item.answer}</p>
                  <p><strong>Evaluation:</strong> {item.evaluation}</p>
                  <p className="text-muted"><strong>Justification:</strong> {item.justification}</p>
                </>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default HistoryDisplay;