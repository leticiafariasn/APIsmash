# 💾 Mini Drive com Upload via API Smash

Este projeto é um mini drive web que permite ao usuário:

- Selecionar arquivos de até 5 MB
- Fazer upload para o serviço [Smash (fromsmash.com)](https://fromsmash.com/)
- Obter um link direto para download dos arquivos enviados

> Projeto desenvolvido por **Letícia Farias Nunes**  
> Sob orientação de **Luan Oliveira dos Santos**

---

## 🚀 Funcionalidades

- ✅ Upload de arquivos com limite de 5MB
- ✅ Link de download gerado automaticamente via Smash
- ✅ Interface minimalista com tema escuro
- ✅ Exibição de arquivos enviados na sessão atual

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3 (tema escuro, simples)
- JavaScript (moderno, com ES6+)
- [SmashUploader SDK](https://api.fromsmash.com/docs/quick-start/html-js)

---

## 🔐 Validade do Token de API

> 🔔 **Aviso:** Este projeto está com um token de API Smash **válido até o dia 16/06/2025**.  
> Após essa data, para continuar utilizando o sistema, basta seguir o passo a passo de configuração da API abaixo com sua própria conta gratuita.

---

## ⚙️ Como configurar sua própria API (após 16/06/2025)

1. Crie uma conta em [https://fromsmash.com/developers](https://fromsmash.com/developers)
2. Gere um **token de acesso**
3. (Opcional) Crie um domínio personalizado, como `seudrive.fromsmash.com`
4. Copie o token e substitua no arquivo `app.js`:

```js
const su = new SmashUploader({
  region: "us-east-1",
  token: "SEU_TOKEN_AQUI",
  domain: "SEU_DOMINIO" // ou remova se não tiver domínio
});
```

---

## 📌 Observações

- O histórico de uploads não é armazenado: os arquivos são exibidos apenas durante a sessão atual.
- A API Smash não permite listar, excluir ou visualizar arquivos antigos.
- Futuras melhorias podem incluir autenticação de usuário com Supabase, organização por pastas e banco de dados.

---

## 📧 Contato

Projeto acadêmico desenvolvido por:

**Letícia Farias Nunes**  
Sob orientação de **Luan Oliveira dos Santos**
