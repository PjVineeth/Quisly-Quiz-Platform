// Common JavaScript functionality for all pages

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const htmlElement = document.documentElement

  if (themeToggle) {
    themeToggle.addEventListener("click", function (e) {
      e.stopPropagation()
      const dropdown = this.nextElementSibling
      dropdown.classList.toggle("open")
    })

    // Theme options
    const themeOptions = document.querySelectorAll("[data-theme]")
    themeOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault()
        const theme = this.getAttribute("data-theme")

        if (theme === "dark") {
          htmlElement.classList.add("dark-theme")
          localStorage.setItem("theme", "dark")
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
        } else if (theme === "light") {
          htmlElement.classList.remove("dark-theme")
          localStorage.setItem("theme", "light")
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
        } else {
          // System preference
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          if (prefersDark) {
            htmlElement.classList.add("dark-theme")
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
          } else {
            htmlElement.classList.remove("dark-theme")
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
          }
          localStorage.setItem("theme", "system")
        }

        // Close dropdown
        this.closest(".dropdown-menu").classList.remove("open")
      })
    })

    // Set initial theme
    const savedTheme = localStorage.getItem("theme") || "system"
    if (savedTheme === "dark") {
      htmlElement.classList.add("dark-theme")
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    } else if (savedTheme === "light") {
      htmlElement.classList.remove("dark-theme")
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        htmlElement.classList.add("dark-theme")
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      }
    }
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const mobileNav = document.getElementById("mobile-nav")

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open")
    })
  }

  // Tabs functionality
  const tabButtons = document.querySelectorAll(".tab-button")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Deactivate all tabs
      document.querySelectorAll(".tab-button").forEach((btn) => {
        btn.classList.remove("active")
      })

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
      })

      // Activate selected tab
      this.classList.add("active")
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    const dropdowns = document.querySelectorAll(".dropdown-menu.open")
    dropdowns.forEach((dropdown) => {
      if (!dropdown.parentElement.contains(e.target)) {
        dropdown.classList.remove("open")
      }
    })
  })

  // Dropdown toggles
  const dropdownToggles = document.querySelectorAll(".dropdown > button")
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation()
      const dropdown = this.nextElementSibling

      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu.open").forEach((menu) => {
        if (menu !== dropdown) {
          menu.classList.remove("open")
        }
      })

      dropdown.classList.toggle("open")
    })
  })
})

// Helper functions
function showAlert(elementId, message, type = "error") {
  const alertElement = document.getElementById(elementId)
  if (alertElement) {
    alertElement.textContent = message
    alertElement.style.display = "block"

    if (type === "success") {
      alertElement.style.backgroundColor = "var(--success)"
    }

    // Auto hide after 5 seconds
    setTimeout(() => {
      alertElement.style.display = "none"
    }, 5000)
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatTimeFromSeconds(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

