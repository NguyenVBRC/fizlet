"use client";

import { useRouter } from "next/navigation";
import styles from "./study.module.css";

const quizzes = [
  {
    file: "sqlQuestions.json",
    name: "SQL",
    slug: "sql",
    description: "Practice SQL questions.",
  },
];

export default function StudyHome() {
  const router = useRouter();

  return (
    <div className={styles.app}>
      <div className={styles.quizListContainer}>
        <h1 className={styles.quizListTitle}>Choose a Practice Test</h1>
        <div className={styles.quizList}>
          {quizzes.map((quiz) => (
            <div
              key={quiz.slug}
              className={styles.quizCard}
              onClick={() => router.push(`/study/${quiz.slug}`)}
            >
              <h2 className={styles.quizCardTitle}>{quiz.name}</h2>
              <p className={styles.quizCardDescription}>{quiz.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
