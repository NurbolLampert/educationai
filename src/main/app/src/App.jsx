import { useState } from 'react';
import './App.css';
import styles from './Quiz.module.css';

const API_KEY = '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';
const systemMessage = {
  role: 'system',
  content: 'I am an 8 year old elementary student and I am taking a 10 question math quiz. Go through each question and my response and display the grade out of 10. If I got the question right display good job, and for each question if I got it wrong explain each question how to get the answer to me as an 8 year old kid. After that generate 10 math quiz questions that would help me improve my skills',
};

function App() {
  const [userAnswers, setUserAnswers] = useState(Array(10).fill(''));
  const [chatGPTResponse, setChatGPTResponse] = useState(null);
  const [questions, setQuestions] = useState(generateQuestions(10));
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  function generateQuestions(count) {
    return Array.from({ length: count }, () => {
      const num1 = Math.floor(Math.random() * 100) + 1;
      const num2 = Math.floor(Math.random() * 100) + 1;
      const operators = ['+', '-', '*', '/'];
      const operator = operators[Math.floor(Math.random() * operators.length)];
  
      if (operator === '/') {
        // Ensure the division result is an integer
        return `${num1 * num2} ${operator} ${num2}`;
      }
      
      return `${num1} ${operator} ${num2}`;
    });
  }

  const handleSend = async () => {
    setIsLoading(true);
    const newMessages = questions.map((question, index) => [
      {
        message: `Question ${index + 1}: ${question}`,
        direction: 'outgoing',
        sender: 'user',
      },
      {
        message: `Answer ${index + 1}: ${userAnswers[index]}`,
        direction: 'outgoing',
        sender: 'user',
      },
    ]).flat();

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
        setIsLoading(false);
      });
  }

  const checkFormValidity = () => {
    const allAnswersProvided = userAnswers.every((answer) => answer.trim() !== '');
    setIsFormValid(allAnswersProvided);
  };

  return (
    <div className={styles.App}>
      <header className="header">EducationAI</header>
      <div className={styles.formContainer}>
        <h2 className={styles.quizTitle}>Math Quiz</h2>
        {questions.map((question, index) => (
          <div key={index}>
            <p className={styles.question}>
              {index + 1}. {question}
            </p>
            <div className={styles.inputContainer}>
              <input
                className={styles.answerInput}
                type="text"
                placeholder="Type your answer here"
                value={userAnswers[index]}
                onChange={(e) => {
                  let updatedAnswers = [...userAnswers];
                  updatedAnswers[index] = e.target.value;
                  setUserAnswers(updatedAnswers);
                  checkFormValidity();
                }}
              />
            </div>
          </div>
        ))}
        {!chatGPTResponse && (
          <button
            className={styles.submitButton}
            onClick={() => {
              handleSend();
            }}
            disabled={!isFormValid}
          >
            Submit All Answers
          </button>
        )}
        {isLoading && (
          <div className={styles.loading}>
            <p>Processing your answers, please wait...</p>
          </div>
        )}
        {chatGPTResponse && (
          <div className={styles.output}>
            <p className={styles.chatGPTResponse}>{chatGPTResponse}</p>
            <button
              className={styles.nextQuestionButton}
              onClick={() => {
                setChatGPTResponse(null);
                setQuestions(generateQuestions(10));
                setUserAnswers(Array(10).fill(''));
                setIsFormValid(false);
              }}
            >
              Retry Quiz
            </button>
          </div>
        )}
      </div>
      <footer className="footer">Pledge: I pledge that I have neither given nor recieved any help on this Quiz.</footer>
    </div>
  );
  
}

export default App;

