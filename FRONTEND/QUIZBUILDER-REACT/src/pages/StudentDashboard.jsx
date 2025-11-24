import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await axios.get(`${API_URL}/api/student/quizzes`);
        const quizData = Array.isArray(quizRes.data)
          ? quizRes.data
          : quizRes.data.quizzes || [];
        setQuizzes(quizData);

        const resultRes = await axios.get(`${API_URL}/api/student/results/${user.id}`);
        setResults(resultRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;

    let score = 0;
    selectedQuiz.questions?.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score++;
    });

    const newResult = {
      studentId: user.id,
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      subject: selectedQuiz.subject || "General",
      total: selectedQuiz.questions?.length || 0,
      score,
    };

    setResult(newResult);

    try {
      await axios.post(`${API_URL}/api/student/results`, newResult);
      setResults((prev) => [...prev, newResult]);
    } catch (err) {
      console.error("Error saving result:", err);
    }
  };

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div className="student-dashboard">
      <h2>Welcome, {user?.name}</h2>

      {/* Horizontal quiz cards */}
      {!selectedQuiz && (
        <>
          <h3>Available Quizzes</h3>
          <div className="quiz-list">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <h4>{quiz.title}</h4>
                  <p><strong>Subject:</strong> {quiz.subject || "General"}</p>
                  <p>{quiz.description}</p>
                  <button onClick={() => handleStartQuiz(quiz)}>Start Quiz</button>
                </div>
              ))
            ) : (
              <p>No quizzes available.</p>
            )}
          </div>

          {/* 🧮 Simplified Scoreboard */}
          <h3>Your Scoreboard</h3>
          {/* Scoreboard Section */}

{results.length > 0 ? (
  <div className="scoreboard-container">
    <table className="scoreboard-table">
      <thead>
        <tr>
          <th>Quiz Title</th>
          <th>Subject</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map((res, index) => {
          const title =
            res.quizTitle ||
            res.quiz?.title ||
            quizzes.find((q) => q.id === res.quizId)?.title ||
            "Untitled Quiz";

          const subject =
            res.subject ||
            res.quiz?.subject ||
            quizzes.find((q) => q.id === res.quizId)?.subject ||
            "General";

          return (
            <tr key={index}>
              <td>{title}</td>
              <td>{subject}</td>
              <td>{res.score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
) : (
  <p>No results yet.</p>
)}

        </>
      )}

      {/* Quiz-taking section */}
{/* Quiz-taking section */}
{selectedQuiz && !result && (
  <div className="quiz-section">
    <div className="quiz-header">
      <h3>{selectedQuiz.title}</h3>
      <button className="back-button" onClick={() => setSelectedQuiz(null)}>
        ← Back to Dashboard
      </button>
    </div>

    {selectedQuiz.questions?.map((q) => (
      <div key={q.id} className="question-block">
        <p className="question-text">{q.text}</p>
        <div className="options-container">
          {["optionA", "optionB", "optionC", "optionD"].map((optKey, idx) => (
            <label key={idx} className="option-item">
              <input
                type="radio"
                name={`q-${q.id}`}
                value={q[optKey]}
                checked={answers[q.id] === q[optKey]}
                onChange={() => handleAnswerChange(q.id, q[optKey])}
              />
              <span className="option-text">{q[optKey]}</span>
            </label>
          ))}
        </div>
      </div>
    ))}

    <div className="quiz-actions">
      <button className="submit-btn" onClick={handleSubmitQuiz}>
        Submit Quiz
      </button>
      <button className="cancel-btn" onClick={() => setSelectedQuiz(null)}>
        Cancel
      </button>
    </div>
  </div>
)}


    {/* Result view */}
{result && (
  <div className="quiz-result">
    <h3>Quiz Completed!</h3>
    <p>
      You scored {result.score} out of {result.total}
    </p>
    <button className="back-button" onClick={() => setSelectedQuiz(null)}>
      ← Back to Dashboard
    </button>
  </div>
)}
</div>
  );
}
