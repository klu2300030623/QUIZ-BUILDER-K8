import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizForm, setQuizForm] = useState({ title: "", description: "" });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: ""
  });

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/quizzes`);
      setQuizzes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/quizzes`, quizForm);
      const createdQuiz = response.data;
      setQuizzes([...quizzes, createdQuiz]);
      setQuizForm({ title: "", description: "" });
      setCurrentQuizId(createdQuiz.id);
      setShowQuestionForm(true);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Check console for details.");
    }
  };

  const handleAddQuestion = async () => {
    try {
      await axios.post(`${API_URL}/api/quizzes/${currentQuizId}/questions`, questionForm);
      alert("Question added!");
      setQuestionForm({ question: "", options: ["", "", "", ""], answer: "" });
      fetchQuizzes();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Teacher Dashboard</h1>

      {!showQuestionForm && (
        <form onSubmit={handleCreateQuiz} style={{ marginBottom: "20px" }}>
          <h2>Create Quiz</h2>
          <input
            type="text"
            placeholder="Title"
            value={quizForm.title}
            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
            required
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <input
            type="text"
            placeholder="Description"
            value={quizForm.description}
            onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
            required
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <button type="submit">Create Quiz</button>
        </form>
      )}

      {showQuestionForm && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Add Questions for Quiz ID: {currentQuizId}</h2>
          <input
            type="text"
            placeholder="Question"
            value={questionForm.question}
            onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          {questionForm.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...questionForm.options];
                newOptions[idx] = e.target.value;
                setQuestionForm({ ...questionForm, options: newOptions });
              }}
              style={{ display: "block", margin: "5px 0", width: "100%" }}
            />
          ))}
          <input
            type="text"
            placeholder="Answer"
            value={questionForm.answer}
            onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <button onClick={handleAddQuestion} style={{ marginRight: "10px" }}>Add Question</button>
          <button onClick={() => setShowQuestionForm(false)}>Back to Dashboard</button>
        </div>
      )}

      <hr />
      <h2>Existing Quizzes</h2>
      <ul>
        {Array.isArray(quizzes) && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <li key={quiz.id}>
              <strong>{quiz.title}</strong> - {quiz.description} 
              <br />
              Questions: {quiz.questions ? quiz.questions.length : 0}
            </li>
          ))
        ) : (
          <li>No quizzes available</li>
        )}
      </ul>
    </div>
  );
};

export default TeacherDashboard;