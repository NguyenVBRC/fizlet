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
            ))
          ) : (
            <p>No practice tests available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
