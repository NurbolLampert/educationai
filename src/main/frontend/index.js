document.getElementById('quiz-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input data
    const question1 = document.getElementById('question1').value;
    const question2 = document.getElementById('question2').value;

    // Process data (you can replace this with your machine learning logic)
    const outputData = processQuizData([question1, question2]);

    // Display output
    document.getElementById('output-result').innerText = outputData;
});

function processQuizData(quizAnswers) {
    // Sample processing function, replace with your machine learning logic
    let output = 'Processed answers:\n';
    quizAnswers.forEach((answer, index) => {
        output += `Q${index + 1}: ${answer}\n`;
    });
    return output;
}
