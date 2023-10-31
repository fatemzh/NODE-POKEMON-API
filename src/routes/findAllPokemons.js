// Importation du modèle Pokemon depuis la configuration Sequelize
const { Pokemon } = require('../db/sequelize')

// Importation de l'opérateur "Op" de Sequelize pour les requêtes avancées
const { Op } = require('sequelize')

// Importation du middleware d'authentification
const auth = require('../auth/auth')

// Exportation d'une fonction qui prend en paramètre l'application Express
module.exports = (app) => {
  // Définition d'une route GET pour récupérer la liste des Pokémons
  app.get('/api/pokemons', auth, (req, res) => {
    // Vérification si un paramètre "name" est présent dans la requête
    if(req.query.name)
    {
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5

      // Vérification de la longueur du paramètre "name"
      if(name.length < 2){
        message = 'Le terme de recherche doit contenir au moins 2 caracteres.'
        return res.status(400).json({ message})
      }

      // Recherche des Pokémons qui correspondent au paramètre "name"
      return Pokemon.findAndCountAll({
        where : {
        name: {
          [Op.like]: `%${name}%`
        }},
        order: ['name'], // Tri par ordre alphabétique
        limit: limit // Limite le nombre de résultats
      })
      .then(({count, rows}) => {
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}`
        res.json({message, data:rows})
      })
    }
    else{
      // Si aucun paramètre "name" n'est présent, récupère tous les Pokémons
      Pokemon.findAll({order: ['name']}) // Tri par ordre alphabétique
        .then(pokemons => {
          const message = 'La liste des pokémons a bien été récupérée.'
          res.json({ message, data: pokemons })
        })
        .catch(error =>{
          const message = "La liste des pokémon n'a pas été récupérée. Réessayez dans quelques instants."
          res.status(500).json({ message, data: error})
        })
      }
  })
}
