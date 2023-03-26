import { useState } from 'react';
import './App.css';
import styles from './Quiz.module.css';

const API_KEY = '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';
const systemMessage = {
  role: 'system',
  content: 'The user is a middle schooler. Check if the provided answers are correct and if it is, say "Correct!" or "Good Job! or something like that and if it is wrong, explain the calculations in 3 sentences. Then if the user gets the next question correct, increase the difficulty for the next question, but if the user gets the previous question wrong, decrease the difficulty of the question',
};


function App() {
  const [userAnswer, setUserAnswer] = useState('');
  const [chatGPTResponse, setChatGPTResponse] = useState(null);
  const [question, setQuestion] = useState(generateQuestion());
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(true);
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
    <div className={styles.App}>
        <header className="header">EducationIA</header>      
        <div className={styles.formContainer}>
        <h2 className={styles.quizTitle}>Math Quiz</h2>
        <p className={styles.question}>{question}</p>
        {!chatGPTResponse && (
          <div className={styles.inputContainer}>
            <input
              className={styles.answerInput}
              type="text"
              placeholder="Type your answer here"
              onKeyDown={(e) => {
                if (e.key === 'Submit' && e.target.value.trim()) {
                  handleSend(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              className={styles.submitButton}
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
          <div className={styles.output}>
            <p className={styles.chatGPTResponse}>{chatGPTResponse}</p>
            <button
              className={styles.nextQuestionButton}
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
      <footer className="footer">EducationIA</footer>
    </div>
  );
}

export default App;
