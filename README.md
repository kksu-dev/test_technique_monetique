# test_technique_monetique
## 📚 Présentation

Ce projet a pour objectif de permettre l’**upload**, le **parsing**, le **chiffrement/déchiffrement** et la **visualisation** des messages ISO 8583.

## 🛠️ Stack technique

### Backend - Java Spring Boot
- Spring Web
- Spring Security
- Swagger/OpenAPI
- Basic Authentication
- AES Encryption (ECB/PKCS5Padding)

### 💻 Frontend - Angular
- Angular 17
- Bootstrap
- SweetAlert2 (confirmation et alertes utilisateurs)
- HTTPClient (consommation d’API)

---

## 🔐 Sécurité

### Authentification HTTP Basic

L’API est sécurisée via un schéma **Basic Auth**.  
Un utilisateur en mémoire a été défini comme suit en JAVA :

```java
@Bean
public InMemoryUserDetailsManager userDetailsService() {
    UserDetails user = User.withUsername("admin")
        .password("{noop}admin@2025")
        .build();
    return new InMemoryUserDetailsManager(user);
}
```
### Chiffrement du PAN
- J'ai utilisé AES avec la configuration ECB et PKCS5Padding
## 📌 Lien du projet

Le lien du code source est disponible sur mon repo GitHub public :  
🔗 [https://github.com/kksu-dev/test_technique_monetique.git](https://github.com/kksu-dev/test_technique_monetique.git)

## 📘 Swagger UI
La documentation des APIs est disponible à cette adresse une fois le backend lancé :

👉 `http://localhost:8080/swagger-ui/index.html`

## Les éléments d’authentification à l’API
``` 
USER : admin
PASSWORD : admin@2025
```

## Les éléments de connexion à la BD
``` 
BD = ISO8583_BD
url = jdbc:postgresql://localhost:5432/ISO8583_BD
username = admin
password = admin
```
---

## 🚀 Lancer le projet localement

### 🔧 Prérequis
- Java 17 ou plus
- Node.js (v18 recommandé)
- Angular CLI (npm install -g @angular/cli)
- PostgreSQL
- Maven
---
## Cloner le projet
git clone https://github.com/kksu-dev/test_technique_monetique.git
- cd test_technique_monetique
  - Pour le BACKEND en JAVA
    - cd iso8583parser
      - ./mvnw clean install
      - ./mvnw spring-boot:run
      
  - Pour le FRONT en ANGULAR
    - cd iso8583FrontV1
      - npm install 
      - ng serve



