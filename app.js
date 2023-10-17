const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
let pokemons = require('./mock-pokemon')
const {success, getUniqueId} = require('./helper')
const app = express()
const port = 3000


app.use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello, world 2'))

// On utilise la liste de pokemons dans notre point de terminaison
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const searchedPokemon = pokemons.find(singlePokemon  => singlePokemon.id === id)
    const message = "Un pokémon a bien été trouvé."
    res.json(success(message, searchedPokemon))
})

// Affiche la liste des pokemons 
app.get('/api/pokemons', (req, res) => {
    const message = "La liste des pokémons a bien été récupérée."
    res.json(success(message, pokemons))
})

//Parse data avec un middleware pour convertir les données en JSON --> npm install body-parser --save

// Crée de nvx pokémon POST
app.post('/api/pokemons', (req, res) => {
    // Choix arbitraire car besoin d'un id unique temporaire
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})

// Modifie pokémon PUT
app.put('/api/pokemons/:id', (req,res) =>{
    const id = parseInt(req.params.id)
    const pokemonUpdated = {...req.body, id:id}
    pokemons = pokemons.map(pokemon =>{
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

// Supprimer un pokémon DELETE
app.delete('/api/pokemons/:id', (req,res) =>{
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon =>pokemon.id === id)
    pokemons = pokemons.filter(pokemon =>pokemon.id !== id)
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})


app.listen(port, () => console.log(`Notre application Node est démarrée sur http://localhost:${port}`));     
 