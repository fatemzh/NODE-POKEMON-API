// Importation des modules nécessaires de Sequelize pour définir les modèles et types de données
const { Sequelize, DataTypes } = require('sequelize')

// Importation des modèles de données pour les Pokémons et les Utilisateurs
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')

// Importation des données mock pour les Pokémons
const pokemons = require('./mock-pokemon')

// Importation du module bcrypt pour le hachage des mots de passe
const bcrypt = require('bcrypt')

// Initialisation de la connexion à la base de données avec Sequelize
const sequelize = new Sequelize('pokedex', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  // Désactivation des logs de Sequelize pour éviter le bruit dans la console
  logging: false
})

// Création des modèles Sequelize pour les Pokémons et les Utilisateurs
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

// Fonction pour initialiser la base de données
const initDb = () => {
  // Synchronisation des modèles avec la base de données. L'option {force: true} supprime et recrée les tables si elles existent déjà
  return sequelize.sync({force: true}).then(_ => {
    // Remplissage de la table Pokemon avec les données mock
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types 
      }).then(pokemon => console.log(pokemon.toJSON()))
    })

    // Hachage du mot de passe 'pikachu' et création d'un utilisateur avec ce mot de passe haché
    bcrypt.hash('pikachu', 10)
    .then(hash => User.create({username : 'pikachu', password : hash}))
    .then(user => console.log(user.toJSON()))

    // Log pour confirmer que la base de données a été correctement initialisée
    console.log('La base de donnée a bien été initialisée !')
  })
}

// Exportation des fonctions et modèles pour être utilisés dans d'autres fichiers
module.exports = { 
  initDb, Pokemon, User
}
