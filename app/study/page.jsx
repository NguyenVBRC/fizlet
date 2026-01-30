"use client";

import { useState, useEffect } from "react";
import questionsData from "@/lib/sqlQuestions.json";
import styles from "./study.module.css";

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
    return <div className={styles.app}>Loading questions...</div>;
  }

  if (isComplete) {
    return (
      <div className={styles.app}>
        <div className={styles.card}>
          <h1>🎉 Quiz Complete!</h1>
          <p>You've finished all the questions!</p>
          <button className={"btn btn-primary"} onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
              {isReviewing && (
                <span className={styles.reviewBadge}> (Review Mode)</span>
              )}
            </span>
            {wrongQuestions.length > 0 && !isReviewing && (
              <span className={styles.wrongCount}>
                {wrongQuestions.length} to review
              </span>
            )}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className={styles.questionSection}>
          <h2 className={styles.question}>{currentQuestion.question}</h2>
        </div>

        <div className={styles.optionsSection}>
          {shuffledOptions.map((option, index) => {
            let buttonClass = styles.optionBtn;

            if (selectedAnswer) {
              if (option === currentQuestion.answer) {
                buttonClass += " " + styles.correct;
              } else if (option === selectedAnswer && !isCorrect) {
                buttonClass += " " + styles.incorrect;
              } else {
                buttonClass += " " + styles.disabled;
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
            className={
              styles.explanation +
              " " +
              (isCorrect
                ? styles.correctExplanation
                : styles.incorrectExplanation)
            }
          >
            <div className={styles.explanationHeader}>
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </div>
            <p>
              {currentQuestion.explanation.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <button className={"btn btn-next"} onClick={handleNext}>
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
