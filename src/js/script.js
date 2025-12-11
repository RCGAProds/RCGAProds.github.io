//<!-- ===================== Modal System ===================== -->
// Get DOM elements
var modal = document.getElementById("myModal")
var links = document.querySelectorAll(".openModalLink")

let isModalClosing = false

// Open the modal when any link is clicked
links.forEach(function (link) {
  link.onclick = function (event) {
    if (!isModalClosing) {
      event.preventDefault() // Prevent the default behavior of the link
      modal.style.display = "flex"

      // Force reflow to restart the animation
      void modal.querySelector(".modal-content").offsetWidth

      modal.querySelector(".modal-content").classList.add("show")
    }
  }
})

// Close the modal when clicking the X
// Close the modal when clicking outside the modal content
// Functions in the Projects JS

// Function to close the modal
function closeModal() {
  var content = modal.querySelector(".modal-content")
  content.classList.remove("show")

  setTimeout(() => {
    modal.style.display = "none"
  }, 500) // The time must match the duration of the animation.
}

//<!-- ===================== CopyText ===================== -->
// Get the paragraph element
const textElements = document.querySelectorAll(".textToCopy")

textElements.forEach(textElement => {
  const messageElement = document.getElementById(
    "copyText" + textElement.id.replace("copy", ""),
  )

  let hideTimeout

  // Add event listener for clicks
  textElement.addEventListener("click", function () {
    // Get the text content of the <p> element
    const textToCopy = textElement.textContent

    // Copy the text to the clipboard using the Clipboard API
    navigator.clipboard
      .writeText(textToCopy)
      .then(function () {
        // Show confirmation message
        messageElement.style.display = "inline-block"

        messageElement.classList.remove("scale-up")

        void messageElement.offsetWidth

        messageElement.classList.add("scale-up")

        clearTimeout(hideTimeout)

        hideTimeout = setTimeout(() => {
          messageElement.style.display = "none"
        }, 2500)
      })
      .catch(function (err) {
        console.error("Error copying text: ", err)
      })
  })
})

//<!-- ===================== Sweet Animations ===================== -->
function setupSweetAnimations() {
  document.querySelectorAll(".sweet_anim").forEach(item => {
    item.addEventListener("mouseenter", () => {
      if (item.classList.contains("certificates__item")) {
        item.style.animation = "moveUpDown 1s ease-in-out infinite"
      }
    })

    item.addEventListener("mouseleave", () => {
      const computedStyle = getComputedStyle(item)
      const transformValue = computedStyle.transform

      item.style.animation = "none"
      item.style.transform = transformValue

      setTimeout(() => {
        if (item.classList.contains("certificates__item")) {
          item.style.transition = "transform 0.3s ease-in-out"
          item.style.transform = "translateY(0)"
        }
      }, 10)
    })
  })
}

// Initial call
setupSweetAnimations()

// Call back after the carousel clones the items
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    setupSweetAnimations()
  }, 100)
})

//<!-- ===================== Modal Projects ===================== -->

const projectsModals = document.querySelectorAll(".projects__model")
const imgCards = document.querySelectorAll(".img__card")
const closeBtns = document.querySelectorAll(".close")

var projectsModal = function (modalClick) {
  if (!isModalClosing) {
    projectsModals[modalClick].classList.add("active")
    projectsModals[modalClick].style.pointerEvents = "auto"

    document.body.style.overflow = "hidden"
  }
}

imgCards.forEach((imgCard, i) => {
  imgCard.addEventListener("click", () => {
    projectsModal(i)
  })
})

closeBtns.forEach(closeBtn => {
  closeBtn.onclick = function () {
    closePortModal()
    closeModal()
  }
})

window.onclick = function (event) {
  // Close the modal when clicking outside the modal content
  if (event.target == modal) {
    closeModal()
    isModalClosing = true
    setTimeout(() => {
      isModalClosing = false
    }, 300)
  }
  // Close the projectsModals when clicking outside the modal content
  projectsModals.forEach(projectsModalView => {
    if (
      event.target === projectsModalView &&
      projectsModalView.classList.contains("active")
    ) {
      closePortModal()
      isModalClosing = true
      setTimeout(() => {
        isModalClosing = false
      }, 300)
    }
  })
}

window.addEventListener("touchstart", function (event) {
  if (event.target == modal) {
    closeModal()
    isModalClosing = true
    setTimeout(() => {
      isModalClosing = false
    }, 300)
  }

  projectsModals.forEach(projectsModalView => {
    if (
      event.target === projectsModalView &&
      projectsModalView.classList.contains("active")
    ) {
      closePortModal()
      isModalClosing = true
      setTimeout(() => {
        isModalClosing = false
      }, 300)
    }
  })
})

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePortModal()
    closeModal()
  }
})

function closePortModal() {
  projectsModals.forEach(projectsModalView => {
    projectsModalView.classList.remove("active")
    projectsModalView.style.pointerEvents = "none"
  })

  document.body.style.overflow = "auto"
}

//<!-- ===================== Infinite Carousel ===================== -->
class InfiniteCarousel {
  constructor(
    carouselSelector,
    prevBtnSelector,
    nextBtnSelector,
    itemsPerView = 4,
  ) {
    this.carousel = document.querySelector(carouselSelector)
    this.prevBtn = document.querySelector(prevBtnSelector)
    this.nextBtn = document.querySelector(nextBtnSelector)
    this.originalItems = Array.from(
      this.carousel.querySelectorAll(".carousel__item"),
    )
    this.itemsPerView = itemsPerView
    this.currentIndex = 0
    this.itemWidth = 0
    this.gap = 0
    this.isAnimating = false

    this.init()
  }

  init() {
    this.duplicateItems()
    this.updateDimensions()
    this.attachEventListeners()
    this.setInitialPosition()

    window.addEventListener("resize", () => {
      this.updateDimensions()
      this.setInitialPosition()
    })
  }

  duplicateItems() {
    // Clean up previous clones if they exist
    const allItems = Array.from(this.carousel.children)
    allItems.forEach(item => {
      if (item.dataset.clone) {
        item.remove()
      }
    })

    // Save original items
    this.originalItems = Array.from(
      this.carousel.querySelectorAll(".carousel__item:not([data-clone])"),
    )

    // Add clones at the end
    this.originalItems.forEach(item => {
      const clone = item.cloneNode(true)
      clone.dataset.clone = "end"
      this.carousel.appendChild(clone)
    })

    // Add clones at the beginning
    for (let i = this.originalItems.length - 1; i >= 0; i--) {
      const clone = this.originalItems[i].cloneNode(true)
      clone.dataset.clone = "start"
      this.carousel.insertBefore(clone, this.carousel.firstChild)
    }
  }

  updateDimensions() {
    // Update items per view based on screen size
    if (window.innerWidth <= 568) {
      this.itemsPerView = 2
    } else if (window.innerWidth <= 767) {
      this.itemsPerView = 3
    } else {
      this.itemsPerView = 4
    }

    // Get the actual CSS gap (1rem)
    const computedStyle = getComputedStyle(this.carousel)
    this.gap = parseFloat(computedStyle.gap) || 16

    // Calculate item width based on the first actual item
    const firstItem = this.carousel.querySelector(
      ".carousel__item:not([data-clone])",
    )
    if (firstItem) {
      const itemRect = firstItem.getBoundingClientRect()
      this.itemWidth = itemRect.width
    }
  }

  setInitialPosition() {
    // Disable transition for initial positioning
    this.carousel.style.transition = "none"

    // Start from the first original item (after the initial clones)
    this.currentIndex = this.originalItems.length

    // Calculate and apply position
    const offsetX = this.currentIndex * (this.itemWidth + this.gap)
    this.carousel.style.transform = `translateX(-${offsetX}px)`

    // Force reflow to ensure it is applied before reactivating transitions
    void this.carousel.offsetWidth
  }

  move(direction) {
    if (this.isAnimating) return

    this.isAnimating = true
    const totalOriginalItems = this.originalItems.length

    this.currentIndex += direction

    // Apply motion with transition
    const offsetX = this.currentIndex * (this.itemWidth + this.gap)
    this.carousel.style.transition =
      "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
    this.carousel.style.transform = `translateX(-${offsetX}px)`

    // Handle infinite loop after animation
    setTimeout(() => {
      // If we reach the end of the clones (moving forward)
      if (this.currentIndex >= totalOriginalItems * 2) {
        this.resetToPosition(totalOriginalItems)
      }
      // If we go back to the beginning of the clones (going backwards)
      else if (this.currentIndex < totalOriginalItems) {
        this.resetToPosition(totalOriginalItems + this.currentIndex)
      }

      this.isAnimating = false
    }, 500)
  }

  resetToPosition(newIndex) {
    this.carousel.style.transition = "none"

    this.currentIndex = newIndex

    const offsetX = this.currentIndex * (this.itemWidth + this.gap)
    this.carousel.style.transform = `translateX(-${offsetX}px)`

    void this.carousel.offsetWidth
  }

  attachEventListeners() {
    this.prevBtn.addEventListener("click", () => this.move(-1))
    this.nextBtn.addEventListener("click", () => this.move(1))

    // Prevent clicks during animation
    const preventClick = e => {
      if (this.isAnimating) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    this.prevBtn.addEventListener("click", preventClick, true)
    this.nextBtn.addEventListener("click", preventClick, true)
  }
}

// Initialize carousel when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const carousel = new InfiniteCarousel(
    "#certificatesCarousel",
    ".carousel__button--prev",
    ".carousel__button--next",
    4,
  )
})
