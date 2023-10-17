exports.success = (message, data) => {
    return{message,data}
}

exports.getUniqueId = (pokemons) => {
    //Transforme tableau de pokémon en un tableau d'id avec la fonction map
    const pokemonsIds =pokemons.map(pokemon => pokemon.id)
    //Identifie le plus grand identifiant, reduce compare les élémnents du tableau 
    const maxId = pokemonsIds.reduce((a,b) => Math.max(a+b))
    const uniqueId = maxId + 1
    return uniqueId
}