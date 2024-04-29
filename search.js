const fetchAllPokemon = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=1118`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results;
}

const searchPokemon = async (search) => {
    const allPokemon = await fetchAllPokemon();
    return allPokemon.filter(pokemon => pokemon.name.startsWith(search));
}

searchInput.addEventListener('keyup', async (event) => {
    const searchTerm = event.target.value;
    try {
        const results = await searchPokemon(searchTerm);
        // Clear the results container
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
        // Fetch details for each matching Pokémon
        const pokemonDetails = [];
        for (const pokemon of results) {
            const res = await fetch(pokemon.url);
            const fullPokemon = await res.json();
            pokemonDetails.push({
                name: fullPokemon.name,
                id: fullPokemon.id,
                image: fullPokemon.sprites['front_default'],
                type: fullPokemon.types.map((type) => type.type.name).join(', '),
            });
        }
        // Display all matching Pokémon
        displayPokemon(pokemonDetails);
    } catch (error) {
        console.error(error);
    }
});