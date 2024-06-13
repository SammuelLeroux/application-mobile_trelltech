# TrellTech

## Comment se retrouver dans le projet ?
```
Trelltech
├── .expo
├── %ProgramData%
├── assets
├── node_modules
├── src
│   ├── components
│   │   ├── modals
│   ├── config
│   ├── pages
│   ├── utils
├── .env
├── .gitignore
├── App.js
├── app.json
├── babel.config.js
├── package-lock.json
├── package.json
└── tailwind.config.js
```

---
App.js c'est l'entrée de l'application, c'est grâce à ce fichier qu'on va déterminer la page de départ.

---
src/pages
Contient les différentes pages de notre application

---
src/components 
Les différents composants de nos pages regrouper dans un dossier

src/components/modals
Toutes les modals pouvant être utilisé dans un composant


## Organisation

- ### Trello

Trello nous permet d'organiser les tâches que nous devons faire ainsi qu'assigner des personnes à des tâches

- ### Git / Github

[LINK](https://github.com/EpitechMscProPromo2026/T-DEV-600-STG_9/tree/main) 

#### Les branches sur GIT
La branche main regroupe le code finalisé et testé du projet, il est la dernière phase du code.
Lorsque tu veux commencer une tâche tu dois créer une branche à partir de la branche de développement se nommant "dev".

#### Normes des commits

Lorsque tu fais des commit il est important de respecter les points suivants:
- Mot clé au début pour l'action (ADD, MAJ, DEL)
- Description clair de ce que tu as fait dans le commit

Par exemple si je supprime un bouton dans un components du projet mon commit sera
"DEL: le bouton pour (action) dans (fichier)"

