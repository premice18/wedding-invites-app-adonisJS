# 💍 Wedding Invites App

[![AdonisJS](https://img.shields.io/badge/AdonisJS-5A67D8?style=for-the-badge&logo=adonisjs&logoColor=white)](https://adonisjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

## Application web moderne pour gérer les invitations de mariage - RSVP digital et gestion d'invités

## 🚀 Fonctionnalités

- **📧 Invitations digitales** - Envoi et gestion des invitations en ligne
- **✅ Système RSVP** - Réponses des invités en temps réel
- **👥 Gestion des invités** - Liste complète avec statuts
- **👥 Scan des invitations via coeQR** - Generation automatique
- **📊 Tableau de bord** - Statistiques et suivi des confirmations
- **🎨 Interface moderne** - Design élégant et responsive

## 🛠️ Stack Technique

### Backend

- **AdonisJS** - Framework Node.js full-stack
- **MySQL** - Base de données relationnelle
- **Lucide** - Icons modernes
- **Authentication** - Système de sécurisation

### Frontend

- **Vue.js** - Framework JavaScript progressif
- **CSS3** - Styles et responsive design
- **HTML5** - Structure sémantique

## 📦 Installation

### Pré-requis

- Node.js (v16 ou supérieur)
- MySQL
- npm ou yarn

### Instructions d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/premice18/wedding-invites-app-adonisJS.git
cd wedding-invites-app-adonisJS

```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer la base de données**

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables dans .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=wedding_invites
```

4. **Lancer les migrations**

```bash
node ace migration:run
```

5. **Démarrer l'application**

```bash
# Développement
npm run dev

# Ou production
npm start
```

6. **L'application sera accessible sur http://localhost:3333**

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

# 👨‍💻 Auteur

Créé avec ❤️ par Premice Kombozi

[Mon portfolio ](https://premice-portfolio.onrender.com/)
