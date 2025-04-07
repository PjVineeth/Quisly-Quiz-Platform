// Results page functionality

document.addEventListener("DOMContentLoaded", () => {
  // Try to get results from localStorage (for demo)
  const resultsData = JSON.parse(localStorage.getItem("quizResults") || "null")

  if (!resultsData) {
    // Mock results data if none in localStorage
    const mockResult = {
      quizId: "demo",
      quizTitle: "Science Quiz: Chapter 5",
      date: "2023-06-10T14:30:00",
      timeSpent: "8:45", // minutes:seconds
      score: 80,
      totalQuestions: 5,
      correctAnswers: 4,
      questions: [
        {
          id: 1,
          text: "What is the chemical symbol for water?",
          userAnswer: "H2O",
          correctAnswer: "H2O",
          isCorrect: true,
        },
        {
          id: 2,
          text: "The Earth revolves around the Sun.",
          userAnswer: "True",
          correctAnswer: "True",
          isCorrect: true,
        },
        {
          id: 3,
          text: "Which of the following is NOT a primary color?",
          userAnswer: "Green",
          correctAnswer: "Green",
          isCorrect: true,
        },
        {
          id: 4,
          text: "What is the atomic number of Oxygen?",
          userAnswer: "6",
          correctAnswer: "8",
          isCorrect: false,
        },
        {
          id: 5,
          text: "Name the process by which plants make their own food using sunlight.",
          userAnswer: "photosynthesis",
          correctAnswer: "photosynthesis",
          isCorrect: true,
        },
      ],
      leaderboard: [
        { name: "Alex Johnson", score: 95, position: 1 },
        { name: "Maria Garcia", score: 90, position: 2 },
        { name: "You", score: 80, position: 3, isCurrentUser: true },
        { name: "David Kim", score: 75, position: 4 },
        { name: "Sarah Williams", score: 70, position: 5 },
      ],
    }

    // Use mock data
    renderResults(mockResult)
  } else {
    // Add mock leaderboard to the results
    resultsData.leaderboard = [
      { name: "Alex Johnson", score: 95, position: 1 },
      { name: "Maria Garcia", score: 90, position: 2 },
      { name: "You", score: resultsData.score, position: 3, isCurrentUser: true },
      { name: "David Kim", score: 75, position: 4 },
      { name: "Sarah Williams", score: 70, position: 5 },
    ]

    renderResults(resultsData)
  }

  function renderResults(result) {
    // Set quiz title
    document.getElementById("result-title").textContent = result.quizTitle

    // Set score information
    document.getElementById("score-percentage").textContent = `${result.score}%`
    document.getElementById("correct-answers").textContent = result.correctAnswers
    document.getElementById("total-questions").textContent = result.totalQuestions
    document.getElementById("score-bar").style.width = `${result.score}%`

    // Set stats
    document.getElementById("time-spent").textContent = result.timeSpent
    document.getElementById("accuracy").textContent = `${result.score}%`
    document.getElementById("rank").textContent =
      `${result.leaderboard.find((item) => item.isCurrentUser)?.position} of ${result.leaderboard.length}`

    // Render questions review
    const questionsReviewContainer = document.getElementById("questions-review")
    questionsReviewContainer.innerHTML = result.questions
      .map(
        (question, index) => `
      <div class="question-review-item">
        <div class="question-review-header">
          <h4 class="question-review-title">
            ${index + 1}. ${question.text}
          </h4>
          ${
            question.isCorrect
              ? '<i class="fas fa-check-circle correct-icon"></i>'
              : '<i class="fas fa-times-circle incorrect-icon"></i>'
          }
        </div>
        <div class="question-review-content">
          <div class="answer-comparison">
            <div class="user-answer">
              <p class="answer-label">Your answer:</p>
              <p class="answer-value ${question.isCorrect ? "correct-answer" : "incorrect-answer"}">
                ${question.userAnswer || "<em>No answer</em>"}
              </p>
            </div>
            ${
              !question.isCorrect
                ? `
              <div class="correct-answer">
                <p class="answer-label">Correct answer:</p>
                <p class="answer-value correct-answer">${question.correctAnswer}</p>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    // Render leaderboard
    const leaderboardContainer = document.getElementById("leaderboard")
    leaderboardContainer.innerHTML = result.leaderboard
      .map(
        (item) => `
      <div class="leaderboard-item ${item.isCurrentUser ? "current-user" : ""}">
        <div class="leaderboard-rank">
          <span>${item.position}.</span>
          <span>${item.name}</span>
          ${item.position === 1 ? '<i class="fas fa-trophy trophy-icon"></i>' : ""}
        </div>
        <span class="leaderboard-score ${item.isCurrentUser ? "current-user-score" : ""}">${item.score}%</span>
      </div>
    `,
      )
      .join("")
  }
})

