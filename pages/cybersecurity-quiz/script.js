// Translations
const translations = {
  en: {
    title: "Cybersecurity Quiz",
    selectAnswer: "Select the correct description:",
    check: "Check Answer",
    next: "Next",
    correct: "Correct!",
    incorrect: "Incorrect. The correct answer is:",
    langLabel: "Language:",
    loading: "Loading...",
    errorLoading: "Error loading. Please try again later.",
  },
  es: {
    title: "Cuestionario de Ciberseguridad",
    selectAnswer: "Selecciona la descripción correcta:",
    check: "Comprobar Respuesta",
    next: "Siguiente",
    correct: "¡Correcto!",
    incorrect: "Incorrecto. La respuesta correcta es:",
    langLabel: "Idioma:",
    loading: "Cargando...",
    errorLoading: "Error al cargar. Por favor, inténtalo de nuevo más tarde.",
  },
}

// Initial database of cybersecurity quizs
let quizDatabase = []

// App state
let currentQuiz = null
let options = []
let selectedOption = null
let isCorrect = null
let currentLanguage = "en"
let totalOptions = 4

// DOM Elements
const quizContent = document.getElementById("quizContent")
const currentQuizEl = document.getElementById("currentQuiz")
const optionsContainer = document.getElementById("optionsContainer")
const feedbackContainer = document.getElementById("feedbackContainer")
const checkButton = document.getElementById("checkButton")
const nextButton = document.getElementById("nextButton")
const languageSelect = document.getElementById("languageSelect")

// Get text elements
const titleEl = document.getElementById("title")
const selectAnswerText = document.getElementById("selectAnswerText")
const langLabel = document.getElementById("langLabel")

// Initialize the app
function init() {
  // Set up event listeners
  checkButton.addEventListener("click", checkAnswer)
  nextButton.addEventListener("click", getRandomQuiz)
  languageSelect.addEventListener("change", changeLanguage)

  // Set initial language
  updateLanguageText()

  loadFromLocalStorage()

  if (quizDatabase.length === 0) {
    loadFromExternalJSON()
  } else {
    getRandomQuiz()
  }
}

// Update all text based on current language
function updateLanguageText() {
  const t = translations[currentLanguage]

  // Update UI text
  titleEl.textContent = t.title
  selectAnswerText.textContent = t.selectAnswer
  checkButton.textContent = t.check
  nextButton.textContent = t.next
  langLabel.textContent = t.langLabel

  // Update feedback if shown
  if (!feedbackContainer.classList.contains("hidden")) {
    updateFeedbackText()
  }
}

// Change language
function changeLanguage(e) {
  currentLanguage = e.target.value
  updateLanguageText()
}

// Utilidad para mostrar/ocultar elementos
function toggleVisibility(element, show = true) {
  element.classList.toggle("hidden", !show)
}

// Hide feedback
function hideFeedback() {
  toggleVisibility(feedbackContainer, false)
}

// Show check button
function showCheckButton() {
  toggleVisibility(checkButton, true)
}

// Hide check button
function hideCheckButton() {
  toggleVisibility(checkButton, false)
}

// Show next button
function showNextButton() {
  toggleVisibility(nextButton, true)
}

// Hide next button
function hideNextButton() {
  toggleVisibility(nextButton, false)
}

// Get a random quiz and set up options
function getRandomQuiz() {
  if (quizDatabase.length === 0) return

  // Check if the quiz is valid
  const validQuiz = quizDatabase.filter(q => q && q.quiz)
  if (validQuiz.length === 0) return

  const randomIndex = Math.floor(Math.random() * validQuiz.length)
  currentQuiz = validQuiz[randomIndex]

  // Check one randomly correct description
  const correctDescriptions = Array.isArray(currentQuiz.correctDescriptions)
    ? currentQuiz.correctDescriptions.filter(desc => desc && desc.trim() !== "")
    : [currentQuiz.correctDescriptions].filter(
        desc => desc && desc.trim() !== "",
      )

  if (correctDescriptions.length === 0) {
    console.error("Quiz has no valid correct descriptions:", currentQuiz.quiz)
    correctDescriptions.push("Default correct description")
  }

  const randomCorrectIndex = Math.floor(
    Math.random() * correctDescriptions.length,
  )

  currentQuiz.selectedCorrectDescriptions =
    correctDescriptions[randomCorrectIndex]

  // Filter out empty wrong descriptions
  const validWrongDescriptions = Array.isArray(currentQuiz.wrongDescriptions)
    ? currentQuiz.wrongDescriptions.filter(desc => desc && desc.trim() !== "")
    : []

  // Calculate how many wrong options are needed
  const neededWrong = totalOptions - 1

  // If there are not enough wrong descriptions, fill with default answers
  if (validWrongDescriptions.length < neededWrong) {
    const defaultWrongDescriptions = Array(neededWrong).fill(
      "Default wrong answer",
    )
    const neededCount = neededWrong - validWrongDescriptions.length
    for (let i = 0; i < neededCount; i++) {
      validWrongDescriptions.push(defaultWrongDescriptions[i])
    }
  }

  // Shuffle and select the needed number of wrong options
  const wrongOptions = validWrongDescriptions
    .sort(() => Math.random() - 0.5)
    .slice(0, neededWrong)

  // Ensure the correct answer is included
  options = [currentQuiz.selectedCorrectDescriptions, ...wrongOptions]

  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  // Reset state
  selectedOption = null
  isCorrect = null

  // Update UI
  currentQuizEl.textContent = currentQuiz.quiz
  renderOptions()
  hideFeedback()
  hideNextButton()
  showCheckButton()

  // Disable check button initially
  checkButton.classList.add("disabled")
}

// Render the options
function renderOptions() {
  optionsContainer.innerHTML = ""

  options.forEach((option, index) => {
    if (!option || option.trim() === "") {
      return
    }

    const optionEl = document.createElement("div")
    optionEl.className = "option"
    optionEl.textContent = option
    optionEl.addEventListener("click", () => selectOption(option, optionEl))
    optionsContainer.appendChild(optionEl)
  })
}

// Select an option
function selectOption(option, optionEl) {
  // Remove selected class from all options
  const allOptions = document.querySelectorAll(".option")
  allOptions.forEach(el => el.classList.remove("selected"))

  // Add selected class to clicked option
  optionEl.classList.add("selected")

  // Update selected option
  selectedOption = option

  // Enable check button
  checkButton.classList.remove("disabled")
}

// Check the answer
function checkAnswer() {
  if (!selectedOption || checkButton.classList.contains("disabled")) return

  isCorrect = selectedOption === currentQuiz.selectedCorrectDescriptions

  // Show feedback
  showFeedback()

  // Hide check button and show next button
  hideCheckButton()
  showNextButton()
}

// Show feedback
function showFeedback() {
  feedbackContainer.classList.remove("hidden")

  if (isCorrect) {
    feedbackContainer.classList.add("correct")
    feedbackContainer.classList.remove("incorrect")
  } else {
    feedbackContainer.classList.add("incorrect")
    feedbackContainer.classList.remove("correct")
  }

  updateFeedbackText()
}

// Update feedback text based on language
function updateFeedbackText() {
  const t = translations[currentLanguage]

  feedbackContainer.innerHTML = ""

  if (isCorrect) {
    const feedbackText = document.createElement("p")
    feedbackText.textContent = t.correct
    feedbackContainer.appendChild(feedbackText)
  } else {
    const feedbackText = document.createElement("p")
    feedbackText.textContent = t.incorrect
    feedbackContainer.appendChild(feedbackText)

    const correctAnswer = document.createElement("p")
    correctAnswer.className = "feedback-description"
    correctAnswer.textContent = currentQuiz.selectedCorrectDescriptions
    feedbackContainer.appendChild(correctAnswer)
  }
}

// Load quiz from local storage (optional, can be enabled/disabled
function loadFromLocalStorage() {
  const savedQuiz = localStorage.getItem("cybersecurityQuiz")
  if (savedQuiz) {
    quizDatabase = JSON.parse(savedQuiz)
  }
}

function loadFromExternalJSON() {
  const loadingMessage = document.createElement("p")
  loadingMessage.id = "loadingMessage"
  loadingMessage.textContent = translations[currentLanguage].loading
  document.body.appendChild(loadingMessage)

  fetch("cybersecurityQuiz.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      // Remove loading message
      const loadingMsg = document.getElementById("loadingMessage")
      if (loadingMsg) loadingMsg.remove()

      // Assign data to quizDatabase
      quizDatabase = data

      // Start the quiz with a random quiz
      getRandomQuiz()
    })
    .catch(error => {
      console.error("Error loading Quiz from JSON file:", error)

      // Remove loading message
      const loadingMsg = document.getElementById("loadingMessage")
      if (loadingMsg) {
        loadingMsg.textContent = translations[currentLanguage].errorLoading
      }

      // Try loading from localStorage as fallback
      loadFromLocalStorage()

      // If still no quiz, add a default quiz so app can function
      if (quizDatabase.length === 0) {
        loadDefaultQuiz()
      }

      // Start the quiz with whatever we have
      getRandomQuiz()
    })
}

// Start the app
document.addEventListener("DOMContentLoaded", init)
