// Importation du modèle Pokemon depuis la configuration Sequelize
const { Pokemon } = require('../db/sequelize')

// Importation du middleware d'authentification
const auth = require('../auth/auth')

// Exportation d'une fonction qui prend en paramètre l'application Express
module.exports = (app) => {
  // Définition d'une route DELETE pour supprimer un Pokémon par son identifiant
  app.delete('/api/pokemons/:id', auth, (req, res) => {
    // Recherche du Pokémon par son identifiant
    Pokemon.findByPk(req.params.id).then(pokemon => {
      // Si le Pokémon n'est pas trouvé, renvoie un message d'erreur
      if(pokemon === null){
        const message = "Le pokémon demandé n'existe pas, veuillez réessayer avec un autre identifiant."
        return res.status(404).json({message})
      }
      // Si le Pokémon est trouvé, conserve une référence pour le message de confirmation
      const pokemonDeleted = pokemon
      // Suppression du Pokémon
      return Pokemon.destroy({
        where: { id: pokemon.id }
      })
      .then(_ => {
        // Si la suppression est réussie, renvoie un message de succès
        const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
        res.json({message, data: pokemonDeleted })
      })
    })
    .catch(error => {
      // Gestion des erreurs lors de la suppression
      const message = 'Le pokémon n\'a pas pu être moidifié. Réessayez dans quelques instants.'
      res.status(500).json({message, data:error})
    })
  })
}
