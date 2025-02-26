import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChatHistory from './components/ChatHistory';

function App() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingEffect, setTypingEffect] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError('Please ask a valid question.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // const result = await axios.post('http://localhost:5000/chat', { question });
      const result = await axios.post('https://cdp-chatbot-u8i7.onrender.com/chat', { question });
      const newEntry = { question, answer: result.data.answer };
      setChatHistory(prevHistory => [...prevHistory, newEntry]);
      setTypingEffect('');
      setQuestion('');
    } catch (error) {
      setError('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastAnswer = chatHistory[chatHistory.length - 1].answer;
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < lastAnswer.length) {
          setTypingEffect((prev) => prev + lastAnswer.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [chatHistory]);

  return (
    <>
      {showHistory && <ChatHistory history={chatHistory} onClose={() => setShowHistory(false)} />}
      <h1>CDP Chatbot</h1>
        <button className="history-button" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
        <div className="chat-container">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <div className="question-glass">
                <h3>Question:</h3>
                <p>{entry.question}</p>
              </div>
              <div className="answer-glass">
                <h3>Answer:</h3>
                <p>{index === chatHistory.length - 1 ? typingEffect : entry.answer}</p>
              </div>
            </div>
          ))}
        </div>
      <div className="App">
        
        <div className="input-container">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about Segment, mParticle, or Lytics..."
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          />
          <button onClick={handleAskQuestion} disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </>
  );
}

export default App;
