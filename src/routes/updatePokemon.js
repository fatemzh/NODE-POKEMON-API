// Importation du modèle Pokemon depuis la configuration Sequelize
const { Pokemon } = require('../db/sequelize')

// Importation de l'erreur de validation de Sequelize
const { ValidationError } = require('sequelize')

// Importation du middleware d'authentification
const auth = require('../auth/auth')

// Exportation d'une fonction qui prend en paramètre l'application Express
module.exports = (app) => {
  // Définition d'une route PUT pour mettre à jour un Pokémon par son identifiant
  app.put('/api/pokemons/:id', auth, (req, res) => {
    // Récupération de l'identifiant du Pokémon depuis les paramètres de la route
    const id = req.params.id

    // Mise à jour du Pokémon dans la base de données
    Pokemon.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      // Après la mise à jour, recherche du Pokémon par son identifiant pour renvoyer les données à jour
      return Pokemon.findByPk(id).then(pokemon => {
        // Si le Pokémon n'est pas trouvé, renvoie un message d'erreur
        if(pokemon === null){
          const message = "Le pokémon demandé n'existe pas, veuillez réessayer avec un autre identifiant."
          return res.status(404).json({message})
        }
        // Si le Pokémon est trouvé, renvoie un message de succès avec les données à jour
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
    })
    .catch(error => {
      // Gestion des erreurs de validation
      if(error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      // Gestion des erreurs de contrainte unique
      if(error instanceof UniqueConstraintError)
      {
        return res.status(400).json({message : error.message, data: error})
      }
      // Gestion des autres erreurs
      const message = 'Le pokémon n\'a pas pu être modifié. Réessayez dans quelques instants.'
      res.status(500).json({message, data:error})
    })
  })
}
