import { useState } from 'react';
import './App.css';

const API_KEY = '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';
const systemMessage = {
  role: 'system',
  content: 'Evaluate the given math problem and check if the provided answer is correct.',
};


function App() {
  const [userAnswer, setUserAnswer] = useState('');
  const [chatGPTResponse, setChatGPTResponse] = useState(null);
  const [question, setQuestion] = useState(generateQuestion());

  function generateQuestion() {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    const operator = Math.random() > 0.5 ? '+' : '-';
    return `${num1} ${operator} ${num2}`;
  }

  const handleSend = async (answer) => {
    setUserAnswer(answer);
    const newMessages = [
      {
        message: `Question: ${question}`,
        direction: 'outgoing',
        sender: 'user',
      },
      {
        message: `Answer: ${answer}`,
        direction: 'outgoing',
        sender: 'user',
      },
    ];

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.sender === 'ChatGPT') {
        role = 'assistant';
      } else {
        role = 'user';
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...apiMessages],
    };

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setChatGPTResponse(data.choices[0].message.content);
      });
  }

  return (
    <div className="App">
      <div className="form-container">
        <h2>Math Quiz</h2>
        <p>{question}</p>
        {!chatGPTResponse && (
          <div>
            <input
              type="text"
              placeholder="Type your answer here"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSend(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input');
                if (input.value.trim()) {
                  handleSend(input.value);
                  input.value = '';
                }
              }}
            >
              Submit
            </button>
          </div>
        )}
        {chatGPTResponse && (
          <div className="output">
            <p>ChatGPT: {chatGPTResponse}</p>
            <button
              onClick={() => {
                setChatGPTResponse(null);
                setQuestion(generateQuestion());
              }}
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
    
}

export default App;
