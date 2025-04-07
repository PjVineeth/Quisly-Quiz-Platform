// Quiz monitoring functionality

document.addEventListener("DOMContentLoaded", () => {
  // Get quiz ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const quizId = urlParams.get("id")

  if (!quizId) {
    window.location.href = "/teacher/dashboard.html"
    return
  }

  // Mock quiz data for monitoring
  const mockQuiz = {
    id: 1,
    title: "Science Quiz: Chapter 5",
    code: "SCI123",
    status: "active",
    startTime: "2023-06-10T14:00:00",
    endTime: "2023-06-10T15:00:00",
    totalQuestions: 5,
    participants: [
      { id: 1, name: "Alex Johnson", progress: 100, score: 85, completedAt: "2023-06-10T14:15:30" },
      { id: 2, name: "Maria Garcia", progress: 80, score: null, completedAt: null },
      { id: 3, name: "David Kim", progress: 60, score: null, completedAt: null },
      { id: 4, name: "Sarah Williams", progress: 40, score: null, completedAt: null },
      { id: 5, name: "James Brown", progress: 20, score: null, completedAt: null },
    ],
    questionStats: [
      { id: 1, correctAnswers: 3, totalAnswers: 5 },
      { id: 2, correctAnswers: 4, totalAnswers: 5 },
      { id: 3, correctAnswers: 2, totalAnswers: 4 },
      { id: 4, correctAnswers: 1, totalAnswers: 3 },
      { id: 5, correctAnswers: 0, totalAnswers: 2 },
    ],
  }

  // Set up UI
  document.getElementById("quiz-title").textContent = mockQuiz.title
  document.getElementById("quiz-code").textContent = mockQuiz.code
  document.getElementById("participant-count").textContent = mockQuiz.participants.length

  // Calculate time remaining
  function calculateTimeLeft() {
    const endTime = new Date(mockQuiz.endTime).getTime()
    const now = new Date().getTime()
    const difference = endTime - now

    if (difference > 0) {
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    return "Ended"
  }

  // Update time left
  document.getElementById("time-left").textContent = calculateTimeLeft()
  const timerInterval = setInterval(() => {
    document.getElementById("time-left").textContent = calculateTimeLeft()
  }, 1000)

  // Render participants
  renderParticipants()

  // Render question statistics
  renderQuestionStats()

  // Update summary stats
  updateSummaryStats()

  // Copy quiz code button
  document.getElementById("copy-code-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(mockQuiz.code)
    alert(`Quiz code ${mockQuiz.code} copied to clipboard!`)
  })

  // End quiz button
  document.getElementById("end-quiz-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to end this quiz for all participants?")) {
      // In a real app, you would send a request to end the quiz
      /*
      fetch(`/api/quizzes/${quizId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(data => {
        window.location.href = `/teacher/results.html?id=${quizId}`;
      })
      .catch(error => {
        console.error('Error ending quiz:', error);
      });
      */

      // For demo, just redirect
      window.location.href = `/teacher/results.html?id=${quizId}`
    }
  })

  // Simulate real-time updates
  simulateRealTimeUpdates()

  // Functions
  function renderParticipants() {
    const participantsContainer = document.getElementById("participants-container")
    participantsContainer.innerHTML = mockQuiz.participants
      .map(
        (participant) => `
      <div class="participant-item" data-participant-id="${participant.id}">
        <div class="participant-info">
          <span class="participant-name">${participant.name}</span>
          ${
            participant.score !== null
              ? `<span class="participant-score">${participant.score}%</span>`
              : `<span class="participant-progress">${participant.progress}% complete</span>`
          }
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${participant.progress}%"></div>
        </div>
        ${
          participant.completedAt
            ? `<p class="completion-time">Completed at ${formatTime(participant.completedAt)}</p>`
            : ""
        }
      </div>
    `,
      )
      .join("")
  }

  function renderQuestionStats() {
    const questionStatsContainer = document.getElementById("question-stats-container")
    questionStatsContainer.innerHTML = mockQuiz.questionStats
      .map((stat, index) => {
        const correctPercentage =
          stat.totalAnswers > 0 ? Math.round((stat.correctAnswers / stat.totalAnswers) * 100) : 0

        return `
        <div class="question-stat-item" data-question-id="${stat.id}">
          <div class="question-stat-header">
            <span class="question-number">Question ${index + 1}</span>
            <span class="question-stat-result">
              ${stat.correctAnswers}/${stat.totalAnswers} correct (${correctPercentage}%)
            </span>
          </div>
          <div class="question-stat-bar">
            <div class="question-stat-correct" style="width: ${correctPercentage}%"></div>
            <div class="question-stat-incorrect" style="width: ${100 - correctPercentage}%"></div>
          </div>
        </div>
      `
      })
      .join("")
  }

  function updateSummaryStats() {
    // Completion rate
    const completedCount = mockQuiz.participants.filter((p) => p.score !== null).length
    const completionRate = Math.round((completedCount / mockQuiz.participants.length) * 100)
    document.getElementById("completion-rate").textContent = `${completionRate}%`
    document.getElementById("completion-detail").textContent =
      `${completedCount} of ${mockQuiz.participants.length} completed`

    // Average score
    const scores = mockQuiz.participants.filter((p) => p.score !== null).map((p) => p.score)
    const averageScore =
      scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0
    document.getElementById("average-score").textContent = `${averageScore}%`
    document.getElementById("score-detail").textContent = `Based on ${scores.length} completed quizzes`
  }

  function simulateRealTimeUpdates() {
    // Simulate a new participant joining
    setTimeout(() => {
      mockQuiz.participants.push({
        id: 6,
        name: "Emma Wilson",
        progress: 0,
        score: null,
        completedAt: null,
      })

      document.getElementById("participant-count").textContent = mockQuiz.participants.length
      renderParticipants()
      updateSummaryStats()

      alert("New participant joined: Emma Wilson")
    }, 5000)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      let updated = false

      mockQuiz.participants.forEach((participant) => {
        if (participant.score === null && participant.progress < 100) {
          participant.progress = Math.min(participant.progress + 20, 100)
          updated = true

          // If progress reaches 100, set a score
          if (participant.progress === 100) {
            participant.score = Math.floor(Math.random() * 30) + 70 // Random score between 70-100
            participant.completedAt = new Date().toISOString()
          }
        }
      })

      // Update question stats as participants progress
      mockQuiz.questionStats.forEach((stat, index) => {
        const newAnswers = Math.min(stat.totalAnswers + 1, mockQuiz.participants.length)
        const newCorrect = stat.correctAnswers + (Math.random() > 0.3 ? 1 : 0)

        stat.totalAnswers = newAnswers
        stat.correctAnswers = Math.min(newCorrect, newAnswers)
      })

      if (updated) {
        renderParticipants()
        renderQuestionStats()
        updateSummaryStats()
      }

      // Stop updates after all participants complete
      if (mockQuiz.participants.every((p) => p.progress === 100)) {
        clearInterval(progressInterval)
      }
    }, 8000)
  }

  function formatTime(isoString) {
    const date = new Date(isoString)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }
})

