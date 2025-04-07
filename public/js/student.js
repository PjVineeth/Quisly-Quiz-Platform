// Student related functionality

document.addEventListener("DOMContentLoaded", () => {
  // Helper function to display alerts
  function showAlert(elementId, message) {
    const alertElement = document.getElementById(elementId)
    if (alertElement) {
      alertElement.textContent = message
      alertElement.style.display = "block"
      setTimeout(() => {
        alertElement.style.display = "none"
      }, 3000) // Hide after 3 seconds
    }
  }

  // Helper function to format dates
  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }

  // Helper function to format times
  function formatTime(dateString) {
    const date = new Date(dateString)
    const options = { hour: "2-digit", minute: "2-digit" }
    return date.toLocaleTimeString(undefined, options)
  }

  // Join quiz form handling
  const joinQuizForm = document.getElementById("join-quiz-form")
  if (joinQuizForm) {
    joinQuizForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const quizCode = document.getElementById("quizCode").value.trim().toUpperCase()
      const joinButton = document.getElementById("join-button")

      // Basic validation
      if (!quizCode) {
        showAlert("join-alert", "Please enter a quiz code")
        return
      }

      // Disable button and show loading state
      joinButton.disabled = true
      joinButton.textContent = "Joining..."

      // Simulate API call
      setTimeout(() => {
        // For demo purposes, redirect to a quiz if code is "DEMO123"
        if (quizCode === "DEMO123") {
          window.location.href = `/student/quiz.html?code=${quizCode}`
        } else {
          showAlert("join-alert", "Invalid quiz code. Please try again.")
          joinButton.disabled = false
          joinButton.textContent = "Join Quiz"
        }

        // In a real app, you would make an API call:
        /*
        fetch(`/api/quizzes/join/${quizCode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = `/student/quiz.html?id=${data.quizId}`;
          } else {
            showAlert('join-alert', data.message || 'Invalid quiz code');
            joinButton.disabled = false;
            joinButton.textContent = 'Join Quiz';
          }
        })
        .catch(error => {
          showAlert('join-alert', 'An error occurred. Please try again.');
          joinButton.disabled = false;
          joinButton.textContent = 'Join Quiz';
        });
        */
      }, 1000)
    })
  }

  // Load student dashboard data
  const upcomingQuizzesContainer = document.getElementById("upcoming-quizzes")
  const completedQuizzesContainer = document.getElementById("completed-quizzes")

  if (upcomingQuizzesContainer && completedQuizzesContainer) {
    // Mock data for student dashboard
    const upcomingQuizzes = [
      {
        id: 1,
        title: "Science Quiz: Chapter 5",
        date: "2023-06-15T14:00:00",
        subject: "Science",
        teacher: "Ms. Johnson",
      },
      { id: 2, title: "Math Final Exam", date: "2023-06-18T10:00:00", subject: "Mathematics", teacher: "Mr. Smith" },
    ]

    const completedQuizzes = [
      {
        id: 101,
        title: "History Quiz: Ancient Rome",
        date: "2023-06-01T13:00:00",
        subject: "History",
        score: 85,
        total: 100,
      },
      {
        id: 102,
        title: "English Literature Quiz",
        date: "2023-05-25T11:30:00",
        subject: "English",
        score: 92,
        total: 100,
      },
      {
        id: 103,
        title: "Geography Test: Continents",
        date: "2023-05-20T09:00:00",
        subject: "Geography",
        score: 78,
        total: 100,
      },
    ]

    // Render upcoming quizzes
    if (upcomingQuizzes.length === 0) {
      upcomingQuizzesContainer.innerHTML = `
        <div class="card">
          <div class="card-content empty-state">
            <p>No upcoming quizzes at the moment.</p>
          </div>
        </div>
      `
    } else {
      upcomingQuizzesContainer.innerHTML = upcomingQuizzes
        .map(
          (quiz) => `
        <div class="card">
          <div class="card-header">
            <div class="quiz-header-content">
              <h3 class="card-title">${quiz.title}</h3>
              <p class="card-description">By ${quiz.teacher}</p>
            </div>
            <span class="badge">${quiz.subject}</span>
          </div>
          <div class="card-content">
            <div class="quiz-date">
              <i class="fas fa-calendar"></i>
              <time datetime="${quiz.date}">
                ${formatDate(quiz.date)} at ${formatTime(quiz.date)}
              </time>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-outline btn-block">Set Reminder</button>
          </div>
        </div>
      `,
        )
        .join("")
    }

    // Render completed quizzes
    if (completedQuizzes.length === 0) {
      completedQuizzesContainer.innerHTML = `
        <div class="card">
          <div class="card-content empty-state">
            <p>You haven't completed any quizzes yet.</p>
          </div>
        </div>
      `
    } else {
      completedQuizzesContainer.innerHTML = completedQuizzes
        .map(
          (quiz) => `
        <div class="card">
          <div class="card-header">
            <div class="quiz-header-content">
              <h3 class="card-title">${quiz.title}</h3>
              <p class="card-description">Completed on ${formatDate(quiz.date)}</p>
            </div>
            <span class="badge badge-outline">${quiz.subject}</span>
          </div>
          <div class="card-content">
            <div class="quiz-result-info">
              <div class="quiz-time">
                <i class="fas fa-clock"></i>
                <time datetime="${quiz.date}">${formatTime(quiz.date)}</time>
              </div>
              <div class="quiz-score">
                <i class="fas fa-trophy"></i>
                <span>${quiz.score}/${quiz.total} (${Math.round((quiz.score / quiz.total) * 100)}%)</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <a href="/student/results.html?id=${quiz.id}" class="btn btn-outline btn-block">View Results</a>
          </div>
        </div>
      `,
        )
        .join("")
    }
  }
})

