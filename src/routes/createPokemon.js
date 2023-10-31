// Importation du modèle Pokemon depuis la configuration Sequelize
const { Pokemon } = require('../db/sequelize')

// Importation de l'erreur de validation de Sequelize
const {ValidationError} = require('sequelize')

// Importation du middleware d'authentification
const auth = require('../auth/auth')

// Exportation d'une fonction qui prend en paramètre l'application Express
module.exports = (app) => {
  // Définition d'une route POST pour créer un nouveau Pokémon
  app.post('/api/pokemons', auth, (req, res) => {
    // Création d'un nouveau Pokémon avec les données de la requête
    Pokemon.create(req.body)
      .then(pokemon => {
        // Si la création est réussie, renvoie un message de succès
        const message = `Le pokémon ${req.body.name} a bien été crée.`
        res.json({ message, data: pokemon })
      })
      .catch(error => {
        // Gestion des erreurs lors de la création
        if(error instanceof ValidationError)
        {
          // Si c'est une erreur de validation, renvoie un code d'erreur 400
          return res.status(400).json({message : error.message, data: error})
        }
        if(error instanceof UniqueConstraintError)
        {
          // Si c'est une erreur de contrainte d'unicité, renvoie un code d'erreur 400
          return res.status(400).json({message : error.message, data: error})
        }
        // Pour toute autre erreur, renvoie un code d'erreur 500
        const message = "Le pokémon n'a pas pu être ajouté. Réessayer dans quelques instants."
        res.status(500).json({message, data:error})
      })
  })
}
