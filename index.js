const pokedex = document.getElementById('pokedex');
const pokeCache = {};

console.log(pokedex);

const fetchPokemon = () => {

    const promises = [];
    for (let i = 1; i <= 1000; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }

    Promise.all(promises).then((results) => {
        const pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', '),
        }));
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    console.log(pokemon);
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) => `
        <li class="card" onclick="selectPokemon(${pokeman.id})">
            <img class="card-image" src="${pokeman.image}"/>
            <p class="card-number">N° ${pokeman.id}</p>
            <h4 class="card-title">${pokeman.name}</h4>
            <div class="types">
                ${pokeman.type.split(', ').map(type => `<span class="type-${type}">${type}</span>`).join(' ')}
            </div>
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
}

const selectPokemon = async (id) => {
    if (!pokeCache[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokeman = await res.json();
    pokeCache[pokeman.id] = pokeman; // Save the pokemon in the cache
    displayPopup(pokeman);
}
displayPopup(pokeCache[id]);
}

const displayPopup = (pokeman) => {
    const type = pokeman.types.map((type) => type.type.name).join(', ');
    const image = pokeman.sprites['front_default'];
    const abilities = pokeman.abilities.map((ability) => ability.ability.name).join(', ');
    const stats = pokeman.stats.map((stat) => `<span class="${stat.stat.name}"><b>${stat.stat.name}:</b> ${stat.base_stat}</span>`).join(', ');
    const htmlString = `
        <div class="popup">
            <div class="pokemon-info">
                <button id="closeBtn" onclick="closePopup()">Close</button>
                <div class="card">
                    <img class="card-image" src="${image}"/>
                    <p class="card-number">N° ${pokeman.id}</p>
                    <h2 class="card-title">${pokeman.name}</h2>
                    <div class="types">
                        ${type.split(', ').map(type => `<span class="type-${type}">${type}</span>`).join(' ')}
                    </div>
                    <div class="stats-container">
                    <p><small>Height: <span class="stat-circle height">${pokeman.height}</span></small> <small>Weight: <span class="stat-circle weight">${pokeman.weight}</span></small></p>  
                    </div>
                    <div class="stats">
                        <p><small>Stats: ${stats.split(', ').map(stat => `<span class="stat-circle">${stat}</span>`).join(' ')}</small></p>
                    </div>
                    <div class="abilities">
                        <p><small>Abilities: ${abilities}</small></p>
                        <p><small>Base Experience: ${pokeman.base_experience}</small></p>
                        <p><small>Forms: ${pokeman.forms.map((form) => form.name).join(', ')}</small></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    pokedex.innerHTML = htmlString + pokedex.innerHTML;
    console.log(htmlString);
}

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
}


fetchPokemon();

