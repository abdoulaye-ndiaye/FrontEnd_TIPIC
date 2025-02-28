# README - Application TIPIC  

## 📌 Présentation  
TIPIC est une application développée avec une architecture moderne et scalable. Elle repose sur un **Back-End en Node.js**, un **Front-End en Angular**, et une **Base de Données MongoDB**.  

L'application est entièrement conteneurisée avec **Docker** et orchestrée via **docker-compose** pour simplifier le déploiement.  

---

## 🛠️ Technologies utilisées  
- **Back-End :** Node.js  
- **Front-End :** Angular  
- **Base de Données :** MongoDB  
- **Déploiement :** Docker & Docker Compose  
- **CI/CD :** GitHub Actions  
- **Reverse Proxy :** Nginx  

---

## 📂 Repositories GitHub  
- **Back-End:** [Backend-TIPIC](https://github.com/SidyKing/Backend-TIPIC)  
- **Front-End:** [FrontEnd_TIPIC](https://github.com/abdoulaye-ndiaye/FrontEnd_TIPIC)  

Les repositories sont configurés avec **GitHub Actions** pour automatiser la construction et le stockage des images Docker sur Docker Hub :  
🔗 [Docker Hub - sidyking](https://hub.docker.com/u/sidyking)  

---

## 🚀 Déploiement de l'application  
Le fichier `docker-compose.yml` définit l'infrastructure complète du projet (**Back-End, Front-End, Base de Données, Nginx**).  

### 1️⃣ Déploiement initial  
Pour lancer l'application, exécutez la commande suivante :  
```bash
docker compose up -d
```

### 2️⃣ Mise à jour après modification du code  
Si des modifications ont été apportées au **Back-End** ou au **Front-End**, suivez ces étapes pour les appliquer :  
```bash
docker stop <id_conteneur_back>
docker rm <id_conteneur_back>
docker stop <id_conteneur_front>
docker rm <id_conteneur_front>
docker image rm <id_image_back>
docker image rm <id_image_front>
docker compose up -d
```
ℹ️ Remplacez `<id_conteneur_back>` et `<id_conteneur_front>` par les ID des conteneurs concernés, et `<id_image_back>` / `<id_image_front>` par les ID des images correspondantes.  

---

## 🔄 Migration de données vers la production  
Le script `import.sh` permet de migrer des données d'une machine locale vers la **Base de Données en production**.  

### 📥 Importation des données  
1. Ajoutez le fichier ZIP contenant la **base de données** à importer dans le même répertoire que `import.sh`.  
2. Exécutez la commande suivante :  
   ```bash
   sh import.sh
   ```
   
---

## 👥 Équipe de développement  
- **PAPA SIDY MACTAR TRAORE** - [generaltra10@gmail.com](mailto:generaltra10@gmail.com)  
- **ABDOULAYE NDIAYE** - [wizlaye7@gmail.com](mailto:wizlaye7@gmail.com)  
- **ARONA FALL**  

🔹 **Mentor / Encadrement :** Dr Mamadou Lamine Gueye (UPPA)  
