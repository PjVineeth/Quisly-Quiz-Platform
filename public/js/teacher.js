// Teacher dashboard functionality

document.addEventListener("DOMContentLoaded", () => {
  // Helper function to format time
  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes

    return hours + ":" + minutes + " " + ampm
  }

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "long" })
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  // Load teacher dashboard data
  const activeQuizzesContainer = document.getElementById("active-quizzes")
  const recentQuizzesContainer = document.getElementById("recent-quizzes")

  if (activeQuizzesContainer && recentQuizzesContainer) {
    // Mock data for teacher dashboard
    const activeQuizzes = [
      {
        id: 1,
        title: "Science Quiz: Chapter 5",
        code: "SCI123",
        participants: 24,
        status: "active",
        startTime: "2023-06-10T14:00:00",
        endTime: "2023-06-10T15:00:00",
      },
      {
        id: 2,
        title: "Math Quiz: Algebra",
        code: "MATH456",
        participants: 18,
        status: "scheduled",
        startTime: "2023-06-15T10:00:00",
        endTime: "2023-06-15T11:00:00",
      },
    ]

    const recentQuizzes = [
      {
        id: 101,
        title: "History Quiz: Ancient Rome",
        date: "2023-06-01",
        participants: 22,
        avgScore: 78,
      },
      {
        id: 102,
        title: "English Literature Quiz",
        date: "2023-05-25",
        participants: 20,
        avgScore: 85,
      },
      {
        id: 103,
        title: "Geography Test: Continents",
        date: "2023-05-20",
        participants: 19,
        avgScore: 72,
      },
    ]

    // Render active quizzes
    if (activeQuizzes.length === 0) {
      activeQuizzesContainer.innerHTML = `
        <div class="card">
          <div class="card-content empty-state">
            <p>No active quizzes at the moment.</p>
          </div>
        </div>
      `
    } else {
      activeQuizzesContainer.innerHTML = activeQuizzes
        .map(
          (quiz) => `
        <div class="card">
          <div class="card-header">
            <div class="quiz-header-content">
              <h3 class="card-title">${quiz.title}</h3>
              <p class="card-description">Code: ${quiz.code}</p>
            </div>
            <span class="badge ${quiz.status === "active" ? "badge-primary" : "badge-outline"}">
              ${quiz.status === "active" ? "Active" : "Scheduled"}
            </span>
          </div>
          <div class="card-content">
            <div class="quiz-info">
              <div class="quiz-participants">
                <i class="fas fa-users"></i>
                <span>${quiz.participants} participants</span>
              </div>
              <div class="quiz-time">
                <i class="fas fa-clock"></i>
                <span>
                  ${formatTime(quiz.startTime)} - ${formatTime(quiz.endTime)}
                </span>
              </div>
            </div>
          </div>
          <div class="card-footer quiz-actions">
            <button class="btn btn-outline btn-sm copy-code-btn" data-code="${quiz.code}">
              <i class="fas fa-copy"></i> Copy Code
            </button>
            <a href="/teacher/monitor.html?id=${quiz.id}" class="btn btn-primary btn-sm">
              ${quiz.status === "active" ? "Monitor" : "View"}
            </a>
          </div>
        </div>
      `,
        )
        .join("")

      // Add event listeners to copy code buttons
      document.querySelectorAll(".copy-code-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const code = this.getAttribute("data-code")
          navigator.clipboard.writeText(code)

          // Show tooltip or notification
          alert(`Quiz code ${code} copied to clipboard!`)
        })
      })
    }

    // Render recent quizzes
    if (recentQuizzes.length === 0) {
      recentQuizzesContainer.innerHTML = `
        <div class="card">
          <div class="card-content empty-state">
            <p>No recent quizzes.</p>
          </div>
        </div>
      `
    } else {
      recentQuizzesContainer.innerHTML = recentQuizzes
        .map(
          (quiz) => `
        <div class="card">
          <div class="card-header">
            <div class="quiz-header-content">
              <h3 class="card-title">${quiz.title}</h3>
              <p class="card-description">${formatDate(quiz.date)}</p>
            </div>
            <span class="badge badge-outline">Completed</span>
          </div>
          <div class="card-content">
            <div class="quiz-info">
              <div class="quiz-participants">
                <i class="fas fa-users"></i>
                <span>${quiz.participants} participants</span>
              </div>
              <div class="quiz-score">
                <span class="avg-score">Avg. Score: ${quiz.avgScore}%</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <a href="/teacher/results.html?id=${quiz.id}" class="btn btn-outline btn-block">
              View Results
            </a>
          </div>
        </div>
      `,
        )
        .join("")
    }
  }
})

