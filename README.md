# 🏥 Application Web de Gestion des Rendez-vous d’Hôpital

Application web conçue pour digitaliser la gestion des rendez-vous médicaux dans les hôpitaux et cliniques.

Elle permet aux patients de réserver des rendez-vous en ligne, aux médecins de gérer leurs disponibilités et leur planning, et aux administrateurs de superviser les utilisateurs, les spécialités et les activités de la plateforme.

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Objectifs](#-objectifs)
- [Utilisateurs](#-utilisateurs)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#️-base-de-données)
- [API REST](#-api-rest)
- [Sécurité](#-sécurité)
- [Installation](#️-installation)
- [Améliorations futures](#-améliorations-futures)
- [Auteur](#-auteur)

---

## 📖 Présentation

La gestion manuelle des rendez-vous médicaux peut causer plusieurs problèmes :

- Longues files d’attente.
- Difficulté de gestion des créneaux disponibles.
- Perte de temps pour les patients et le personnel médical.
- Risque de conflits entre les rendez-vous.
- Manque de suivi des consultations.
- Difficulté de communication entre patients, médecins et administration.

Cette application a pour objectif de moderniser ce processus grâce à une plateforme web intuitive, sécurisée et responsive.

---

## 🎯 Objectifs

- Permettre aux patients de prendre rendez-vous en ligne.
- Réduire les files d’attente dans les établissements de santé.
- Faciliter la gestion des disponibilités des médecins.
- Améliorer l’organisation des plannings médicaux.
- Envoyer des notifications de confirmation et de rappel.
- Centraliser la gestion des utilisateurs, médecins, spécialités et rendez-vous.
- Fournir des statistiques utiles à l’administration.

---

## 👥 Utilisateurs

### 🧑 Patient

Le patient peut :

- Créer un compte.
- Se connecter à son espace personnel.
- Rechercher un médecin.
- Filtrer les médecins par spécialité.
- Consulter les créneaux disponibles.
- Réserver un rendez-vous.
- Consulter son historique de rendez-vous.
- Annuler un rendez-vous.
- Recevoir des notifications et rappels.
- Laisser un avis sur un médecin.

### 👨‍⚕️ Médecin

Le médecin peut :

- Consulter son tableau de bord.
- Définir ses disponibilités.
- Consulter son planning.
- Voir ses rendez-vous.
- Gérer ses consultations.
- Consulter l’historique des rendez-vous.
- Modifier ses créneaux disponibles.

### 👨‍💼 Administrateur

L’administrateur peut :

- Gérer les utilisateurs.
- Ajouter, modifier ou supprimer des médecins.
- Gérer les spécialités médicales.
- Superviser les rendez-vous.
- Consulter les statistiques de la plateforme.
- Gérer les activités globales du système.

---

## ✨ Fonctionnalités

### 🔐 Authentification et sécurité

- Inscription des patients.
- Connexion sécurisée.
- Authentification basée sur JWT.
- Gestion des rôles : `PATIENT`, `DOCTOR`, `ADMIN`.
- Chiffrement des mots de passe.
- Protection des routes selon les rôles.
- Récupération du mot de passe.

### 👨‍⚕️ Gestion des médecins

- Ajout de médecins par l’administrateur.
- Gestion des spécialités médicales.
- Consultation du profil d’un médecin.
- Gestion des disponibilités.
- Consultation du planning.

### 📅 Gestion des rendez-vous

- Recherche de médecins.
- Consultation des créneaux disponibles.
- Réservation d’un rendez-vous.
- Confirmation automatique.
- Annulation d’un rendez-vous.
- Consultation de l’historique.
- Gestion des statuts :

```text
CONFIRMÉ
ANNULÉ
TERMINÉ
```

### 🔔 Notifications

- Notification de confirmation après réservation.
- Rappel automatique avant le rendez-vous.
- Notification en cas de modification.
- Notification en cas d’annulation.

### 📊 Tableau de bord et statistiques

- Nombre total de patients.
- Nombre total de médecins.
- Nombre total de rendez-vous.
- Nombre de rendez-vous confirmés.
- Nombre de rendez-vous annulés.
- Nombre de rendez-vous terminés.
- Répartition des médecins par spécialité.
- Statistiques globales pour l’administrateur.

---

## 🛠️ Technologies utilisées

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- JavaScript

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST API
- Maven
- JWT Authentication

### Base de données

- MySQL

### Outils

- Git
- GitHub
- Postman
- IntelliJ IDEA ou Eclipse
- Visual Studio Code
- MySQL Workbench

---

## 🏗️ Architecture

```text
┌──────────────────────────────────┐
│            Client Web            │
│      React + Tailwind CSS        │
└────────────────┬─────────────────┘
                 │
                 │ HTTP / REST API
                 │
┌────────────────▼─────────────────┐
│         Backend Spring Boot      │
│                                  │
│  - Authentification JWT          │
│  - Gestion Patients              │
│  - Gestion Médecins              │
│  - Gestion Rendez-vous           │
│  - Gestion Notifications         │
│  - Gestion Statistiques          │
└────────────────┬─────────────────┘
                 │
                 │ JPA / Hibernate
                 │
┌────────────────▼─────────────────┐
│            Base MySQL            │
└──────────────────────────────────┘
```

---

## 📁 Structure du projet

```text
hospital-appointment-management/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── DoctorCard/
│   │   │   └── AppointmentCard/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── DashboardPatient/
│   │   │   ├── DashboardDoctor/
│   │   │   ├── DashboardAdmin/
│   │   │   └── Appointment/
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── doctorService.js
│   │   │   └── appointmentService.js
│   │   │
│   │   ├── context/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/hospital/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       ├── security/
│   │       │       └── HospitalApplication.java
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
└── README.md
```

---

## 🗄️ Base de données

### Table `users`

| Colonne | Type | Description |
|---|---|---|
| id | BIGINT | Identifiant unique |
| name | VARCHAR(100) | Nom complet |
| email | VARCHAR(150) | Adresse email unique |
| password | VARCHAR(255) | Mot de passe chiffré |
| role | ENUM | PATIENT, DOCTOR ou ADMIN |

### Table `patients`

| Colonne | Type | Description |
|---|---|---|
| id | BIGINT | Identifiant du patient |
| user_id | BIGINT | Référence vers l’utilisateur |

### Table `doctors`

| Colonne | Type | Description |
|---|---|---|
| id | BIGINT | Identifiant du médecin |
| user_id | BIGINT | Référence vers l’utilisateur |
| speciality_id | BIGINT | Référence vers la spécialité |
| availability | JSON / TEXT | Créneaux disponibles |

### Table `specialties`

| Colonne | Type | Description |
|---|---|---|
| id | BIGINT | Identifiant de la spécialité |
| name | VARCHAR(100) | Nom de la spécialité |

### Table `appointments`

| Colonne | Type | Description |
|---|---|---|
| id | BIGINT | Identifiant du rendez-vous |
| patient_id | BIGINT | Patient concerné |
| doctor_id | BIGINT | Médecin concerné |
| date | DATETIME | Date et heure du rendez-vous |
| status | ENUM | CONFIRMED, CANCELLED ou COMPLETED |

### Schéma relationnel simplifié

```text
users
├── patients
│   └── user_id → users.id
│
├── doctors
│   ├── user_id → users.id
│   └── speciality_id → specialties.id
│
└── appointments
    ├── patient_id → patients.id
    └── doctor_id → doctors.id
```

---

## 🔌 API REST

### Authentification

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
```

### Médecins

```http
GET    /api/doctors
GET    /api/doctors/{id}
POST   /api/doctors
PUT    /api/doctors/{id}
DELETE /api/doctors/{id}
```

### Rendez-vous

```http
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/{id}
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
```

### Administration

```http
GET    /api/admin/users
DELETE /api/admin/users/{id}

GET    /api/admin/statistics
```

### Spécialités

```http
GET    /api/specialties
POST   /api/specialties
PUT    /api/specialties/{id}
DELETE /api/specialties/{id}
```

---

## 🔐 Sécurité JWT

```text
Utilisateur
    ↓
Connexion avec email et mot de passe
    ↓
Spring Security vérifie les identifiants
    ↓
Génération d’un token JWT
    ↓
React stocke le token
    ↓
Le token est envoyé dans chaque requête API
    ↓
Spring Security vérifie le token et les autorisations
```

Exemple d’en-tête HTTP utilisé dans les requêtes protégées :

```http
Authorization: Bearer votre_token_jwt
```

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE-USERNAME/NOM-DU-REPOSITORY.git
cd NOM-DU-REPOSITORY
```

### 2. Créer la base de données MySQL

```sql
CREATE DATABASE hospital_management;
```

### 3. Configurer le backend

Modifier le fichier :

```text
backend/src/main/resources/application.properties
```

Ajouter ou modifier cette configuration :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080

jwt.secret=VOTRE_CLE_SECRETE_JWT
jwt.expiration=86400000
```

### 4. Lancer le backend

```bash
cd backend
mvn spring-boot:run
```

Sous Windows avec Maven Wrapper :

```bash
mvnw.cmd spring-boot:run
```

Le backend sera disponible sur :

```text
http://localhost:8080
```

### 5. Lancer le frontend

Ouvrir un nouveau terminal :

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera généralement disponible sur :

```text
http://localhost:5173
```

---

## 📱 Compatibilité

L’application est conçue pour être responsive et compatible avec :

- Ordinateur.
- Tablette.
- Smartphone.
- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.

---

## 🚀 Améliorations futures

- Application mobile Android et iOS.
- Notifications WhatsApp et SMS.
- Paiement en ligne des consultations.
- Téléconsultation vidéo.
- Gestion des dossiers médicaux.
- Génération d’ordonnances électroniques.
- Système de file d’attente en temps réel.
- Intelligence artificielle pour recommander des créneaux.
- Export des statistiques en PDF et Excel.
- Tableau de bord avancé avec graphiques dynamiques.

---

## 👨‍💻 Auteur

Projet réalisé dans le cadre d’un projet académique.

**Technologies principales :** React, Spring Boot, MySQL, JWT, Tailwind CSS et REST API.

---

## 📄 Licence

Ce projet est développé à des fins éducatives et académiques.
