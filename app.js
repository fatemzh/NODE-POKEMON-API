const express = require('express')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello, world 2'))

// On utilise la liste de pokemons dans notre point de terminaison
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const searchedPokemon = pokemons.find(singlePokemon  => singlePokemon.id === id)
    res.send(`Vous avez demandé le pokémon ${searchedPokemon.name}`)
})

// Affiche le nombre total de pokemons
app.get('/api/pokemons/', (req, res) => {
    const nb = pokemons.length
    res.send(`Il y a ${nb} pokémon dans  le pokédex pour le moment.`)
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur http://localhost:${port}`));     
 