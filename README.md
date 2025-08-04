# test_technique_monetique
## 📌 Lien du projet

Le code source complet est disponible sur mon repo :  
🔗 [https://github.com/kksu-dev/test_technique_monetique.git](https://github.com/kksu-dev/test_technique_monetique.git)

## 📘 Swagger UI

La documentation des APIs est disponible à cette adresse une fois le backend lancé :

👉 `http://localhost:3000/api-docs`

### Backend (Java Spring Boot)
```bash
cd backend
./mvnw spring-boot:run

# 💳 ISO 8583 Parser Web App

Application web permettant de parser et visualiser des messages ISO 8583, en affichant leurs informations sous une interface utilisateur conviviale avec possibilité de suppression, décryptage PAN, téléchargement, et plus.

---

## 🧩 Technologies utilisées

- **Frontend** : Angular 16, Bootstrap 5, SweetAlert2
- **Backend** : Spring Boot 3, Swagger UI, JPA, PostgreSQL
- **Autres** : Maven, Lombok, Git

---

## 🧠 Fonctionnalités principales

### 🖥️ Frontend (Angular)
- Upload de fichiers ISO 8583
- Affichage tabulaire des messages
- Décryptage PAN affiché dans le tableau
- Suppression de messages avec confirmation SweetAlert
- Chargement dynamique avec indicateur `loading`
- Appels API sécurisés via `HttpHeaders`

### ⚙️ Backend (Spring Boot)
- API REST pour parser, sauvegarder et lister les messages ISO 8583
- Décryptage de champs sensibles (ex: PAN)
- Suppression d’un message via son `id`
- Documentation Swagger UI
- Génération automatique de la base PostgreSQL

---

## 🚀 Lancer le projet localement

### 🔧 Prérequis
- Node.js & Angular CLI
- Java 17+
- PostgreSQL
- Maven

---

### 🏗️ Setup backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
