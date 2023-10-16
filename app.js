const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
let pokemons = require('./mock-pokemon')
const {success} = require('./helper')
const app = express()
const port = 3000


app.use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))

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

app.listen(port, () => console.log(`Notre application Node est démarrée sur http://localhost:${port}`));     
 