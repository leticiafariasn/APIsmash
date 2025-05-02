const MAX_SIZE_MB = 5
const messageArea = document.getElementById("messageArea") //area da mensagem de upload concluido
const fileList = document.getElementById("fileList") //fileList é onde os arquivos enviados vão aparecer
const fileCount = document.getElementById("fileCount") //mostra quantos arquivos já foram enviados
const totalSize = document.getElementById("totalSize") // mostra o tamanho total de arquivos enviados, somando todos 
const linkCount = document.getElementById("linkCount") // mostra quantos links de arquivos enviados já foram gerados
const usageBar = document.getElementById("usageBar") // Seleciona a barra de progresso que mostra o quanto de espaço dos 500mb já foi usado
const usagePercent = document.getElementById("usagePercent") // pega o elemento que mostra em texto o percentual usado
const usedSpace = document.getElementById("usedSpace") // guarda em texto o valor do espaço utilizado até agora (tipo: 15mb)
const activityList = document.getElementById("activityList") // guarda a lista
const themeToggle = document.getElementById("theme-toggle") // mudança de tema

// inicializar contadores
let uploadedFiles = 0
let totalSizeBytes = 0
let generatedLinks = 0

// rastrear a posição do mouse para os tooltips
document.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--tooltip-x", `${e.clientX}px`)
  document.documentElement.style.setProperty("--tooltip-y", `${e.clientY}px`)
})

// alternar o tema
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

// verificar tema salvo (escuro)
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

// modificar a função showMessage para usar a barra de progresso
function showMessage(msg, type = "success") {
  // Se for uma mensagem de sucesso de upload, não mostrar o link
  if (type === "success" && msg.includes("Upload concluído")) {
    msg = "Upload concluído!"
  }

  messageArea.innerHTML = msg
  messageArea.className = `message ${type}`

  // Garantir que a mensagem seja visível
  messageArea.style.display = "block"
}

function updateStats(files) {
  // Atualizar contagem de arquivos
  uploadedFiles += files.length
  fileCount.textContent = uploadedFiles

  // Atualizar tamanho total
  const sizeBytes = files.reduce((total, file) => total + file.size, 0)
  totalSizeBytes += sizeBytes
  const sizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2)
  totalSize.textContent = `${sizeMB} MB`

  // Atualizar links gerados
  generatedLinks++
  linkCount.textContent = generatedLinks

  // Atualizar barra de progresso
  const maxSizeBytes = 500 * 1024 * 1024 // 500 MB
  const percentUsed = Math.min(100, (totalSizeBytes / maxSizeBytes) * 100).toFixed(1)
  usageBar.style.width = `${percentUsed}%`
  usagePercent.textContent = `${percentUsed}%`
  usedSpace.textContent = `${sizeMB} MB`

  // Adicionar à atividade recente
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

// Declare SmashUploader here
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

  // Ocultar a área de mensagem e mostrar a barra de progresso
  messageArea.style.display = "none"

  // Criar ou obter a barra de progresso
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

    // Inserir após o botão de upload
    const uploadBtn = document.querySelector(".upload-btn")
    uploadBtn.parentNode.insertBefore(progressContainer, uploadBtn.nextSibling)
  }

  const progressBar = progressContainer.querySelector(".upload-progress-bar")
  const progressText = progressContainer.querySelector(".upload-progress-text")

  // Mostrar a barra de progresso
  progressContainer.style.display = "block"
  progressBar.style.width = "0%"
  progressText.textContent = "Iniciando upload..."

  // Initialize SmashUploader here (assuming it's available globally or imported elsewhere)
  SmashUploader = window.SmashUploader // Or however you access it

  const su = new SmashUploader({
    region: "us-east-1",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmMWEzNzU1LTQzZDEtNGQ4ZC04ZDNkLWVhYjJiMWMwODk2NC1ldSIsInVzZXJuYW1lIjoiYjY3ZWI5N2MtMmYyYy00NzhkLTk3YTgtOGM3MDY5OTZlMTE3IiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxODcuMTguMTM3LjEzOSIsInNjb3BlIjoiTm9uZSIsImFjY291bnQiOiIyZTIxMGYyYS0zODgyLTQxZmUtOTJhZS0zZWUxYTkyM2QzZTgtZWEiLCJpYXQiOjE3NDYwNTE5NzYsImV4cCI6NDkwMTgxMTk3Nn0.eIWTMInHUAijFtmtcg7QA8QLrWzM-MhL1-HHzt9gkzM",
    domain: "drive-gt15",
  })

  su.upload({ files })
    .then((result) => {
      const link = result?.transfer?.transferUrl

      // Atualizar a barra de progresso para 100% e mostrar mensagem de conclusão
      progressBar.style.width = "100%"
      progressText.textContent = "Upload concluído!"

      // Após 3 segundos, esconder a barra de progresso
      setTimeout(() => {
        progressContainer.style.display = "none"
      }, 3000)

      files.forEach((file) => {
        const li = document.createElement("li")
        const fileExt = file.name.split(".").pop().toLowerCase()
        let iconClass = "ph-file"

        // Determinar ícone baseado na extensão
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
          <button class="copy-link" data-link="${link}" title="Copiar link">
            <i class="ph ph-copy"></i>
          </button>
          <a href="${link}" target="_blank" class="download-link" title="Baixar">
            <i class="ph ph-download"></i>
          </a>
        `
        fileList.appendChild(li)
      })

      // Atualizar estatísticas
      updateStats(files)
    })
    .catch((error) => {
      console.error("Erro no upload:", error)

      // Mostrar erro na barra de progresso
      progressBar.style.width = "100%"
      progressBar.style.backgroundColor = "var(--error-text)"
      progressText.textContent = "Erro ao enviar arquivos"

      // Após 3 segundos, esconder a barra de progresso
      setTimeout(() => {
        progressContainer.style.display = "none"
      }, 3000)
    })

  su.on("progress", (event) => {
    if (event.data?.progress?.percent !== undefined) {
      const percent = event.data.progress.percent
      console.log(`Progresso: ${percent}%`)

      // Atualizar a barra de progresso
      progressBar.style.width = `${percent}%`
      progressText.textContent = `${Math.round(percent)}%`
    }
  })
}

// Adicionar funcionalidade para o input de arquivo
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar tema
  initTheme()

  // Adicionar evento para o botão de alternar tema
  themeToggle.addEventListener("click", toggleTheme)

  const uploadContainer = document.querySelector(".upload-container")
  const uploadInput = document.getElementById("uploadInput")

  // Corrigir o evento de clique no container de upload
  uploadContainer.addEventListener("click", () => {
    // Chamar diretamente o clique no input de arquivo sem condições
    uploadInput.click()
  })

  // Certifique-se de que o input file está configurado corretamente
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

  // Adicionar funcionalidade de arrastar e soltar
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

  // Adicionar funcionalidade para copiar link
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

  // Alternar entre visualizações de grade e lista
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
