"use client";

import { useState } from "react";
import styles from "./create.module.css";

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export default function CreatePracticeTest() {
  const [title, setTitle] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isInserting, setIsInserting] = useState(false);
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [insertError, setInsertError] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setInsertSuccess(false);
    setInsertError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError("");
    setQuestions(null);
    setInsertSuccess(false);
    setInsertError("");
  };

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array");
      }

      for (const q of parsed) {
        if (
          typeof q.question !== "string" ||
          !Array.isArray(q.options) ||
          typeof q.answer !== "string" ||
          typeof q.explanation !== "string"
        ) {
          throw new Error("Invalid question format");
        }
      }

      setQuestions(parsed);
      setError("");
    } catch (err) {
      setQuestions(null);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setInsertSuccess(false);
    }
  };

  const handleSaveToLocalStorage = () => {
    if (!questions || !title.trim()) {
      setInsertError("Test name is required.");
      return;
    }
    setIsInserting(true);
    setInsertError("");
    setInsertSuccess(false);

    try {
      // Get all tests from localStorage
      const allTests = JSON.parse(
        localStorage.getItem("practiceTests") || "{}",
      );
      if (allTests[title.trim()]) {
        setInsertError("A test with this name already exists.");
        setIsInserting(false);
        return;
      }
      // Save new test
      allTests[title.trim()] = questions;
      localStorage.setItem("practiceTests", JSON.stringify(allTests));
      setInsertSuccess(true);
      setTimeout(() => {
        setTitle("");
        setJsonInput("");
        setQuestions(null);
        setInsertSuccess(false);
        setInsertError("");
      }, 2000);
    } catch (err) {
      setInsertError(
        err instanceof Error ? err.message : "Failed to save questions",
      );
    } finally {
      setIsInserting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a Practice Test</h1>

      <label
        htmlFor="test-title"
        className={styles.instructions}
        style={{ display: "block", marginBottom: 8 }}
      >
        Test Name:
      </label>
      <input
        id="test-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        className={styles.textarea}
        placeholder="Enter test name..."
        style={{ marginBottom: 16 }}
      />

      <p className={styles.instructions}>Paste your questions JSON below:</p>

      <textarea
        value={jsonInput}
        onChange={handleInputChange}
        rows={12}
        className={styles.textarea}
        placeholder="Paste JSON array here..."
      />

      <div className={styles.buttonRow}>
        <button onClick={handleValidate} className={styles.validateButton}>
          Validate & Preview
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {questions && (
        <div className={styles.previewBox}>
          <h2 className={styles.previewTitle}>Preview</h2>

          {questions.map((q, idx) => (
            <div key={idx} className={styles.questionBlock}>
              <strong>Q{idx + 1}:</strong> {q.question}
              <ul className={styles.optionsList}>
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <div>
                <em>Answer:</em> {q.answer}
              </div>
              <div>
                <em>Explanation:</em> {q.explanation}
              </div>
            </div>
          ))}
          <div className={styles.buttonRow} style={{ marginTop: 16 }}>
            <button
              onClick={handleSaveToLocalStorage}
              disabled={isInserting}
              className={styles.validateButton}
            >
              {isInserting ? "Saving..." : "Save to LocalStorage"}
            </button>
          </div>
          {insertSuccess && (
            <div
              className={styles.success}
              style={{ color: "green", marginTop: 8 }}
            >
              Saved {questions.length} questions into LocalStorage!
            </div>
          )}
          {insertError && (
            <div
              className={styles.error}
              style={{ color: "red", marginTop: 8 }}
            >
              Failed to insert questions: {insertError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
