// Création du serveur 
const express = require('express')
// Icône du site
const favicon = require('serve-favicon')
// Analyse les requêtes entrantes
const bodyParser = require('body-parser')
// Configuration pour la DB
const sequelize = require('./src/db/sequelize')
// Gérer les requêtes cross-origin 
const cors = require('cors')

// Création d'une nouvelle instance d'Express
const app = express()
// Port d'écoute depuis une variable d'environnement ou port par défaut
const port = process.env.PORT || 3000

// Configuration de l'application Express
app
  .use(favicon(__dirname + '/favicon.ico'))
  // Analyser les requêtes JSON entrantes
  .use(bodyParser.json())
  // Activation de CORS pour toutes les routes
  .use(cors())

// Initialisation de la base de données avec Sequelize
sequelize.initDb()

// Route principale qui renvoie un message de bienvenue
app.get('/', (req, res) =>{
  res.json('Hello Heroku !')
})

// Importation et configuration des routes pour les opérations CRUD sur les Pokémons
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

// Importation et configuration de la route pour la connexion
require('./src/routes/login')(app)

// Gestion des erreurs 404 pour les requêtes non reconnues
app.use(({res}) =>{
  const message = "Impossible de trouver la ressource demandée. Vous pouvez essayer une autre URL."
  res.status(404).json({message})
})

// Démarrage du serveur Express sur le port spécifié
app.listen(port, () => console.log(`Notre application Node est démarrée sur http://localhost:${port}`));