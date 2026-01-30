"use client";

import { useState, useEffect } from "react";
import questionsData from "@/lib/questions.json";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Shuffle options when the question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.options) {
      // Fisher-Yates shuffle
      const shuffled = [...currentQuestion.options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledOptions(shuffled);
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    setQuestions(questionsData);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (!correct) {
      // Add to wrong questions stack if not already there
      if (
        !wrongQuestions.find((q) => q.question === currentQuestion.question)
      ) {
        setWrongQuestions([...wrongQuestions, currentQuestion]);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestion();
    } else {
      // End of initial questions
      if (!isReviewing && wrongQuestions.length > 0) {
        // Start reviewing wrong answers
        setIsReviewing(true);
        setQuestions(wrongQuestions);
        setCurrentIndex(0);
        setWrongQuestions([]);
        resetQuestion();
      } else if (isReviewing && wrongQuestions.length > 0) {
        // Continue reviewing only the ones still wrong
        setQuestions(wrongQuestions);
        setCurrentIndex(0);
        setWrongQuestions([]);
        resetQuestion();
      } else {
        setIsComplete(true);
      }
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  const restartQuiz = () => {
    setQuestions(questionsData);
    setCurrentIndex(0);
    setWrongQuestions([]);
    setIsReviewing(false);
    setIsComplete(false);
    resetQuestion();
  };

  if (questions.length === 0) {
    return <div className="app">Loading questions...</div>;
  }

  if (isComplete) {
    return (
      <div className="app">
        <div className="card">
          <h1>🎉 Quiz Complete!</h1>
          <p>You've finished all the questions!</p>
          <button className="btn btn-primary" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <div className="progress-info">
            <span className="progress-text">
              Question {currentIndex + 1} of {questions.length}
              {isReviewing && (
                <span className="review-badge"> (Review Mode)</span>
              )}
            </span>
            {wrongQuestions.length > 0 && !isReviewing && (
              <span className="wrong-count">
                {wrongQuestions.length} to review
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="question-section">
          <h2 className="question">{currentQuestion.question}</h2>
        </div>

        <div className="options-section">
          {shuffledOptions.map((option, index) => {
            let buttonClass = "option-btn";

            if (selectedAnswer) {
              if (option === currentQuestion.answer) {
                buttonClass += " correct";
              } else if (option === selectedAnswer && !isCorrect) {
                buttonClass += " incorrect";
              } else {
                buttonClass += " disabled";
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerClick(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div
            className={`explanation ${isCorrect ? "correct-explanation" : "incorrect-explanation"}`}
          >
            <div className="explanation-header">
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </div>
            <p>{currentQuestion.explanation}</p>
            <p>{currentQuestion.example}</p>
            <button className="btn btn-next" onClick={handleNext}>
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
