//<!-- ===================== CERTIFICATES DATABASE ===================== -->
/**
 * Certificates Database
 * Add, remove or modify certificates here
 * Each certificate requires: id, title, provider, date, image, link (null if in progress), status
 */
const certificatesData = [
  {
    id: "soc-level-1",
    title: "SOC Level 1 Learning Path",
    provider: "TryHackMe",
    date: "June 2025",
    image: "src/assets/img/badges/SOCLevel1.webp",
    link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-4Q5RPNZB1V.pdf",
    status: "completed",
  },
  {
    id: "ccst",
    title: "CCST - Cisco Certified Support Technician Cybersecurity",
    provider: "Cisco",
    date: "Oct 2025",
    image: "src/assets/img/badges/CCST.webp",
    link: "https://www.credly.com/badges/7150fd61-1d49-406c-a885-b33acab2c1c3/public_url",
    status: "completed",
  },
  {
    id: "it-specialist",
    title: "IT Specialist - Cybersecurity",
    provider: "Pearson",
    date: "Nov 2025",
    image: "src/assets/img/badges/IT Specialist - Cybersecurity.webp",
    link: "https://www.credly.com/badges/041c7cfd-41d2-4804-a5d9-8248e5bfa129/public_url",
    status: "completed",
  },
  {
    id: "comptia-security",
    title: "CompTIA Security+",
    provider: "Udemy",
    date: "WIP",
    image: "src/assets/img/badges/CompTIA_Security.webp",
    link: null,
    status: "in-progress",
  },
  {
    id: "google-cybersecurity",
    title: "Google Professional Cybersecurity",
    provider: "Coursera",
    date: "WIP",
    image:
      "src/assets/img/badges/Google Professional Certificate Cybersecurity.webp",
    link: null,
    status: "in-progress",
  },
]

/*
 * Render certificates into the carousel
 */

function renderCertificates() {
  const carousel = document.getElementById("certificatesCarousel")
  if (!carousel) return

  // Clear carousel
  carousel.innerHTML = ""

  // Generate HTML for each certificate
  certificatesData.forEach(cert => {
    const isInProgress = cert.status === "in-progress"
    const classes = `certificates__item carousel__item ${
      isInProgress ? "work-in-progress" : ""
    }`
    const dataBefore = isInProgress ? "WIP" : cert.date

    let html = ""

    if (isInProgress) {
      // In progress certificate (no link)
      html = `
        <a
          aria-label="${cert.title}"
          class="${classes}"
          data-before="${dataBefore}"
        >
          <img
            src="${cert.image}"
            alt="${cert.title}"
            class="certificates__img"
          />
          <h3 class="certificates__title" style="font-size: 0.82rem">
            ${cert.title}
          </h3>
          <p class="certificates__subtitle">${cert.provider}</p>
        </a>
      `
    } else {
      // Completed certificate (with link)
      html = `
        <a
          href="${cert.link}"
          target="_blank"
          aria-label="${cert.title}"
          class="${classes} sweet_anim"
          data-before="${dataBefore}"
        >
          <img
            src="${cert.image}"
            alt="${cert.title}"
            class="certificates__img"
          />
          <h3 class="certificates__title" style="font-size: 0.82rem">
            ${cert.title}
          </h3>
          <p class="certificates__subtitle">${cert.provider}</p>
        </a>
      `
    }

    carousel.innerHTML += html
  })
}

// Initialize certificates on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCertificates()

  // Initialize infinite carousel after rendering certificates
  window.infiniteCarousel = new InfiniteCarousel(
    "#certificatesCarousel",
    ".carousel__button--prev",
    ".carousel__button--next",
    4,
  )
})
