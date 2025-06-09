# 🚀 GUIA RÁPIDO DE INSTALAÇÃO

## ⚡ **Setup em 5 minutos**

### **1. Firebase (2 min)**
```
1. console.firebase.google.com
2. Criar projeto → Ativar Firestore
3. Configurações → App Web → Copiar credenciais
```

### **2. GitHub Secrets (1 min)**
```
Settings → Secrets and variables → Actions
Adicionar 6 secrets com credenciais Firebase
```

### **3. Deploy Automático (2 min)**
```
git add .
git commit -m "setup: configura Firebase"
git push
```

---

## 🔥 **Firebase - Passo a Passo**

### **Criar Projeto:**
1. https://console.firebase.google.com
2. "Criar um projeto"
3. Nome: "mercado-livre-analyzer"
4. Confirmar → Continuar → Criar projeto

### **Ativar Firestore:**
1. Menu lateral → "Firestore Database"
2. "Criar banco de dados"
3. "Iniciar em modo de teste"
4. Localização: "southamerica-east1"

### **Configurar App Web:**
1. Configurações (⚙️) → "Geral"
2. "Seus aplicativos" → Ícone Web "</>"
3. Nome: "mercado-livre-web"
4. Registrar app → **COPIAR** as configurações

### **Regras do Firestore:**
1. Firestore Database → "Regras"
2. **Colar:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /product-analyses/{document} {
      allow read, write: if true;
    }
  }
}
```
3. "Publicar"

---

## 🔐 **GitHub - Configurar Secrets**

### **No repositório https://github.com/pommerrrr/ML:**

1. **Settings** (aba do repositório)
2. **Secrets and variables** → **Actions**
3. **New repository secret** para cada:

```
VITE_FIREBASE_API_KEY = (valor do apiKey)
VITE_FIREBASE_AUTH_DOMAIN = (valor do authDomain)
VITE_FIREBASE_PROJECT_ID = (valor do projectId)
VITE_FIREBASE_STORAGE_BUCKET = (valor do storageBucket)
VITE_FIREBASE_MESSAGING_SENDER_ID = (valor do messagingSenderId)
VITE_FIREBASE_APP_ID = (valor do appId)
```

---

## 🌐 **GitHub Pages**

### **Ativar:**
1. Settings → **Pages**
2. Source: **"GitHub Actions"**
3. Save

### **Verificar Deploy:**
1. Aba **Actions** → Aguardar ✅
2. Acessar: https://pommerrrr.github.io/ML/

---

## ✅ **Checklist Final**

- [ ] Firebase projeto criado
- [ ] Firestore ativado (modo teste)
- [ ] App Web registrado
- [ ] Regras Firestore configuradas
- [ ] 6 secrets adicionadas no GitHub
- [ ] GitHub Pages ativado
- [ ] Deploy finalizado (Actions ✅)
- [ ] Site funcionando

---

## 🔧 **Se algo der errado:**

### **Página em branco:**
- F12 → Console → Ver erros
- Verificar se secrets estão corretas

### **Erro 404:**
- Aguardar deploy terminar (2-3 min)
- Verificar Actions no GitHub

### **Firebase erro:**
- Verificar se Firestore está ativado
- Verificar regras de segurança

---

**🎉 Pronto! Seu sistema está funcionando em https://pommerrrr.github.io/ML/**