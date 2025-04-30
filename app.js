const MAX_SIZE_MB = 5;
const messageArea = document.getElementById("messageArea");
const fileList = document.getElementById("fileList");

function showMessage(msg, type = "success") {
  messageArea.innerHTML = msg;
  messageArea.className = `message ${type}`;
}

function upload() {
  const fileInput = document.getElementById("uploadInput");
  const files = [...fileInput.files];

  if (files.length === 0) {
    showMessage("Nenhum arquivo selecionado.", "error");
    return;
  }

  const oversized = files.find(file => file.size > MAX_SIZE_MB * 1024 * 1024);
  if (oversized) {
    showMessage(`O arquivo "${oversized.name}" excede 5MB.`, "error");
    return;
  }

  showMessage("Enviando arquivos...", "success");

  const su = new SmashUploader({
    region: "us-east-1",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmMWEzNzU1LTQzZDEtNGQ4ZC04ZDNkLWVhYjJiMWMwODk2NC1ldSIsInVzZXJuYW1lIjoiYjY3ZWI5N2MtMmYyYy00NzhkLTk3YTgtOGM3MDY5OTZlMTE3IiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxODcuMTguMTM3LjEzOSIsInNjb3BlIjoiTm9uZSIsImFjY291bnQiOiIyZTIxMGYyYS0zODgyLTQxZmUtOTJhZS0zZWUxYTkyM2QzZTgtZWEiLCJpYXQiOjE3NDYwNTE5NzYsImV4cCI6NDkwMTgxMTk3Nn0.eIWTMInHUAijFtmtcg7QA8QLrWzM-MhL1-HHzt9gkzM"
  });

  su.upload({ files })
    .then(transfer => {
      console.log("Objeto transfer recebido:", transfer);

      const link = transfer?.share?.url || transfer?.url || transfer?.links?.[0]?.url;

      if (link) {
        showMessage(`Upload concluído! <a href="${link}" target="_blank">Clique aqui para baixar</a>`, "success");
      } else {
        showMessage("Upload concluído, mas o link não está disponível.", "error");
      }

      // Adiciona os arquivos enviados na lista
      files.forEach(file => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="ph ph-file-arrow-up"></i> <span>${file.name}</span>`;
        fileList.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Erro no upload:", error);
      showMessage("Erro ao enviar arquivos.", "error");
    });

  su.on("progress", event => {
    if (event.data && event.data.progress && typeof event.data.progress.percent === "number") {
      console.log("Progresso:", event.data.progress.percent + "%");
    } else {
      console.log("Evento de progresso recebido sem dados detalhados:", event);
    }
  });
}
