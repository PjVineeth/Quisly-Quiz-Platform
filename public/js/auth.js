// Authentication related functionality

document.addEventListener("DOMContentLoaded", () => {
  // Function to display alerts
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

  // Login form handling
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const loginButton = document.getElementById("login-button")

      // Basic validation
      if (!email || !password) {
        showAlert("login-alert", "Please enter both email and password")
        return
      }

      // Disable button and show loading state
      loginButton.disabled = true
      loginButton.textContent = "Logging in..."

      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Store token
          localStorage.setItem('token', data.token);
          // Redirect based on role
          window.location.href = data.role === 'teacher' 
            ? '/teacher/dashboard.html' 
            : '/student/dashboard.html';
        } else {
          showAlert('login-alert', data.message || 'Login failed');
          loginButton.disabled = false;
          loginButton.textContent = 'Login';
        }
      })
      .catch(error => {
        showAlert('login-alert', 'An error occurred. Please try again.');
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      });
    })
  }

  // Registration form handling
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const role = document.querySelector('input[name="role"]:checked').value
      const registerButton = document.getElementById("register-button")

      // Basic validation
      if (!name || !email || !password) {
        showAlert("register-alert", "Please fill in all fields")
        return
      }

      // Disable button and show loading state
      registerButton.disabled = true
      registerButton.textContent = "Creating account..."

      fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Store token
          localStorage.setItem('token', data.token);
          // Redirect based on role
          window.location.href = role === 'teacher' 
            ? '/teacher/dashboard.html' 
            : '/student/dashboard.html';
        } else {
          showAlert('register-alert', data.message || 'Registration failed');
          registerButton.disabled = false;
          registerButton.textContent = 'Register';
        }
      })
      .catch(error => {
        showAlert('register-alert', 'An error occurred. Please try again.');
        registerButton.disabled = false;
        registerButton.textContent = 'Register';
      });
    })
  }
})

