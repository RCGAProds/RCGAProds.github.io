// Translations
const translations = {
  en: {
    title: "Cybersecurity Terms Quiz",
    selectAnswer: "Select the correct description:",
    check: "Check Answer",
    next: "Next Term",
    correct: "Correct!",
    incorrect: "Incorrect. The correct answer is:",
    langLabel: "Language:",
    loading: "Loading terms...",
    errorLoading: "Error loading terms. Please try again later.",
  },
  es: {
    title: "Cuestionario de Términos de Ciberseguridad",
    selectAnswer: "Selecciona la descripción correcta:",
    check: "Comprobar Respuesta",
    next: "Siguiente Término",
    correct: "¡Correcto!",
    incorrect: "Incorrecto. La respuesta correcta es:",
    langLabel: "Idioma:",
    loading: "Cargando términos...",
    errorLoading:
      "Error al cargar los términos. Por favor, inténtalo de nuevo más tarde.",
  },
}

// Initial database of cybersecurity terms
let termsDatabase = []

// App state
let currentTerm = null
let options = []
let selectedOption = null
let isCorrect = null
let currentLanguage = "en"

// DOM Elements
const quizContent = document.getElementById("quizContent")
const addTermForm = document.getElementById("addTermForm")
const termContainer = document.getElementById("termContainer")
const currentTermEl = document.getElementById("currentTerm")
const optionsContainer = document.getElementById("optionsContainer")
const feedbackContainer = document.getElementById("feedbackContainer")
const checkButton = document.getElementById("checkButton")
const nextButton = document.getElementById("nextButton")
const languageSelect = document.getElementById("languageSelect")

// Form elements
const newTermInput = document.getElementById("newTerm")
const newCorrectDescInput = document.getElementById("newCorrectDesc")
const newWrongDesc1Input = document.getElementById("newWrongDesc1")
const newWrongDesc2Input = document.getElementById("newWrongDesc2")

// Get text elements
const titleEl = document.getElementById("title")
const selectAnswerText = document.getElementById("selectAnswerText")
const langLabel = document.getElementById("langLabel")
const termLabel = document.getElementById("termLabel")
const correctDescLabel = document.getElementById("correctDescLabel")
const wrongDesc1Label = document.getElementById("wrongDesc1Label")
const wrongDesc2Label = document.getElementById("wrongDesc2Label")

// Initialize the app
function init() {
  // Set up event listeners
  checkButton.addEventListener("click", checkAnswer)
  nextButton.addEventListener("click", getRandomTerm)
  languageSelect.addEventListener("change", changeLanguage)

  // Set initial language
  updateLanguageText()

  loadFromLocalStorage()

  if (termsDatabase.length === 0) {
    loadFromExternalJSON()
  } else {
    getRandomTerm()
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

// Get a random term and set up options
function getRandomTerm() {
  if (termsDatabase.length === 0) return

  const randomIndex = Math.floor(Math.random() * termsDatabase.length)
  currentTerm = termsDatabase[randomIndex]

  // Check if the term is valid
  if (!currentTerm || !currentTerm.term) {
    getRandomTerm()
    return
  }

  // Check one randomly correct description
  const correctDescriptions = Array.isArray(currentTerm.correctDescriptions)
    ? currentTerm.correctDescriptions.filter(desc => desc && desc.trim() !== "")
    : [currentTerm.correctDescriptions].filter(
        desc => desc && desc.trim() !== "",
      )

  if (correctDescriptions.length === 0) {
    console.error("Term has no valid correct descriptions:", currentTerm.term)
    // Try another term or add a default description
    correctDescriptions.push("Default correct description")
  }

  const randomCorrectIndex = Math.floor(
    Math.random() * correctDescriptions.length,
  )

  currentTerm.selectedCorrectDescriptions =
    correctDescriptions[randomCorrectIndex]

  // Filter out empty wrong descriptions
  const validWrongDescriptions = Array.isArray(currentTerm.wrongDescriptions)
    ? currentTerm.wrongDescriptions.filter(desc => desc && desc.trim() !== "")
    : []

  // Ensure we have at least two valid wrong descriptions
  if (validWrongDescriptions.length < 2) {
    const defaultWrongDescriptions = [
      `Default wrong answer`,
      `Default wrong answer`,
    ]

    const neededCount = 2 - validWrongDescriptions.length
    for (let i = 0; i < neededCount; i++) {
      validWrongDescriptions.push(defaultWrongDescriptions[i])
    }
  }

  // Create an array with all descriptions and shuffle them
  options = [
    currentTerm.selectedCorrectDescriptions,
    ...validWrongDescriptions.slice(0, 2),
  ]

  // Fisher-Yates shuffle algorithm
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  // Reset state
  selectedOption = null
  isCorrect = null

  // Update UI
  currentTermEl.textContent = currentTerm.term
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

  isCorrect = selectedOption === currentTerm.selectedCorrectDescriptions

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
    correctAnswer.textContent = currentTerm.correctDescriptions
    feedbackContainer.appendChild(correctAnswer)
  }
}

// Hide feedback
function hideFeedback() {
  feedbackContainer.classList.add("hidden")
}

// Show check button
function showCheckButton() {
  checkButton.classList.remove("hidden")
}

// Hide check button
function hideCheckButton() {
  checkButton.classList.add("hidden")
}

// Show next button
function showNextButton() {
  nextButton.classList.remove("hidden")
}

// Hide next button
function hideNextButton() {
  nextButton.classList.add("hidden")
}

// Load terms from local storage (optional, can be enabled/disabled
function loadFromLocalStorage() {
  const savedTerms = localStorage.getItem("cybersecurityTerms")
  if (savedTerms) {
    termsDatabase = JSON.parse(savedTerms)
  }
}

function loadFromExternalJSON() {
  const loadingMessage = document.createElement("p")
  loadingMessage.id = "loadingMessage"
  loadingMessage.textContent = translations[currentLanguage].loading
  document.body.appendChild(loadingMessage)

  fetch("cybersecurityTerms.json")
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

      // Assign data to termsDatabase
      termsDatabase = data

      // Start the quiz with a random term
      getRandomTerm()
    })
    .catch(error => {
      console.error("Error loading terms from JSON file:", error)

      // Remove loading message
      const loadingMsg = document.getElementById("loadingMessage")
      if (loadingMsg) {
        loadingMsg.textContent = translations[currentLanguage].errorLoading
      }

      // Try loading from localStorage as fallback
      loadFromLocalStorage()

      // If still no terms, add a default term so app can function
      if (termsDatabase.length === 0) {
        loadDefaultTerms()
      }

      // Start the quiz with whatever we have
      getRandomTerm()
    })
}

// Start the app
document.addEventListener("DOMContentLoaded", init)
