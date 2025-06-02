const MAX_SIZE_MB = 5
const messageArea = document.getElementById("messageArea") 
const fileList = document.getElementById("fileList") 
const fileCount = document.getElementById("fileCount") 
const totalSize = document.getElementById("totalSize")
const linkCount = document.getElementById("linkCount") 
const usageBar = document.getElementById("usageBar")
const usagePercent = document.getElementById("usagePercent")
const usedSpace = document.getElementById("usedSpace") 
const activityList = document.getElementById("activityList") 
const themeToggle = document.getElementById("theme-toggle") 

let uploadedFiles = 0
let totalSizeBytes = 0
let generatedLinks = 0

document.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--tooltip-x", `${e.clientX}px`)
  document.documentElement.style.setProperty("--tooltip-y", `${e.clientY}px`)
})

function toggleTheme() {
  const html = document.documentElement
  const isDarkTheme = html.classList.contains("dark-theme")

  if (isDarkTheme) {
    html.classList.remove("dark-theme")
    themeToggle.innerHTML = '<i class="ph ph-moon"></i>'
    localStorage.setItem("theme", "light")
  } else {
    html.classList.add("dark-theme")
    themeToggle.innerHTML = '<i class="ph ph-sun"></i>'
    localStorage.setItem("theme", "dark")
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme")
  const html = document.documentElement

  if (savedTheme === "light") {
    html.classList.remove("dark-theme")
    themeToggle.innerHTML = '<i class="ph ph-moon"></i>'
  } else {
    html.classList.add("dark-theme")
    themeToggle.innerHTML = '<i class="ph ph-sun"></i>'
  }
}

function showMessage(msg, type = "success") {
  if (type === "success" && msg.includes("Upload concluído")) {
    msg = "Upload concluído!"
  }

  messageArea.innerHTML = msg
  messageArea.className = `message ${type}`

  messageArea.style.display = "block"
}

function updateStats(files) {
  uploadedFiles += files.length
  fileCount.textContent = uploadedFiles

  const sizeBytes = files.reduce((total, file) => total + file.size, 0)
  totalSizeBytes += sizeBytes
  const sizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2)
  totalSize.textContent = `${sizeMB} MB`

  generatedLinks++
  linkCount.textContent = generatedLinks

  const maxSizeBytes = 500 * 1024 * 1024 
  const percentUsed = Math.min(100, (totalSizeBytes / maxSizeBytes) * 100).toFixed(1)
  usageBar.style.width = `${percentUsed}%`
  usagePercent.textContent = `${percentUsed}%`
  usedSpace.textContent = `${sizeMB} MB`

  if (activityList.querySelector(".empty-activity")) {
    activityList.innerHTML = ""
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString()
  const dateStr = now.toLocaleDateString()

  const activityItem = document.createElement("li")
  activityItem.innerHTML = `<strong>${timeStr}</strong> - Enviou ${files.length} arquivo(s) (${(sizeBytes / (1024 * 1024)).toFixed(2)} MB)`
  activityList.prepend(activityItem)
}

let SmashUploader

function upload() {
  const fileInput = document.getElementById("uploadInput")
  const files = [...fileInput.files]

  if (files.length === 0) {
    showMessage("Nenhum arquivo selecionado.", "error")
    return
  }

  const oversized = files.find((file) => file.size > MAX_SIZE_MB * 1024 * 1024)
  if (oversized) {
    showMessage(`O arquivo "${oversized.name}" excede 5MB.`, "error")
    return
  }

  messageArea.style.display = "none"

  let progressContainer = document.querySelector(".upload-progress")
  if (!progressContainer) {
    progressContainer = document.createElement("div")
    progressContainer.className = "upload-progress"

    const progressBar = document.createElement("div")
    progressBar.className = "upload-progress-bar"

    const progressText = document.createElement("div")
    progressText.className = "upload-progress-text"
    progressText.textContent = "Iniciando upload..."

    progressContainer.appendChild(progressBar)
    progressContainer.appendChild(progressText)

    const uploadBtn = document.querySelector(".upload-btn")
    uploadBtn.parentNode.insertBefore(progressContainer, uploadBtn.nextSibling)
  }

  const progressBar = progressContainer.querySelector(".upload-progress-bar")
  const progressText = progressContainer.querySelector(".upload-progress-text")

  progressContainer.style.display = "block"
  progressBar.style.width = "0%"
  progressText.textContent = "Iniciando upload..."

  SmashUploader = window.SmashUploader 

  const su = new SmashUploader({
    region: "us-east-1",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyZmQ3OGE2LTM3OGMtNDliZS04MDNkLTQ2ZjA0NjYxZjVkMC1ldSIsInVzZXJuYW1lIjoiM2EzZjY4YWMtNDI1Yy00ZjViLWE2MWYtYzJmODg1ODM4MzYxIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzkuMTQ0LjQ4LjQ0Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6IjU0NzA1NGU4LTk4N2QtNGI1Ni05MGRmLWE3ZDg3NTExMDRhMi1lYSIsImlhdCI6MTc0ODg4MjM5NCwiZXhwIjo0OTA0NjQyMzk0fQ.I6PIuM9Q_tFZAKZohhgCOCdDTfJNpP1DZ6sVKZwjTlY",
  })

  su.upload({ files })
    .then((result) => {
      const link = result?.transfer?.transferUrl

      progressBar.style.width = "100%"
      progressText.textContent = "Upload concluído!"

      setTimeout(() => {
        progressContainer.style.display = "none"
      }, 3000)

      files.forEach((file) => {
        const li = document.createElement("li")
        const fileExt = file.name.split(".").pop().toLowerCase()
        let iconClass = "ph-file"

        if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
          iconClass = "ph-image"
        } else if (["doc", "docx", "txt", "pdf"].includes(fileExt)) {
          iconClass = "ph-file-doc"
        } else if (["mp3", "wav", "ogg"].includes(fileExt)) {
          iconClass = "ph-music-notes"
        } else if (["mp4", "avi", "mov", "webm"].includes(fileExt)) {
          iconClass = "ph-video"
        }

        const fileSize = (file.size / (1024 * 1024)).toFixed(2)

        li.innerHTML = `
          <i class="ph ${iconClass}"></i>
          <span>${file.name}</span>
          <small>${fileSize} MB</small>
          <button class="copy-link" data-link="${link}" data-title="Copiar link">
           <i class="ph ph-copy"></i>
          </button>
          <a href="${link}" target="_blank" class="download-link" data-title="Baixar">
          <i class="ph ph-download"></i>
          </a>
        `
        fileList.appendChild(li)
      })

      updateStats(files)
    })
    .catch((error) => {
      console.error("Erro no upload:", error)

      progressBar.style.width = "100%"
      progressBar.style.backgroundColor = "var(--error-text)"
      progressText.textContent = "Erro ao enviar arquivos"

      setTimeout(() => {
        progressContainer.style.display = "none"
      }, 3000)
    })

  su.on("progress", (event) => {
    if (event.data?.progress?.percent !== undefined) {
      const percent = event.data.progress.percent
      console.log(`Progresso: ${percent}%`)

      progressBar.style.width = `${percent}%`
      progressText.textContent = `${Math.round(percent)}%`
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme()

  themeToggle.addEventListener("click", toggleTheme)

  const uploadContainer = document.querySelector(".upload-container")
  const uploadInput = document.getElementById("uploadInput")

  uploadContainer.addEventListener("click", () => {
    uploadInput.click()
  })

  uploadInput.setAttribute("type", "file")
  uploadInput.setAttribute("multiple", "true")

  uploadInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const fileNames = Array.from(this.files)
        .map((file) => file.name)
        .join(", ")
      uploadContainer.querySelector("p").textContent = `Arquivos selecionados: ${fileNames}`
    } else {
      uploadContainer.querySelector("p").textContent = "Arraste arquivos ou clique para selecionar"
    }
  })

  uploadContainer.addEventListener("dragover", function (e) {
    e.preventDefault()
    this.style.background = getComputedStyle(document.documentElement).getPropertyValue("--accent-light")
    this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color")
  })

  uploadContainer.addEventListener("dragleave", function (e) {
    e.preventDefault()
    this.style.background = getComputedStyle(document.documentElement).getPropertyValue("--bg-upload")
    this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue("--border-upload")
  })

  uploadContainer.addEventListener("drop", function (e) {
    e.preventDefault()
    this.style.background = getComputedStyle(document.documentElement).getPropertyValue("--bg-upload")
    this.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue("--border-upload")

    if (e.dataTransfer.files.length > 0) {
      uploadInput.files = e.dataTransfer.files
      const fileNames = Array.from(e.dataTransfer.files)
        .map((file) => file.name)
        .join(", ")
      this.querySelector("p").textContent = `Arquivos selecionados: ${fileNames}`
    }
  })

  document.addEventListener("click", (e) => {
    if (e.target.closest(".copy-link")) {
      const button = e.target.closest(".copy-link")
      const link = button.dataset.link

      navigator.clipboard
        .writeText(link)
        .then(() => {
          const originalHTML = button.innerHTML
          button.innerHTML = '<i class="ph ph-check"></i>'
          button.style.color = getComputedStyle(document.documentElement).getPropertyValue("--success-text")

          setTimeout(() => {
            button.innerHTML = originalHTML
            button.style.color = ""
          }, 2000)
        })
        .catch(() => {
          showMessage("Erro ao copiar link.", "error")
        })
    }
  })

  const viewButtons = document.querySelectorAll(".view-btn")
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      if (this.querySelector(".ph-list")) {
        fileList.classList.add("list-view")
      } else {
        fileList.classList.remove("list-view")
      }
    })
  })
})
