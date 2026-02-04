"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ Correct way to get dynamic slug in client component
  const testName = decodeURIComponent(params.slug);

  const [questions, setQuestions] = useState([]);

  // --- FORM STATE ---
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [explanation, setExplanation] = useState("");

  // Load existing questions
  useEffect(() => {
    const allTests = JSON.parse(localStorage.getItem("practiceTests") || "{}");
    setQuestions(allTests[testName] || []);
  }, [testName]);

  // Save updated list to localStorage
  const saveQuestions = (updated) => {
    const allTests = JSON.parse(localStorage.getItem("practiceTests") || "{}");
    allTests[testName] = updated;
    localStorage.setItem("practiceTests", JSON.stringify(allTests));
    setQuestions(updated);
  };

  // Add new question
  const handleAddQuestion = () => {
    if (!questionText.trim()) return;

    const newQ = {
      question: questionText,
      options,
      answer,
      explanation,
    };

    const updated = [...questions, newQ];
    saveQuestions(updated);

    // reset form
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setExplanation("");
  };

  // Delete question
  const handleDeleteQuestion = (idx) => {
    const updated = questions.filter((_, i) => i !== idx);
    saveQuestions(updated);
  };

  // Update option field
  const updateOption = (index, value) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h1>Edit Test: {testName}</h1>

      {/* ---------------- EXISTING QUESTIONS ---------------- */}
      <div style={{ marginBottom: 32 }}>
        <h2>Questions</h2>

        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          <ul>
            {questions.map((q, idx) => (
              <li key={idx} style={{ marginBottom: 16 }}>
                <strong>{q.question}</strong>

                <div style={{ marginTop: 6 }}>
                  {q.options?.map((opt, i) => (
                    <div key={i}>• {opt}</div>
                  ))}
                </div>

                <div style={{ color: "green" }}>Answer: {q.answer}</div>

                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {q.explanation}
                </div>

                <button
                  onClick={() => handleDeleteQuestion(idx)}
                  style={{
                    marginTop: 6,
                    color: "#c00",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------------- ADD QUESTION FORM ---------------- */}
      <h2>Add Question</h2>

      <input
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Question"
        style={inputStyle}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => updateOption(i, e.target.value)}
          placeholder={`Option ${i + 1}`}
          style={inputStyle}
        />
      ))}

      <select
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Answer</option>
        {options.map(
          (opt, i) =>
            opt && (
              <option key={i} value={opt}>
                {opt}
              </option>
            ),
        )}
      </select>

      <textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Explanation"
        style={{ ...inputStyle, minHeight: 80 }}
      />

      <button
        onClick={handleAddQuestion}
        style={{
          padding: "10px 16px",
          borderRadius: 4,
          background: "#0070f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginTop: 12,
        }}
      >
        Add Question
      </button>

      <button
        style={{
          marginTop: 32,
          background: "#eee",
          border: "none",
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer",
          marginLeft: 12,
        }}
        onClick={() => router.push("/study")}
      >
        Back to Tests
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
};
