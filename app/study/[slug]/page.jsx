"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../study.module.css";

const quizMap = {
  sql: {
    file: "sqlQuestions.json",
    name: "SQL",
  },
  "prompt-samples": {
    file: "promptSamples.json",
    name: "Prompt Samples",
  },
};

export default function StudyQuiz() {
  const { slug } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    async function loadQuestions() {
      const quiz = quizMap[slug];
      if (!quiz) return;
      const data = await import(`@/lib/${quiz.file}`);
      setQuestions(data.default || data);
    }
    loadQuestions();
  }, [slug]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion && currentQuestion.options) {
      const shuffled = [...currentQuestion.options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledOptions(shuffled);
    }
  }, [currentIndex, questions]);

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    if (!correct) {
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
      if (!isReviewing && wrongQuestions.length > 0) {
        setIsReviewing(true);
        setQuestions(wrongQuestions);
        setCurrentIndex(0);
        setWrongQuestions([]);
        resetQuestion();
      } else if (isReviewing && wrongQuestions.length > 0) {
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
    setCurrentIndex(0);
    setWrongQuestions([]);
    setIsReviewing(false);
    setIsComplete(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setQuestions([]);
    // reload questions
    const quiz = quizMap[slug];
    if (quiz) {
      import(`@/lib/${quiz.file}`).then((data) => {
        setQuestions(data.default || data);
      });
    }
  };

  if (!quizMap[slug]) {
    return <div className={styles.app}>Quiz not found.</div>;
  }

  if (questions.length === 0) {
    return <div className={styles.app}>Loading questions...</div>;
  }

  if (isComplete) {
    return (
      <div className={styles.app}>
        <div className={styles.card}>
          <h1>🎉 Quiz Complete!</h1>
          <p>You've finished all the questions!</p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={restartQuiz}
          >
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
                buttonClass += ` ${styles.correct}`;
              } else if (option === selectedAnswer && !isCorrect) {
                buttonClass += ` ${styles.incorrect}`;
              } else {
                buttonClass += ` ${styles.disabled}`;
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
            <button
              className={`${styles.btn} ${styles.btnNext}`}
              onClick={handleNext}
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
