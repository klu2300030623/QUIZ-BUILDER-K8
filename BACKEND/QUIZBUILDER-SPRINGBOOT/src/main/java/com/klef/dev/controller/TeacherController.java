package com.klef.dev.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping; // new repository for results
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.dev.model.Question;
import com.klef.dev.model.Quiz;
import com.klef.dev.model.Result;
import com.klef.dev.repository.QuestionRepository;
import com.klef.dev.repository.QuizRepository;
import com.klef.dev.repository.ResultRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TeacherController {

    @Autowired
    private QuizRepository quizRepo;

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private ResultRepository resultRepo; 
    @GetMapping("/quizzes")
    public List<Quiz> getAllQuizzes() {
        return quizRepo.findAll();
    }

    @PostMapping("/quizzes")
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizRepo.save(quiz);
    }

    @PutMapping("/quizzes/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz quizDetails) {
        Quiz quiz = quizRepo.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        return quizRepo.save(quiz);
    }

    @DeleteMapping("/quizzes/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizRepo.deleteById(id);
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public Question addQuestion(@PathVariable Long quizId, @RequestBody Map<String, Object> payload) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        String questionText = (String) payload.get("question");
        List<String> options = (List<String>) payload.get("options");
        String answer = (String) payload.get("answer");

        Question question = new Question();
        question.setQuiz(quiz);
        question.setText(questionText);
        question.setOptionA(options.get(0));
        question.setOptionB(options.get(1));
        question.setOptionC(options.get(2));
        question.setOptionD(options.get(3));
        question.setCorrectAnswer(answer);

        return questionRepo.save(question);
    }

    @PutMapping("/quizzes/{quizId}/questions/{questionId}")
    public Question updateQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId,
            @RequestBody Question questionDetails) {
        Question question = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setText(questionDetails.getText());
        question.setOptionA(questionDetails.getOptionA());
        question.setOptionB(questionDetails.getOptionB());
        question.setOptionC(questionDetails.getOptionC());
        question.setOptionD(questionDetails.getOptionD());
        question.setCorrectAnswer(questionDetails.getCorrectAnswer());

        return questionRepo.save(question);
    }

    @DeleteMapping("/quizzes/{quizId}/questions/{questionId}")
    public void deleteQuestion(@PathVariable Long quizId, @PathVariable Long questionId) {
        questionRepo.deleteById(questionId);
    }

    @GetMapping("/student/quizzes")
    public List<Quiz> getQuizzesForStudents() {
        return quizRepo.findAll(); // can filter if needed
    }

    @PostMapping("/student/results")
    public Result submitResult(@RequestBody Result result) {
        return resultRepo.save(result);
    }

    @GetMapping("/student/results/{studentId}")
    public List<Result> getResultsByStudent(@PathVariable Long studentId) {
        return resultRepo.findByStudentId(studentId);
    }
}
