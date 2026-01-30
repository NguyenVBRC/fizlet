"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
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
  const [isInserting, setIsInserting] = useState(false);
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [insertError, setInsertError] = useState("");

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

  const handleInsertToSupabase = async () => {
    if (!questions) return;

    setIsInserting(true);
    setInsertError("");
    setInsertSuccess(false);

    try {
      const supabase = createClient();

      // Insert questions into the practice-tests table
      const { error: supabaseError } = await supabase
        .from("practice-tests")
        .insert(
          questions.map((q) => ({
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
          })),
        );

      if (supabaseError) {
        console.log(supabaseError);
        throw supabaseError;
      }

      setInsertSuccess(true);

      // Clear the page after successful insertion
      setTimeout(() => {
        setJsonInput("");
        setQuestions(null);
        setInsertSuccess(false);
        setInsertError("");
      }, 2000); // Clear after 2 seconds to show success message
    } catch (err) {
      setInsertError(
        err instanceof Error ? err.message : "Failed to insert questions",
      );
    } finally {
      setIsInserting(false);
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
          <div className={styles.buttonRow} style={{ marginTop: 16 }}>
            <button
              onClick={handleInsertToSupabase}
              disabled={isInserting}
              className={styles.validateButton}
            >
              {isInserting ? "Inserting..." : "Insert to Supabase"}
            </button>
          </div>
          {insertSuccess && (
            <div
              className={styles.success}
              style={{ color: "green", marginTop: 8 }}
            >
              Successfully inserted {questions.length} questions into Supabase!
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
