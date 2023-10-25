const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {
    if(req.query.name)
    {
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5

      if(name.length < 2){
        message = 'Le terme de recherche doit contenir au moins 2 caracteres.'
        return res.status(400).json({ message})
      }else{
        
      }

      return Pokemon.findAndCountAll({ //nb total résultat + résultat
        where : {
        name: { // 'name' propriété du modèle pokémon
          [Op.like]: `%${name}%` // 'name' est le critère de la recherche
        }},
        order: ['name'], // tri par ordre alphabétique
        limit:limit //limiter nb de résultats souhaités
      })
      .then(({count, rows}) => {
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}`
        res.json({message, data:rows})
      })
    }
    else{
      Pokemon.findAll({order: ['name']}) // tri par ordre alphabétique
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