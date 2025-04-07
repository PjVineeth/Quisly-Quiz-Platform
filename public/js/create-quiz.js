// Create quiz functionality

document.addEventListener("DOMContentLoaded", () => {
  const createQuizForm = document.getElementById("create-quiz-form")
  const addQuestionBtn = document.getElementById("add-question-btn")
  const questionsContainer = document.getElementById("questions-container")
  const saveQuizBtn = document.getElementById("save-quiz-btn")

  let questionCount = 1

  if (createQuizForm && addQuestionBtn) {
    // Add question button click handler
    addQuestionBtn.addEventListener("click", () => {
      questionCount++

      const questionCard = document.createElement("div")
      questionCard.className = "card question-card"
      questionCard.dataset.questionId = `q${questionCount}`

      questionCard.innerHTML = `
        <div class="card-header">
          <div class="question-header">
            <h2 class="card-title">Question ${questionCount}</h2>
            <button type="button" class="btn btn-icon remove-question-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="card-content">
          <div class="form-group">
            <label for="q${questionCount}-type">Question Type</label>
            <select id="q${questionCount}-type" name="questions[${questionCount - 1}].type" class="question-type-select">
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="numerical">Numerical</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="q${questionCount}-text">Question Text</label>
            <textarea id="q${questionCount}-text" name="questions[${questionCount - 1}].text" placeholder="Enter your question here" required></textarea>
          </div>
          
          <div class="question-options" id="q${questionCount}-options-container">
            <div class="form-group">
              <label>Options</label>
              <div class="option-items">
                <div class="option-item">
                  <input type="text" name="questions[${questionCount - 1}].options[0]" placeholder="Option 1" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionCount - 1}].options[1]" placeholder="Option 2" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionCount - 1}].options[2]" placeholder="Option 3" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionCount - 1}].options[3]" placeholder="Option 4" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
              </div>
            </div>
            <input type="hidden" name="questions[${questionCount - 1}].correctAnswer" id="q${questionCount}-correct-answer">
          </div>
        </div>
      `

      questionsContainer.appendChild(questionCard)

      // Add event listeners to the new question
      setupQuestionEventListeners(questionCard)
    })

    // Setup event listeners for initial question
    setupQuestionEventListeners(document.querySelector(".question-card"))

    // Form submission
    createQuizForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate form
      const title = document.getElementById("title").value
      if (!title) {
        alert("Please enter a quiz title")
        return
      }

      // Check if all questions have correct answers
      const questions = document.querySelectorAll(".question-card")
      let valid = true

      questions.forEach((question) => {
        const questionId = question.dataset.questionId
        const questionType = document.getElementById(`${questionId}-type`).value
        const correctAnswer = document.getElementById(`${questionId}-correct-answer`).value

        if (!correctAnswer && (questionType === "multiple-choice" || questionType === "true-false")) {
          valid = false
          alert(`Please set a correct answer for Question ${questionId.substring(1)}`)
        }
      })

      if (!valid) return

      // Disable button and show loading state
      saveQuizBtn.disabled = true
      saveQuizBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'

      // Simulate API call
      setTimeout(() => {
        // In a real app, you would submit the form data to the server
        /*
        const formData = new FormData(createQuizForm);
        
        fetch('/api/quizzes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          window.location.href = '/teacher/dashboard.html';
        })
        .catch(error => {
          console.error('Error creating quiz:', error);
          saveQuizBtn.disabled = false;
          saveQuizBtn.innerHTML = '<i class="fas fa-save"></i> Save Quiz';
        });
        */

        // For demo, just redirect
        window.location.href = "/teacher/dashboard.html"
      }, 1500)
    })
  }

  // Setup event listeners for question card
  function setupQuestionEventListeners(questionCard) {
    const questionId = questionCard.dataset.questionId
    const typeSelect = questionCard.querySelector(".question-type-select")
    const optionsContainer = questionCard.querySelector(".question-options")
    const correctAnswerInput = questionCard.querySelector(`#${questionId}-correct-answer`)
    const removeBtn = questionCard.querySelector(".remove-question-btn")

    // Question type change handler
    typeSelect.addEventListener("change", function () {
      const questionType = this.value

      switch (questionType) {
        case "multiple-choice":
          optionsContainer.innerHTML = `
            <div class="form-group">
              <label>Options</label>
              <div class="option-items">
                <div class="option-item">
                  <input type="text" name="questions[${questionId.substring(1) - 1}].options[0]" placeholder="Option 1" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionId.substring(1) - 1}].options[1]" placeholder="Option 2" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionId.substring(1) - 1}].options[2]" placeholder="Option 3" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionId.substring(1) - 1}].options[3]" placeholder="Option 4" class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
              </div>
            </div>
            <input type="hidden" name="questions[${questionId.substring(1) - 1}].correctAnswer" id="${questionId}-correct-answer">
          `
          break

        case "true-false":
          optionsContainer.innerHTML = `
            <div class="form-group">
              <label>Options</label>
              <div class="option-items">
                <div class="option-item">
                  <input type="text" name="questions[${questionId.substring(1) - 1}].options[0]" value="True" readonly class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
                <div class="option-item">
                  <input type="text" name="questions[${questionId.substring(1) - 1}].options[1]" value="False" readonly class="option-input">
                  <button type="button" class="btn btn-sm option-correct-btn">Set Correct</button>
                </div>
              </div>
            </div>
            <input type="hidden" name="questions[${questionId.substring(1) - 1}].correctAnswer" id="${questionId}-correct-answer">
          `
          break

        case "numerical":
          optionsContainer.innerHTML = `
            <div class="form-group">
              <label for="${questionId}-correct-numerical">Correct Answer (Number)</label>
              <input type="number" id="${questionId}-correct-numerical" name="questions[${questionId.substring(1) - 1}].correctAnswer" placeholder="Enter the correct numerical answer" class="numerical-input">
            </div>
          `

          // Add event listener to numerical input
          setTimeout(() => {
            const numericalInput = document.getElementById(`${questionId}-correct-numerical`)
            numericalInput.addEventListener("input", function () {
              correctAnswerInput.value = this.value
            })
          }, 0)
          break

        case "short-answer":
          optionsContainer.innerHTML = `
            <div class="form-group">
              <label for="${questionId}-correct-text">Correct Answer</label>
              <input type="text" id="${questionId}-correct-text" name="questions[${questionId.substring(1) - 1}].correctAnswer" placeholder="Enter the correct answer" class="text-input">
              <p class="form-hint">Student answers will be marked correct if they match this exactly (case insensitive).</p>
            </div>
          `

          // Add event listener to text input
          setTimeout(() => {
            const textInput = document.getElementById(`${questionId}-correct-text`)
            textInput.addEventListener("input", function () {
              correctAnswerInput.value = this.value
            })
          }, 0)
          break
      }

      // Add event listeners to option correct buttons
      setTimeout(() => {
        const optionButtons = questionCard.querySelectorAll(".option-correct-btn")
        optionButtons.forEach((button) => {
          button.addEventListener("click", function () {
            // Remove active class from all buttons
            optionButtons.forEach((btn) => btn.classList.remove("active"))

            // Add active class to clicked button
            this.classList.add("active")

            // Set correct answer
            const optionInput = this.previousElementSibling
            correctAnswerInput.value = optionInput.value
          })
        })
      }, 0)
    })

    // Remove question button
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        if (document.querySelectorAll(".question-card").length > 1) {
          questionCard.remove()

          // Update question numbers
          document.querySelectorAll(".question-card").forEach((card, index) => {
            card.querySelector(".card-title").textContent = `Question ${index + 1}`
          })
        } else {
          alert("You cannot remove the only question. A quiz must have at least one question.")
        }
      })
    }

    // Add event listeners to option correct buttons
    const optionButtons = questionCard.querySelectorAll(".option-correct-btn")
    optionButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons in this question
        questionCard.querySelectorAll(".option-correct-btn").forEach((btn) => {
          btn.classList.remove("active")
        })

        // Add active class to clicked button
        this.classList.add("active")

        // Set correct answer
        const optionInput = this.previousElementSibling
        correctAnswerInput.value = optionInput.value
      })
    })
  }
})

