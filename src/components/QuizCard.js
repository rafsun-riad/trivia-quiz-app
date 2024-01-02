import { useState, useEffect } from 'react';

const URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

function QuizCard() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    try {
      async function getQuestions() {
        const res = await fetch(URL);
        const data = await res.json();
        console.log(data);
        setQuestions(data.results);
      }
      getQuestions();
    } catch (error) {
      console.log(error);
    }
  }, []);

  function handleRightAnswer(answer) {
    if (answer === questions[currentQuestionIndex]?.correct_answer) {
      setScore((score) => (score += 1));
    }
    setCurrentQuestionIndex(
      (currentQuestionIndex) => (currentQuestionIndex += 1)
    );
  }

  function handleRestartQuiz() {
    setCurrentQuestionIndex(0);
    setScore(0);
  }

  const currentQuestion = questions[currentQuestionIndex];
  const shuffle = [...currentQuestion?.incorrect_answers];
  const correctAnsIndex = Math.floor(Math.random() * 4);
  shuffle.splice(correctAnsIndex, 0, currentQuestion.correct_answer);

  if (questions?.length === 0) {
    return <div>Loading...</div>;
  }

  if (currentQuestionIndex >= questions?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-black text-white p-3 w-[500px] h-[200px] rounded-xl">
        <h1 className="font-bold">Quiz Completed</h1>
        <p className="text-2xl">
          Your Score: {score}/{questions?.length}
        </p>
        <button
          className="bg-white text-black text-2xl p-2 hover:bg-gray-500 hover:text-white w-[200px] rounded-xl"
          onClick={handleRestartQuiz}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-3 w-[500px] h-[350px] rounded-xl">
      <h2 className="font-bold">Question {currentQuestionIndex + 1}</h2>
      <p className="font-bold text-xl h-[80px]">{currentQuestion.question}</p>
      <ul className="mt-4 flex flex-col items-center gap-4">
        {shuffle.map((ans) => (
          <li
            className="bg-white text-black pl-2 pr-2 text-xl w-[300px] flex flex-col items-center py-1 rounded-2xl cursor-pointer hover:bg-gray-500 hover:text-white"
            key={ans}
            onClick={() => handleRightAnswer(ans)}
          >
            {ans}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizCard;
