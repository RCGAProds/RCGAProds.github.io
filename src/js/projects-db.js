//<!-- ===================== PROJECTS DATABASE ===================== -->
/**
 * Projects Database
 * Add, remove or modify projects here
 * Each project requires: id, title, description, technologies, image, liveUrl, repoUrl, status
 */
const projectsData = [
  {
    id: "monkeytype-clone",
    title: "MonkeyType Clone",
    description:
      "A typing speed test application that tracks WPM and accuracy. Built with vanilla JavaScript for optimal performance.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "src/assets/img/projects/MonkeyTypeClone.webp",
    liveUrl: "https://rcgaprods.github.io/typing-test-web/",
    repoUrl: "https://github.com/RCGAProds/typing-test-web",
    status: "completed",
  },
  {
    id: "audiovisual-portfolio",
    title: "Audiovisual Portfolio",
    description:
      "A collection of multimedia projects including video editing, 2D animation, and 3D design work using industry-standard tools.",
    technologies: [
      "Photoshop",
      "Premiere Pro",
      "After Effects",
      "3ds Max",
      "Unity3D",
    ],
    image: "src/assets/img/projects/Audiovisual.webp",
    liveUrl: null,
    repoUrl:
      "https://drive.google.com/drive/folders/1aUc9cJUqQYQEA6biTl-L2u5bHCKQyqU4?usp=sharing",
    status: "completed",
  },
  {
    id: "security-dashboard",
    title: "Security Operations Dashboard",
    description:
      "A comprehensive SIEM dashboard for monitoring security events and incidents in real-time. Features custom detection rules and automated alerting.",
    technologies: ["Python", "Splunk", "React", "ElasticStack"],
    image: "src/assets/img/icon.png",
    liveUrl: null,
    repoUrl: "https://github.com/RCGAProds",
    status: "in-progress",
  },
  {
    id: "threat-intel-tool",
    title: "Threat Intelligence Aggregator",
    description:
      "An automated tool for collecting and analyzing threat intelligence from multiple sources. Integrates with MISP and OpenCTI.",
    technologies: ["Python", "MISP", "OpenCTI", "API Integration"],
    image: "src/assets/img/icon.png",
    liveUrl: null,
    repoUrl: "https://github.com/RCGAProds",
    status: "in-progress",
  },
]

/**
 * Render projects into the carousel
 */
function renderProjects() {
  const carousel = document.getElementById("projectsCarousel")
  if (!carousel) return

  // Clear carousel
  carousel.innerHTML = ""

  // Generate HTML for each project
  projectsData.forEach(project => {
    const isInProgress = project.status === "in-progress"
    const classes = `project__item carousel__item ${
      isInProgress ? "work-in-progress" : ""
    }`

    const techStack = project.technologies.join(" · ")
    const statusLabel = isInProgress ? "In Development" : "View Project"

    const html = `
      <div class="${classes}" data-project-id="${project.id}">
        <div class="project__image-wrapper">
          <img
            src="${project.image}"
            alt="${project.title}"
            class="project__img"
            loading="lazy"
          />
          <div class="project__overlay">
            <div class="project__overlay-content">
              ${
                !isInProgress
                  ? '<span class="project__view-text">Click to view details</span>'
                  : '<span class="project__wip-text">Work in Progress</span>'
              }
            </div>
          </div>
        </div>
        <div class="project__content">
          <h3 class="project__title">${project.title}</h3>
          <p class="project__description">${project.description}</p>
          <p class="project__tech">${techStack}</p>
        </div>
      </div>
    `

    carousel.innerHTML += html
  })

  // Attach click handlers after rendering
  attachProjectClickHandlers()
}

/**
 * Attach click handlers to project items
 */
function attachProjectClickHandlers() {
  const projectItems = document.querySelectorAll(
    ".project__item:not(.work-in-progress)",
  )

  projectItems.forEach(item => {
    item.addEventListener("click", function () {
      const projectId = this.dataset.projectId
      const project = projectsData.find(p => p.id === projectId)
      if (project) {
        openProjectModal(project)
      }
    })
  })
}

/**
 * Open project modal with details
 */
function openProjectModal(project) {
  const modal = document.getElementById("projectModal")
  const modalContent = modal.querySelector(".project-modal__content")

  const buttonsHtml = `
    <div class="project-modal__buttons">
      ${
        project.liveUrl
          ? `
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-modal__button project-modal__button--primary">
          <i class="uil uil-eye"></i> View Live
        </a>
      `
          : ""
      }
      ${
        project.repoUrl
          ? `
        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-modal__button project-modal__button--secondary">
          <i class="uil uil-github"></i> View Code
        </a>
      `
          : ""
      }
    </div>
  `

  modalContent.innerHTML = `
    <span class="project-modal__close">&times;</span>
    <div class="project-modal__header">
      <h2 class="project-modal__title">${project.title}</h2>
    </div>
    <div class="project-modal__body">
      <img src="${project.image}" alt="${
    project.title
  }" class="project-modal__image" />
      <p class="project-modal__description">${project.description}</p>
      <div class="project-modal__tech">
        <h4>Technologies Used:</h4>
        <div class="project-modal__tech-list">
          ${project.technologies
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join("")}
        </div>
      </div>
      ${buttonsHtml}
    </div>
  `

  modal.style.display = "flex"
  setTimeout(() => {
    modalContent.classList.add("show")
  }, 10)

  // Close button handler
  const closeBtn = modalContent.querySelector(".project-modal__close")
  closeBtn.addEventListener("click", () => closeProjectModal())
}

/**
 * Close project modal
 */
function closeProjectModal() {
  const modal = document.getElementById("projectModal")
  const modalContent = modal.querySelector(".project-modal__content")

  modalContent.classList.remove("show")
  setTimeout(() => {
    modal.style.display = "none"
  }, 300)
}

// Close modal on outside click
window.addEventListener("click", function (event) {
  const modal = document.getElementById("projectModal")
  if (event.target === modal) {
    closeProjectModal()
  }
})

// Close modal on Escape key
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeProjectModal()
  }
})

// Initialize projects on page load
document.addEventListener("DOMContentLoaded", () => {
  renderProjects()

  // Initialize infinite carousel after rendering projects
  window.projectsCarousel = new InfiniteCarousel(
    "#projectsCarousel",
    ".carousel__button--prev-projects",
    ".carousel__button--next-projects",
    3, // Default items per view
    {
      mobile: 1, // 1 item on mobile
      tablet: 2, // 2 items on tablet
      desktop: 3, // 3 items on desktop
    },
  )
})
