"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./study.module.css";

export default function StudyHome() {
  const router = useRouter();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const allTests = JSON.parse(localStorage.getItem("practiceTests") || "{}");
    setTests(Object.keys(allTests));
  }, []);

  // Delete test handler
  const handleDeleteTest = (testName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${testName}"? This cannot be undone.`,
      )
    ) {
      const allTests = JSON.parse(
        localStorage.getItem("practiceTests") || "{}",
      );
      delete allTests[testName];
      localStorage.setItem("practiceTests", JSON.stringify(allTests));
      setTests(Object.keys(allTests));
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.quizListContainer}>
        <h1 className={styles.quizListTitle}>Choose a Practice Test</h1>
        <div className={styles.quizList}>
          {tests.length > 0 ? (
            tests.map((testName) => (
              <div
                key={testName}
                className={styles.quizCard}
                style={{ position: "relative" }}
              >
                <span
                  title="Delete test"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 12,
                    cursor: "pointer",
                    color: "#c00",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    zIndex: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTest(testName);
                  }}
                >
                  ×
                </span>
                <div
                  onClick={() =>
                    router.push(`/study/${encodeURIComponent(testName)}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <h2 className={styles.quizCardTitle}>{testName}</h2>
                  <p className={styles.quizCardDescription}>
                    Click to study this test
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No practice tests available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
