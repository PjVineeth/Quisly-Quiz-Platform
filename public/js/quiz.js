// Quiz page functionality

document.addEventListener("DOMContentLoaded", () => {
  // Get quiz code from URL
  const urlParams = new URLSearchParams(window.location.search)
  const quizCode = urlParams.get("code")

  if (!quizCode) {
    window.location.href = "/student/join.html"
    return
  }

  // Mock quiz data
  const mockQuiz = {
    id: "DEMO123",
    title: "Science Quiz: Chapter 5",
    description: "Test your knowledge of basic science concepts",
    timeLimit: 10, // in minutes
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        text: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O",
      },
      {
        id: 2,
        type: "true-false",
        text: "The Earth revolves around the Sun.",
        options: ["True", "False"],
        correctAnswer: "True",
      },
      {
        id: 3,
        type: "multiple-choice",
        text: "Which of the following is NOT a primary color?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: "Green",
      },
      {
        id: 4,
        type: "numerical",
        text: "What is the atomic number of Oxygen?",
        correctAnswer: "8",
      },
      {
        id: 5,
        type: "short-answer",
        text: "Name the process by which plants make their own food using sunlight.",
        correctAnswer: "photosynthesis",
      },
    ],
  }

  // Initialize quiz state
  let currentQuestion = 0
  const answers = {}
  let timeLeft = mockQuiz.timeLimit * 60 // in seconds

  // Set up quiz UI
  document.getElementById("quiz-title").textContent = mockQuiz.title
  updateQuestionUI()
  updateProgressUI()

  // Helper function to format time from seconds
  function formatTimeFromSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  // Set up timer
  const timerInterval = setInterval(() => {
    timeLeft--

    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      submitQuiz()
      return
    }

    // Show warning when 1 minute left
    if (timeLeft === 60) {
      document.getElementById("time-warning").style.display = "flex"
      setTimeout(() => {
        document.getElementById("time-warning").style.display = "none"
      }, 5000)
    }

    document.getElementById("time-left").textContent = formatTimeFromSeconds(timeLeft)
  }, 1000)

  // Set up navigation buttons
  const prevButton = document.getElementById("prev-button")
  const nextButton = document.getElementById("next-button")

  prevButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--
      updateQuestionUI()
      updateProgressUI()
    }
  })

  nextButton.addEventListener("click", () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      currentQuestion++
      updateQuestionUI()
      updateProgressUI()
    } else {
      // On last question, submit quiz
      submitQuiz()
    }
  })

  // Update question UI based on current question
  function updateQuestionUI() {
    const question = mockQuiz.questions[currentQuestion]
    document.getElementById("question-text").textContent = `${currentQuestion + 1}. ${question.text}`

    // Update navigation buttons
    prevButton.disabled = currentQuestion === 0
    if (currentQuestion === mockQuiz.questions.length - 1) {
      nextButton.textContent = "Submit Quiz"
    } else {
      nextButton.textContent = "Next"
    }

    // Render question content based on type
    const questionContent = document.getElementById("question-content")

    switch (question.type) {
      case "multiple-choice":
      case "true-false":
        questionContent.innerHTML = `
          <div class="options-list">
            ${question.options
              .map(
                (option, index) => `
              <div class="option">
                <input type="radio" name="q${question.id}" id="q${question.id}_${index}" value="${option}" 
                  ${answers[question.id] === option ? "checked" : ""}>
                <label for="q${question.id}_${index}">${option}</label>
              </div>
            `,
              )
              .join("")}
          </div>
        `

        // Add event listeners to radio buttons
        setTimeout(() => {
          const radioButtons = questionContent.querySelectorAll('input[type="radio"]')
          radioButtons.forEach((radio) => {
            radio.addEventListener("change", (e) => {
              answers[question.id] = e.target.value
            })
          })
        }, 0)
        break

      case "numerical":
        questionContent.innerHTML = `
          <div class="form-group">
            <input type="number" id="q${question.id}_answer" class="numerical-input" 
              value="${answers[question.id] || ""}" placeholder="Enter your answer">
          </div>
        `

        // Add event listener to input
        setTimeout(() => {
          const input = document.getElementById(`q${question.id}_answer`)
          input.addEventListener("change", (e) => {
            answers[question.id] = e.target.value
          })
        }, 0)
        break

      case "short-answer":
        questionContent.innerHTML = `
          <div class="form-group">
            <input type="text" id="q${question.id}_answer" 
              value="${answers[question.id] || ""}" placeholder="Type your answer">
          </div>
        `

        // Add event listener to input
        setTimeout(() => {
          const input = document.getElementById(`q${question.id}_answer`)
          input.addEventListener("change", (e) => {
            answers[question.id] = e.target.value
          })
        }, 0)
        break
    }
  }

  // Update progress UI
  function updateProgressUI() {
    const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100
    document.getElementById("question-number").textContent =
      `Question ${currentQuestion + 1} of ${mockQuiz.questions.length}`
    document.getElementById("progress-percentage").textContent = `${Math.round(progress)}% Complete`
    document.getElementById("progress-bar-fill").style.width = `${progress}%`
  }

  // Submit quiz
  function submitQuiz() {
    clearInterval(timerInterval)

    // Calculate score
    let correctAnswers = 0
    mockQuiz.questions.forEach((question) => {
      const userAnswer = answers[question.id] || ""
      if (question.type === "short-answer") {
        // Case insensitive comparison for short answers
        if (userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correctAnswers++
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++
        }
      }
    })

    const score = Math.round((correctAnswers / mockQuiz.questions.length) * 100)

    // In a real app, you would send the results to the server
    /*
    fetch('/api/quizzes/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        quizId: mockQuiz.id,
        answers: answers,
        timeSpent: mockQuiz.timeLimit * 60 - timeLeft
      })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = `/student/results.html?id=${data.resultId}`;
    })
    .catch(error => {
      console.error('Error submitting quiz:', error);
    });
    */

    // For demo, store results in localStorage and redirect
    const results = {
      quizId: mockQuiz.id,
      quizTitle: mockQuiz.title,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: mockQuiz.questions.length,
      timeSpent: formatTimeFromSeconds(mockQuiz.timeLimit * 60 - timeLeft),
      questions: mockQuiz.questions.map((q) => ({
        ...q,
        userAnswer: answers[q.id] || "",
        isCorrect:
          q.type === "short-answer"
            ? (answers[q.id] || "").toLowerCase() === q.correctAnswer.toLowerCase()
            : answers[q.id] === q.correctAnswer,
      })),
    }

    localStorage.setItem("quizResults", JSON.stringify(results))
    window.location.href = "/student/results.html"
  }
})

