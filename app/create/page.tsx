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
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError("");
    setQuestions(null);
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

      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(parsed, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setQuestions(null);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setDownloadUrl("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a Practice Test</h1>

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
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="practice-questions.json"
              className={styles.downloadButton}
              style={{ display: "inline-block", marginTop: 16 }}
            >
              Download JSON File
            </a>
          )}
        </div>
      )}
    </div>
  );
}
